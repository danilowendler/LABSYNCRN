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

// Components
import ItemModal from './components/ItemModal';
import Toast from './components/Toast';

// Services
import { authenticateUser, fetchItems, submitWithdrawal } from './api';
import { state } from './state';
import { theme } from './theme';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('screen1');
  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastWithdrawal, setLastWithdrawal] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  // Back handler para Android
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
        setCurrentScreen('screen1');
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

  const handleLogin = async (cardCode) => {
    setIsLoading(true);
    showToast(`Lendo crachá ${cardCode}...`, 'info');

    try {
      const userData = await authenticateUser(cardCode);
      showToast(`Bem-vindo, ${userData.name}!`, 'success');
      
      setCurrentUser(userData);
      setCurrentScreen('screen2');

      // Buscar itens do laboratório
      const itemsFromApi = await fetchItems(userData.lab);
      
      const formattedItems = itemsFromApi.map(item => ({
        id: item.id,
        name: item.name,
        code: item.eanCode,
        maxStock: item.quantity,
        stock: item.quantity > item.minQuantity ? 'normal' : 'critical',
        imageUrl: item.imageUrl || 'https://via.placeholder.com/90x90',
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

  const handleLogout = () => {
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
    const itemsInCart = items.filter(item => item.quantity > 0);
    if (itemsInCart.length === 0) {
      showToast('Nenhum item selecionado para retirada.', 'info');
      return;
    }

    const payload = {
      userId: currentUser.id,
      items: itemsInCart.map(item => ({
        id: item.id,
        takeQuantity: item.quantity,
        labId: currentUser.lab
      }))
    };

    try {
      await submitWithdrawal(payload);
      showToast('Retirada confirmada com sucesso!', 'success');
      setLastWithdrawal([...itemsInCart]);
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
    setCurrentScreen('screen1');
    setLastWithdrawal([]);
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
            onItemClick={handleItemClick}
            onLogout={handleLogout}
            onReviewItems={handleReviewItems}
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
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

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
