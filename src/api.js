import authService from './services/authService';

// Configuração usando variáveis de ambiente (para EAS Build) ou valores padrão (para desenvolvimento local)
const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://labsync-app-service-gxcsahdpexbcebey.brazilsouth-01.azurewebsites.net/api',
  API_KEY: process.env.EXPO_PUBLIC_API_KEY || 'vasco'
};

/**
 * Wrapper para requisições com tratamento de token
 */
async function fetchWithAuth(url, options = {}) {
  const token = await authService.getToken();
  const isTokenExpired = await authService.isTokenExpired();

  // Se o token expirou, tentar renovar
  if (isTokenExpired && token) {
    const refreshed = await refreshToken();
    if (!refreshed) {
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }
  }

  // Obter token atualizado após refresh
  const currentToken = await authService.getToken();
  
  console.log('fetchWithAuth - Token check:', { url, hasToken: !!currentToken });

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Adicionar token no header se existir
  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
    console.log('Authorization header added, full headers:', headers);
  } else {
    console.warn('No token available for request:', url);
  }

  // Adicionar API Key para rotas que precisam
  if (options.useApiKey) {
    headers['vasco'] = API_CONFIG.API_KEY;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Refresh token usando o refresh token armazenado
 */
async function refreshToken() {
  try {
    const refreshToken = await authService.getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Se o refresh falhou, limpar tokens e forçar logout
      await authService.clearTokens();
      return false;
    }

    const data = await response.json();
    
    // Salvar novos tokens
    const expiryTime = authService.getExpiryTime();
    await authService.saveTokens(data.token, data.refreshToken, expiryTime);
    
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    await authService.clearTokens();
    return false;
  }
}

/**
 * Decodifica um token JWT e retorna o payload
 */
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Busca os dados de um usuário na API usando ID e senha.
 * @param {string} id - ID do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<object>} Os dados do usuário (UserDTO) com token.
 */
export async function authenticateUser(id, password) {
  // Garantir que o ID seja um número
  const userId = typeof id === 'number' ? id : parseInt(id, 10);
  
  const payload = {
    id: userId,
    password: password
  };

  console.log('Login attempt:', { url: `${API_CONFIG.BASE_URL}/auth/login`, payload });

  const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'vasco': API_CONFIG.API_KEY,
    },
    body: JSON.stringify(payload),
  });

  console.log('Response status:', response.status, response.statusText);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `Erro ${response.status}: ${response.statusText}` };
    }
    console.error('Login error:', errorData);
    throw new Error(errorData.message || 'Credencial não reconhecida ou inválida.');
  }

  const loginResponse = await response.json();
  console.log('Login response data:', JSON.stringify(loginResponse, null, 2));
  
  // Se a resposta incluir tokens, salvar
  if (loginResponse.token && loginResponse.refreshToken) {
    const expiryTime = authService.getExpiryTime();
    await authService.saveTokens(loginResponse.token, loginResponse.refreshToken, expiryTime);
    console.log('Tokens saved successfully');
    
    // Decodificar o token JWT para extrair dados do usuário
    const decodedToken = decodeJWT(loginResponse.token);
    console.log('Decoded token payload:', decodedToken);
    
    // Montar objeto userData com tokens e dados do token decodificado
    const userData = {
      ...loginResponse,
      id: decodedToken?.sub || decodedToken?.userId,
      labId: decodedToken?.labId || decodedToken?.lab,
      positionId: decodedToken?.positionId,
      name: decodedToken?.name || `User ${decodedToken?.sub}`,
      lab: decodedToken?.labId || decodedToken?.lab, // Campo lab para compatibilidade
    };
    
    console.log('UserData constructed:', userData);
    
    // Verificar se o token foi salvo corretamente
    const savedToken = await authService.getToken();
    console.log('Token retrieved after save:', savedToken ? 'Token exists' : 'No token found');
    
    return userData;
  } else {
    console.warn('No tokens in response:', { hasToken: !!loginResponse.token, hasRefreshToken: !!loginResponse.refreshToken });
    return loginResponse;
  }
}

/**
 * Busca a lista de insumos/itens de um laboratório específico.
 * @param {number | string} labId 
 * @returns {Promise<Array<object>>} Uma lista de itens do estoque.
 */
export async function fetchItems(labId) {
  const response = await fetchWithAuth(`${API_CONFIG.BASE_URL}/stock/${labId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Não foi possível carregar os itens do estoque.');
  }

  return await response.json();
}

/**
 * Envia a lista de itens retirados para o backend para registrar a operação.
 * @param {object} payload - O objeto completo da requisição, incluindo userId e a lista de itens.
 * @returns {Promise<object>} A resposta de sucesso da API.
 */
export async function submitWithdrawal(payload) {
  const response = await fetchWithAuth(`${API_CONFIG.BASE_URL}/stock/take`, {
    method: 'POST',
    useApiKey: true,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao registrar a retirada.');
  }

  return await response.json();
}
