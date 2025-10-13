import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showWebModal, setShowWebModal] = useState(false);
  const [webCardCode, setWebCardCode] = useState('CODIGO123');

  const handleNFCPress = () => {
    // Simulação de NFC para desenvolvimento
    if (Platform.OS === 'web') {
      // Para web, usar modal customizado
      setShowWebModal(true);
    } else {
      // Para iOS/Android, usar Alert.prompt
      Alert.prompt(
        'Simular NFC',
        'Digite o código do crachá para simular o NFC:',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'OK',
            onPress: (cardCode) => {
              if (cardCode && cardCode.trim()) {
                setIsLoading(true);
                onLogin(cardCode.trim());
              }
            },
          },
        ],
        'plain-text',
        'CODIGO123'
      );
    }
  };

  const handleWebSubmit = () => {
    if (webCardCode && webCardCode.trim()) {
      setShowWebModal(false);
      setIsLoading(true);
      onLogin(webCardCode.trim());
    }
  };

  const handleWebCancel = () => {
    setShowWebModal(false);
    setWebCardCode('CODIGO123');
  };

  return (
    <>
      <LinearGradient
        colors={theme.gradients.screen1}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo-removebg-preview.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Título */}
          <Text style={styles.title}>APROXIME SEU CRACHÁ</Text>
          <Text style={styles.subtitle}>Para iniciar a retirada de insumos</Text>

          {/* Ícone NFC */}
          <TouchableOpacity
            style={[styles.nfcIcon, isLoading && styles.nfcIconDisabled]}
            onPress={handleNFCPress}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons
              name="radio"
              size={60}
              color="white"
            />
          </TouchableOpacity>

          {isLoading && (
            <Text style={styles.loadingText}>Processando...</Text>
          )}
        </View>
      </LinearGradient>

      {/* Modal para Web */}
      <Modal
        visible={showWebModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleWebCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Simular NFC</Text>
            <Text style={styles.modalSubtitle}>
              Digite o código do crachá para simular o NFC:
            </Text>
            
            <TextInput
              style={styles.modalInput}
              value={webCardCode}
              onChangeText={setWebCardCode}
              placeholder="CODIGO123"
              placeholderTextColor="#999"
              autoFocus={true}
              onSubmitEditing={handleWebSubmit}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleWebCancel}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonOk]}
                onPress={handleWebSubmit}
              >
                <Text style={styles.modalButtonTextOk}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 80,
  },
  logoContainer: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  logoImage: {
    width: 700,
    height: 320,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    opacity: 0.9,
  },
  nfcIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  nfcIconDisabled: {
    backgroundColor: theme.colors.gray,
  },
  loadingText: {
    color: theme.colors.white,
    fontSize: 16,
    opacity: 0.8,
  },
  // Estilos do Modal Web
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: Platform.OS === 'web' ? 400 : '85%',
    maxWidth: 500,
    ...theme.shadows.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.dark,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: theme.colors.dark,
    backgroundColor: theme.colors.light,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: theme.colors.light,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  modalButtonOk: {
    backgroundColor: theme.colors.primary,
  },
  modalButtonTextCancel: {
    color: theme.colors.dark,
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextOk: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
