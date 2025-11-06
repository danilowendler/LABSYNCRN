import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@labsync:token';
const REFRESH_TOKEN_KEY = '@labsync:refreshToken';
const TOKEN_EXPIRY_KEY = '@labsync:tokenExpiry';
const USER_DATA_KEY = '@labsync:userData';

class AuthService {
  /**
   * Salva o token e refresh token no AsyncStorage
   */
  async saveTokens(token, refreshToken, expiryTime) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  /**
   * Obtém o token armazenado
   */
  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Obtém o refresh token armazenado
   */
  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Verifica se o token está expirado
   */
  async isTokenExpired() {
    try {
      const expiryTime = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
      
      if (!expiryTime) {
        return true;
      }

      const expiry = parseInt(expiryTime, 10);
      const now = Date.now();
      
      return now >= expiry;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated() {
    const token = await this.getToken();
    const isExpired = await this.isTokenExpired();
    
    return token !== null && !isExpired;
  }

  /**
   * Limpa todos os tokens (logout)
   */
  async clearTokens() {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, TOKEN_EXPIRY_KEY]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  /**
   * Obtém o tempo de expiração do token
   */
  async getTokenExpiry() {
    try {
      return await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Error getting token expiry:', error);
      return null;
    }
  }

  /**
   * Calcula o tempo de expiração (1 dia a partir de agora)
   */
  getExpiryTime() {
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000; // 1 dia em milissegundos
    return now + oneDayInMs;
  }

  /**
   * Salva os dados do usuário
   */
  async saveUserData(userData) {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  /**
   * Obtém os dados do usuário
   */
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Limpa os dados do usuário
   */
  async clearUserData() {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  /**
   * Faz logout completo (tokens + dados do usuário)
   */
  async logout() {
    await this.clearTokens();
    await this.clearUserData();
  }
}

export default new AuthService();
