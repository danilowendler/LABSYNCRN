import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Tentar diferentes métodos de carregamento da logo
  const [logoSource, setLogoSource] = useState(() => {
    // Primeiro, tentar require direto
    try {
      return require('../../assets/logo-removebg-preview.png');
    } catch (e) {
      console.log('Erro ao carregar logo com require:', e);
      return null;
    }
  });

  useEffect(() => {
    // Tentar carregar usando expo-asset como fallback
    if (!logoSource) {
      const loadLogo = async () => {
        try {
          const asset = Asset.fromModule(require('../../assets/logo-removebg-preview.png'));
          await asset.downloadAsync();
          setLogoSource({ uri: asset.localUri || asset.uri });
        } catch (error) {
          console.log('Erro ao carregar logo com Asset:', error);
          // Último fallback: usar recurso local
          setLogoSource({ uri: 'logo_removebg_preview' });
        }
      };
      loadLogo();
    }
  }, [logoSource]);

  const handleLogin = () => {
    if (!id.trim() || !password.trim()) {
      return;
    }
    
    setIsLoading(true);
    onLogin(id.trim(), password.trim());
    setIsLoading(false);
  };

  return (
    <LinearGradient
      colors={theme.gradients.screen1}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          {logoSource && (
            <Image 
              source={logoSource}
              style={styles.logoImage}
              resizeMode="contain"
              onError={(error) => {
                console.log('Erro ao carregar logo, tentando fallback local:', error);
                // Fallback final: usar recurso local
                setLogoSource({ uri: 'logo_removebg_preview' });
              }}
            />
          )}
        </View>

        {/* Título */}
        <Text style={styles.title}>LOGIN</Text>
        <Text style={styles.subtitle}>Digite seu ID e senha</Text>

        {/* Input de ID */}
        <View style={styles.inputContainer}>
          <Ionicons 
            name="person" 
            size={24} 
            color={theme.colors.gray} 
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite seu ID"
            placeholderTextColor={theme.colors.gray}
            value={id}
            onChangeText={setId}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            editable={!isLoading}
          />
        </View>

        {/* Input de Senha */}
        <View style={styles.inputContainer}>
          <Ionicons 
            name="lock-closed" 
            size={24} 
            color={theme.colors.gray} 
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor={theme.colors.gray}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onSubmitEditing={handleLogin}
            editable={!isLoading}
          />
        </View>

        {/* Botão de Login */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading || !id.trim() || !password.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
          </Text>
        </TouchableOpacity>

        {/* Informações adicionais */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={16} color={theme.colors.white} />
          <Text style={styles.infoText}>
            Conta Admin: ID 42, Senha: Admin@0101{'\n'}
            Conta Funcionário: ID 63, Senha: SenhaForte@123
          </Text>
        </View>
      </View>
    </LinearGradient>
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
    paddingTop: Platform.OS === 'web' ? 0 : 50,
  },
  logoContainer: {
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 0 : 0,
  },
  logoImage: {
    width: Platform.OS === 'web' ? width * 0.5 : width,
    height: Platform.OS === 'web' ? width * 0.23 : width * 0.72,
    maxWidth: Platform.OS === 'web' ? 700 : width,
    maxHeight: Platform.OS === 'web' ? 320 : width * 0.72,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    opacity: 0.9,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    maxWidth: 400,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.md,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.dark,
  },
  loginButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  loginButtonDisabled: {
    backgroundColor: theme.colors.gray,
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  infoText: {
    color: theme.colors.white,
    fontSize: 14,
    marginLeft: theme.spacing.sm,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default LoginScreen;