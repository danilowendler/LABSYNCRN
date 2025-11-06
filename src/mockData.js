/**
 * Dados mockados para demonstração quando a API não estiver disponível
 * Baseado nos itens reais do sistema
 */

export const mockItems = [
  {
    id: 1,
    name: 'COMPRESSA DE GAZE ESTÉRIL 14x28CM C/10',
    eanCode: '7891040083046',
    quantity: 782,
    minQuantity: 50,
    localImage: require('../assets/compressa_de_gaze_estéril.webp'),
  },
  {
    id: 2,
    name: 'LUVA DE LATEX M CX C/100',
    eanCode: '7898283815328',
    quantity: 430,
    minQuantity: 30,
    localImage: require('../assets/luva_latex.webp'),
  },
  {
    id: 3,
    name: 'MÁSCARA CIRURGICA DESCARTAVEL CX C/10',
    eanCode: '7908271302522',
    quantity: 701,
    minQuantity: 50,
    localImage: require('../assets/mascara_cirurgica.webp'),
  },
  {
    id: 4,
    name: 'AGULHA DE SEGURANÇA PARA COLETAS DE SANGUE MÚLTIPLA 22G C/100 UN',
    eanCode: '7898283818749',
    quantity: 1481,
    minQuantity: 100,
    localImage: require('../assets/agula_seguranca.webp'),
  },
  {
    id: 5,
    name: 'CURATIVO ADESIVO MEDIX',
    eanCode: '7898283819000',
    quantity: 350,
    minQuantity: 40,
    localImage: require('../assets/curativo_adesivo.webp'),
  },
  {
    id: 6,
    name: 'ESPARADRAPO CREPE 2,5CM X 4,5M',
    eanCode: '7898283819001',
    quantity: 245,
    minQuantity: 30,
    localImage: require('../assets/esparadrapo.jpg'),
  },
  {
    id: 7,
    name: 'ÁLCOOL 70% 500ML',
    eanCode: '7898283819002',
    quantity: 520,
    minQuantity: 50,
    localImage: require('../assets/alcool_70.webp'),
  },
  {
    id: 8,
    name: 'SERINGA DESCARTÁVEL 5ML C/100',
    eanCode: '7898283819003',
    quantity: 890,
    minQuantity: 80,
    localImage: require('../assets/seringa.webp'),
  },
  {
    id: 9,
    name: 'LUVA DE NITRILA DESCARTÁVEL TAMANHO M C/100',
    eanCode: '7898283819004',
    quantity: 620,
    minQuantity: 60,
    localImage: require('../assets/luva_nitrilica.webp'),
  },
  {
    id: 10,
    name: 'AGULHA DESCARTÁVEL 25X7 C/100',
    eanCode: '7898283819005',
    quantity: 1100,
    minQuantity: 100,
    localImage: require('../assets/agulha.webp'),
  },
];

/**
 * Dados mockados de usuário para modo demo
 */
export const mockUser = {
  id: 1,
  name: 'Usuário Demo',
  lab: 1,
  labId: 1,
  positionId: 1,
  token: 'mock-token-demo',
  refreshToken: 'mock-refresh-token-demo',
};

/**
 * Função para simular delay de rede (opcional)
 */
export const simulateNetworkDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

