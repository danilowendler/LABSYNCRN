import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import LoginScreen from './screens/LoginScreen';
import ItemsScreen from './screens/ItemsScreen';
import ReviewScreen from './screens/ReviewScreen';
import SuccessScreen from './screens/SuccessScreen';
import HistoryScreen from './screens/HistoryScreen';

// Components
import ItemModal from './components/ItemModal';
import Toast from './components/Toast';

// Services
import { authenticateUser, fetchItems, submitWithdrawal } from './api';
import authService from './services/authService';
import { state } from './state';
import { theme } from './theme';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('screen1');
  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastWithdrawal, setLastWithdrawal] = useState([]);
  const [history, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Verificar autenticação ao iniciar o app
  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        // Se está autenticado, carregar dados do usuário
        const userData = await authService.getUserData();
        
        if (userData) {
          setCurrentUser(userData);
          setCurrentScreen('screen2');
          
          // Carregar itens do laboratório
          try {
            const itemsFromApi = await fetchItems(userData.lab);
            const formattedItems = itemsFromApi.map(item => ({
              id: item.id,
              name: item.name,
              code: item.eanCode,
              maxStock: item.quantity,
              stock: item.quantity > item.minQuantity ? 'normal' : 'critical',
              imageUrl: item.imageUrl || 'https://via.placeholder.com/90x90',
              localImage: item.localImage || null, // Incluir imagem local se disponível
              quantity: 0
            }));
            setItems(formattedItems);
          } catch (error) {
            console.error('Error loading items:', error);
            // Se falhar ao carregar itens, fazer logout
            await authService.logout();
            setCurrentScreen('screen1');
          }
        } else {
          // Tem token mas não tem dados do usuário, fazer logout
          await authService.logout();
          setCurrentScreen('screen1');
        }
      } else {
        // Não está autenticado, ir para tela de login
        setCurrentScreen('screen1');
      }
      
      setIsCheckingAuth(false);
    };

    checkAuthentication();
  }, []);

  // Back handler
  useEffect(() => {
    const backAction = () => {
      if (currentScreen === 'screen1') {
        return false; // Permite sair do app
      } else if (currentScreen === 'screen2') {
        handleLogout();
        return true;
      } else if (currentScreen === 'screen3') {
        setCurrentScreen('screen2');
        return true;
      } else if (currentScreen === 'screen4') {
        setCurrentScreen('screen2');
        return true;
      } else if (currentScreen === 'screen5') {
        setCurrentScreen('screen2');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentScreen]);

  // Atualizar estado global
  useEffect(() => {
    state.currentScreen = currentScreen;
    state.currentUser = currentUser;
    state.items = items;
    state.isLoading = isLoading;
    state.lastWithdrawal = lastWithdrawal;
  }, [currentScreen, currentUser, items, isLoading, lastWithdrawal]);

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleLogin = async (id, password) => {
    setIsLoading(true);
    showToast(`Logando...`, 'info');

    try {
      const userData = await authenticateUser(id, password);
      console.log('UserData received in App.js:', userData);
      console.log('Lab ID from userData:', userData.lab, userData.labId, userData.laboratoryId);
      
      showToast(`Bem-vindo, ${userData.name || userData.user?.name || 'Usuário'}!`, 'success');
      
      // Salvar dados do usuário
      await authService.saveUserData(userData);
      
      setCurrentUser(userData);
      setCurrentScreen('screen2');

      // Buscar itens do laboratório (com token de autenticação)
      // Tentar diferentes possíveis nomes de campo para o lab ID
      const labId = userData.lab || userData.labId || userData.laboratoryId || userData.user?.lab || userData.user?.labId;
      console.log('Using labId:', labId);
      
      if (!labId) {
        throw new Error('ID do laboratório não encontrado na resposta do servidor');
      }
      
      const itemsFromApi = await fetchItems(labId);
      
      const formattedItems = itemsFromApi.map(item => ({
        id: item.id,
        name: item.name,
        code: item.eanCode,
        maxStock: item.quantity,
        stock: item.quantity > item.minQuantity ? 'normal' : 'critical',
        imageUrl: item.imageUrl || 'https://via.placeholder.com/90x90',
        localImage: item.localImage || null, // Incluir imagem local se disponível
        quantity: 0
      }));
      
      setItems(formattedItems);
      setIsLoading(false);

    } catch (error) {
      showToast(error.message, 'error');
      setIsLoading(false);
      setCurrentScreen('screen1');
    }
  };

  const handleLogout = async () => {
    // Limpar tokens e dados do usuário
    await authService.logout();
    
    setCurrentUser(null);
    setItems([]);
    setLastWithdrawal([]);
    setCurrentScreen('screen1');
    showToast('Logout realizado com sucesso', 'info');
  };

  const handleItemAdd = (itemId) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + 1;
          if (newQuantity <= item.maxStock) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const handleItemRemove = (itemId) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: 0 };
        }
        return item;
      })
    );
  };

  const handleQuantityChange = (itemId, delta) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity >= 0 && newQuantity <= item.maxStock) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  // Sincronizar selectedItem com o item atualizado quando items mudar e modal estiver aberto
  useEffect(() => {
    if (modalVisible && selectedItem) {
      const updatedItem = items.find(i => i.id === selectedItem.id);
      if (updatedItem) {
        setSelectedItem(updatedItem);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleItemClick = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleReviewItems = () => {
    setCurrentScreen('screen3');
  };

  const handleCancelReview = () => {
    setCurrentScreen('screen2');
  };

  const handleConfirmWithdrawal = async () => {
    // Verificar autenticação antes de confirmar retirada
    const isAuthenticated = await authService.isAuthenticated();
    if (!isAuthenticated) {
      showToast('Sessão expirada. Faça login novamente.', 'error');
      await authService.clearTokens();
      setCurrentScreen('screen1');
      return;
    }

    const itemsInCart = items.filter(item => item.quantity > 0);
    if (itemsInCart.length === 0) {
      showToast('Nenhum item selecionado para retirada.', 'info');
      return;
    }

    // Usar labId ou lab do usuário
    const labId = currentUser.labId || currentUser.lab;
    console.log('Current user:', currentUser);
    console.log('Lab ID for withdrawal:', labId);
    
    if (!labId) {
      showToast('Erro: ID do laboratório não encontrado.', 'error');
      return;
    }

    const payload = {
      userId: currentUser.id,
      items: itemsInCart.map(item => ({
        id: item.id,
        takeQuantity: item.quantity,
        labId: labId
      }))
    };

    try {
      console.log('Submitting withdrawal with payload:', payload);
      const result = await submitWithdrawal(payload);
      console.log('Withdrawal result:', result);
      showToast('Retirada confirmada com sucesso!', 'success');
      setLastWithdrawal([...itemsInCart]);
      
      // Adicionar ao histórico
      const historyEntry = {
        date: new Date().toISOString(),
        userName: currentUser.name,
        totalItems: itemsInCart.length,
        items: itemsInCart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
        })),
      };
      setHistory(prevHistory => [historyEntry, ...prevHistory]);
      
      setCurrentScreen('screen4');
      
      // Reset quantities
      setItems(prevItems => 
        prevItems.map(item => ({ ...item, quantity: 0 }))
      );

    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleSuccessComplete = () => {
    setCurrentScreen('screen2');
    setLastWithdrawal([]);
  };

  const handleViewHistory = () => {
    setCurrentScreen('screen5');
  };

  const handleBackFromHistory = () => {
    setCurrentScreen('screen2');
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'screen1':
        return <LoginScreen onLogin={handleLogin} />;
      case 'screen2':
        return (
          <ItemsScreen
            items={items}
            currentUser={currentUser}
            isLoading={isLoading}
            onItemAdd={handleItemAdd}
            onItemRemove={handleItemRemove}
            onItemClick={handleItemClick}
            onLogout={handleLogout}
            onReviewItems={handleReviewItems}
            onViewHistory={handleViewHistory}
            cartItemCount={cartItemCount}
          />
        );
      case 'screen3':
        return (
          <ReviewScreen
            items={items}
            onQuantityChange={handleQuantityChange}
            onConfirmWithdrawal={handleConfirmWithdrawal}
            onCancel={handleCancelReview}
          />
        );
      case 'screen4':
        return (
          <SuccessScreen
            lastWithdrawal={lastWithdrawal}
            onComplete={handleSuccessComplete}
          />
        );
      case 'screen5':
        return (
          <HistoryScreen
            history={history}
            onBack={handleBackFromHistory}
          />
        );
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  // Mostrar loading durante verificação de autenticação
  if (isCheckingAuth) {
    return (
      <SafeAreaProvider>
        <View style={styles.container} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderScreen()}
        
        <ItemModal
          visible={modalVisible}
          item={selectedItem}
          onClose={handleCloseModal}
          onQuantityChange={handleQuantityChange}
        />

        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
  },
});

export default App;
