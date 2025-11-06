# Changelog - LabSyncRN

## [2.1.0] - Remoção de NFC e Scanner - Aplicativo Simplificado

### 🧹 Limpeza de Código

Removidas todas as funcionalidades de **NFC** e **Scanner de Código de Barras**:

- ❌ **NFC Service removido** - `src/services/nfcService.js` deletado
- ❌ **BarcodeScanner removido** - `src/components/BarcodeScanner.js` deletado
- ❌ **Dependências removidas** - `react-native-nfc-manager` e `expo-barcode-scanner` desinstaladas
- ✅ **Interface simplificada** - Apenas login tradicional com código

### 📝 Mudanças Técnicas

#### Arquivos Removidos
- `src/services/nfcService.js`
- `src/components/BarcodeScanner.js`

#### Arquivos Modificados
- `src/screens/ItemsScreen.js` - Removido botão e funcionalidade de scanner
- `app.json` - Removido plugin do expo-barcode-scanner
- `package.json` - Removidas dependências NFC e barcode

### 🎯 Funcionalidades Atuais

O aplicativo agora é **100% focado em login tradicional**:
1. ✅ Login com código de acesso (sem NFC)
2. ✅ Autenticação persistente (token válido por 24h)
3. ✅ Busca de itens por nome ou código
4. ✅ Carrinho e revisão de itens
5. ✅ Histórico de retiradas

### 💡 Benefícios

- **Código mais limpo** - Sem dependências de hardware complexas
- **Mais leve** - Menos pacotes instalados
- **Mais simples** - Foco no fluxo principal de negócio
- **Mais rápido** - Menos módulos nativos para carregar

## [2.0.0] - Aplicativo Mobile com Autenticação Persistente

### 🔄 Mudança de Paradigma

O LabSyncRN agora é focado em uso **mobile** (celular), não mais quiosque com NFC/crachá. O sistema funciona da seguinte forma:

1. **Primeiro Login**: Usuário faz login uma vez com código de acesso
2. **Autenticação Persistente**: Token é salvo e válido por 24h
3. **Acesso Rápido**: Ao reabrir o app, se tiver token válido, vai direto para a tela de itens
4. **Fluxo Mobile**: Login → Itens → Revisão → Sucesso → Logout

### ✨ Novas Funcionalidades

#### Autenticação Persistente
- **Verificação automática** ao iniciar o app
- Se tiver **token válido**, carrega dados do usuário e vai direto para screen2
- Se não tiver token, mostra tela de login
- Tokens salvos no AsyncStorage por 24h
- Dados do usuário também são salvos localmente

#### Nova Tela de Login
- **Login tradicional** com campo de texto para código
- Sem dependência de NFC/crachá
- Interface mobile-friendly
- Validação de entrada
- Botão de login com feedback visual

### 🔧 Mudanças Técnicas

#### Arquivos Modificados
- `src/services/authService.js` - Adicionados métodos para salvar/recuperar dados do usuário
- `src/App.js` - Verificação de autenticação ao iniciar, carregamento automático de dados
- `src/screens/LoginScreen.js` - Refatorada completamente para login tradicional

#### Novos Métodos no authService
- `saveUserData()` - Salva dados do usuário no AsyncStorage
- `getUserData()` - Recupera dados do usuário
- `clearUserData()` - Limpa dados do usuário
- `logout()` - Faz logout completo (tokens + dados do usuário)

#### Fluxo de Autenticação
```javascript
// Ao iniciar o app
const isAuthenticated = await authService.isAuthenticated();
if (isAuthenticated) {
  const userData = await authService.getUserData();
  // Ir direto para tela de itens
  setCurrentUser(userData);
  setCurrentScreen('screen2');
} else {
  // Mostrar tela de login
  setCurrentScreen('screen1');
}
```

### 📱 Como Funciona

1. **Primeira Vez**: Usuário abre app → vê tela de login → digita código → entra
2. **Próximas Vezes**: Usuário abre app → verifica token → vai direto para itens
3. **Token Expira**: Usuário precisa fazer login novamente
4. **Logout Manual**: Limpa tudo e volta para login

### 🎯 Benefícios

- **Acesso Rápido**: Não precisa fazer login toda vez
- **Experiência Mobile**: Otimizado para uso em celular
- **Sem NFC**: Não depende de hardware específico
- **Melhor UX**: Login simples e direto ao ponto

## [1.4.0] - Suporte Completo para Web (Teste sem NFC)

### 🌐 Suporte para Navegadores Web

#### NFC Mock para Web
- **Detecção automática** da plataforma web
- **NFC Service** modificado para evitar erros em web
- Todos os métodos NFC agora verificam se está rodando em web antes de executar
- Retorno seguro sem lançar erros quando em web

#### Como Testar na Web
- Execute `npm run web` para testar no navegador
- Modal de simulação aparece automaticamente ao clicar no NFC
- Digite qualquer código de crachá para simular
- Todas as funcionalidades funcionam normalmente: autenticação, itens, carrinho
- Scanner de código de barras funciona com a câmera do computador

### 📝 Mudanças Técnicas

#### Arquivos Modificados
- `src/services/nfcService.js` - Detecção de plataforma web e proteção em todos os métodos
- `INSTRUCOES.md` - Adicionada seção sobre teste web

#### Detalhes da Implementação
- Adicionada propriedade `isWeb` no construtor do NFCService
- Todos os métodos agora verificam `if (this.isWeb)` antes de usar NfcManager
- Retornos seguros sem erros para plataforma web
- LoginScreen já tinha lógica para modal web, agora funciona perfeitamente

## [1.3.0] - Sistema de Autenticação com Tokens

### 🔐 Novas Funcionalidades de Segurança

#### Autenticação com Token JWT
- **Serviço authService** criado para gerenciar tokens
- Armazenamento seguro de tokens usando AsyncStorage
- Token de acesso expira em 1 dia
- Refresh token automático quando necessário
- Verificação de autenticação em todas as rotas protegidas
- Redirecionamento automático para login quando não autenticado

#### Refresh Token Automático
- Renovação automática de tokens expirados
- Endpoint `/auth/refresh` para renovação
- Limpeza automática de tokens inválidos
- Logout automático quando refresh falha

#### Proteção de Rotas
- Verificação de autenticação antes de acessar itens
- Validação de token antes de confirmar retiradas
- Bloqueio de ações quando sessão expira
- Mensagens de erro claras quando não autenticado

### 🔧 Mudanças Técnicas

#### Arquivos Criados
- `src/services/authService.js` - Gerenciamento de autenticação

#### Arquivos Modificados
- `src/api.js` - Integração com token em todas as requisições
- `src/App.js` - Verificação de autenticação e proteção de rotas
- Todas as requisições agora incluem header `Authorization: Bearer {token}`

### 📋 Como Funciona

1. **Login**: Ao fazer login, tokens são salvos no AsyncStorage
2. **Requisições**: Todas as requisições incluem o token no header
3. **Validação**: Antes de cada ação, verifica se o token é válido
4. **Refresh**: Se o token expirou, tenta renovar automaticamente
5. **Logout**: Limpa todos os tokens do AsyncStorage

### 🎯 Segurança Implementada

- ✅ Token JWT para autenticação
- ✅ Refresh token para renovação
- ✅ Expiração de token em 1 dia
- ✅ Verificação de autenticação em todas as ações
- ✅ Redirecionamento automático para login
- ✅ Limpeza de dados ao fazer logout

### ⚠️ Nota Importante

A rota de login (`/users/{cardCode}`) não requer token, mas pode retornar tokens no response para serem salvos. Todas as outras rotas requerem token válido no header.

---

## [1.2.1] - Atualização da URL da API

### 🔧 Mudanças Técnicas

- **Nova URL da API**: Migração para Azure App Service
  - Antes: `http://74.163.240.8:8081/api`
  - Agora: `https://labsync-app-service-gxcsahdpexbcebey.brazilsouth-01.azurewebsites.net/api`
- **Protocolo HTTPS**: API agora utiliza protocolo seguro
- **Atualização de arquivos**:
  - `config.js` - URL atualizada
  - `config.exemplo.js` - Exemplo atualizado

---

## [1.2.0] - Integração NFC Real e Histórico

### ✨ Novas Funcionalidades

#### Integração Real NFC
- **Serviço NFCService** criado
- Leitura real de tags NFC-A usando `react-native-nfc-manager`
- Detecção automática quando disponível
- Fallback para modo simulado quando NFC não disponível
- Verificação de status do NFC no dispositivo
- Botão para abrir configurações quando NFC desabilitado
- Cancelamento de leitura
- Mensagens visuais durante processo de leitura

#### Sistema de Histórico e Relatórios
- **Tela HistoryScreen** criada
- Visualização de todas as retiradas realizadas na sessão
- Detalhes de cada retirada (data, usuário, itens)
- Botão de acesso no header da tela de itens
- Formatação de data em português brasileiro
- Estado persistente durante sessão

### 📦 Dependências Adicionadas

- `react-native-nfc-manager@latest` - Gerenciamento de NFC

### 🔧 Arquivos Criados/Modificados

- `src/services/nfcService.js` - Novo serviço
- `src/screens/HistoryScreen.js` - Nova tela
- `src/screens/LoginScreen.js` - Integração NFC real
- `src/screens/ItemsScreen.js` - Botão de histórico
- `src/App.js` - Estado e navegação de histórico
- `package.json` - Dependências atualizadas
- `INSTRUCOES.md` - Documentação atualizada

### 🎯 Status dos Próximos Passos

#### ✅ Implementado
- Integração Real NFC
- Relatórios e Histórico
- Scanner de Código de Barras
- Notificações de Estoque Baixo

#### ⏳ Pendente
- Modo Offline

---

## [1.1.0] - Próximos Passos Implementados

### ✨ Novas Funcionalidades

#### Scanner de Código de Barras
- **Componente BarcodeScanner** adicionado
- Leitura de códigos de barras EAN, QR e outros formatos
- Interface visual com viewfinder e instruções
- Gerenciamento automático de permissões de câmera
- Integração com a tela de itens
- Busca automática do item após escaneamento
- Feedback visual quando item não é encontrado

#### Sistema de Alertas de Estoque
- **Componente StockAlert** adicionado
- Notificação visual de itens com estoque crítico
- Banner informativo que pode ser fechado
- Contagem de itens em estoque baixo
- Design consistente com o tema DASA

### 🎨 Melhorias de UX

- Botão de scanner integrado na barra de busca
- Indicadores visuais para estoque crítico
- Alertas não intrusivos que podem ser fechados
- Feedback imediato ao escanear códigos

### 📦 Dependências Adicionadas

- `expo-barcode-scanner@^13.0.1` - Leitura de códigos de barras
- `expo-camera@^17.0.8` - Acesso à câmera do dispositivo

### 📝 Documentação Atualizada

- INSTRUCOES.md - Instruções de uso do scanner e alertas
- README.md - Funcionalidades atualizadas
- Novo arquivo CHANGELOG.md criado

### 🔧 Arquivos Modificados

- `src/components/BarcodeScanner.js` - Novo componente
- `src/components/StockAlert.js` - Novo componente
- `src/screens/ItemsScreen.js` - Integração do scanner e alertas
- `package.json` - Dependências atualizadas
- `INSTRUCOES.md` - Documentação atualizada
- `README.md` - Funcionalidades atualizadas

### 🎯 Status dos Próximos Passos

#### ✅ Implementado
- Scanner de Código de Barras
- Notificações de Estoque Baixo

#### ⏳ Pendente
- Integração Real NFC
- Modo Offline
- Relatórios e Histórico

---

## [1.0.0] - Versão Inicial

### Funcionalidades Base
- Autenticação por NFC (simulado)
- Catálogo de itens com busca
- Carrinho de compras
- Revisão de pedidos
- Confirmação de retirada
- Tema DASA
- Design responsivo
