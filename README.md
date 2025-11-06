# LabSync - Quiosque React Native

Aplicação React Native para quiosque de retirada de insumos laboratoriais, desenvolvida com Expo.

## 📱 Funcionalidades

- **Autenticação por NFC**: Leitura de crachá para login com suporte real e simulado
- **Sistema de Tokens JWT**: Autenticação segura com refresh automático
- **Catálogo de Itens**: Visualização de insumos disponíveis com busca
- **Scanner de Código de Barras**: Leitura rápida de códigos EAN/QR
- **Alertas de Estoque**: Notificações de itens com estoque baixo
- **Carrinho de Compras**: Seleção e ajuste de quantidades
- **Revisão de Pedidos**: Confirmação antes da retirada
- **Confirmação de Retirada**: Tela de sucesso com resumo
- **Histórico de Retiradas**: Visualização de retiradas realizadas
- **Interface Responsiva**: Otimizada para tablets e dispositivos móveis

## 🔐 Contas de Teste

Para testar a aplicação, você pode usar as seguintes credenciais cadastradas no backend:

- **Admin** (ID: 42) - Código: `42`
- **Funcionário** (ID: 63) - Código: `63`

Basta digitar o código de acesso no campo de login.

## 🎨 Design

- **Tema DASA**: Cores e identidade visual da DASA
- **Gradientes Animados**: Efeitos visuais modernos
- **Animações Suaves**: Transições e feedback visual
- **Componentes Reutilizáveis**: Arquitetura modular

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Expo CLI: `npm install -g @expo/cli`
- Dispositivo móvel com Expo Go ou emulador

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd LabSyncRN
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a API:
```bash
# Copie o arquivo de exemplo
cp config.exemplo.js config.js

# Edite o config.js com suas credenciais reais
```

4. Execute o projeto:
```bash
npm start
```

### Comandos Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run ios` - Executa no iOS (apenas macOS)
- `npm run web` - Executa no navegador

## 📁 Estrutura do Projeto

```
LabSyncRN/
├── src/
│   ├── screens/          # Telas da aplicação
│   │   ├── LoginScreen.js
│   │   ├── ItemsScreen.js
│   │   ├── ReviewScreen.js
│   │   └── SuccessScreen.js
│   ├── components/       # Componentes reutilizáveis
│   │   ├── ItemModal.js
│   │   └── Toast.js
│   ├── App.js           # Componente principal
│   ├── api.js           # Serviços de API
│   ├── state.js         # Estado global
│   └── theme.js         # Tema e estilos
├── assets/              # Imagens e recursos
├── config.js           # Configurações da API
└── App.js              # Ponto de entrada
```

## 🔧 Configuração da API

### ⚠️ Importante - Segurança

As configurações da API agora usam **variáveis de ambiente** para maior segurança durante o build. O arquivo `config.js` ainda pode ser usado para desenvolvimento local, mas não é necessário para builds do EAS.

### Configuração para Desenvolvimento Local

1. Copie o arquivo de exemplo:
   ```bash
   cp config.exemplo.js config.js
   ```

2. Edite o `config.js` com suas credenciais reais (opcional - o código tem valores padrão):
   ```javascript
   const API_CONFIG = {
     BASE_URL: 'https://labsync-app-service-gxcsahdpexbcebey.brazilsouth-01.azurewebsites.net/api',
     API_KEY: 'sua-chave-api'
   };
   
   export default API_CONFIG;
   ```

**Nota**: O código atual usa variáveis de ambiente com fallback para valores padrão. O `config.js` não é mais necessário, mas ainda funciona para sobrescrever os valores padrão.

### Configuração para Build EAS (Produção)

Para builds do EAS, você **deve** configurar variáveis de ambiente:

1. Configure as variáveis de ambiente no EAS:
   ```bash
   eas secret:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value "https://labsync-app-service-gxcsahdpexbcebey.brazilsouth-01.azurewebsites.net/api"
   
   eas secret:create --scope project --name EXPO_PUBLIC_API_KEY --value "sua-chave-api"
   ```

2. Ou configure via dashboard do Expo:
   - Acesse: https://expo.dev/accounts/[sua-conta]/projects/[seu-projeto]
   - Vá em **Settings** → **Environment Variables**
   - Adicione:
     - `EXPO_PUBLIC_API_BASE_URL` = URL da sua API
     - `EXPO_PUBLIC_API_KEY` = Sua chave API

3. Para definir variáveis específicas por perfil de build:
   ```bash
   # Para preview
   eas secret:create --scope project --name EXPO_PUBLIC_API_KEY --value "sua-chave" --type string --visibility preview
   
   # Para production
   eas secret:create --scope project --name EXPO_PUBLIC_API_KEY --value "sua-chave" --type string --visibility production
   ```

### Arquivos de Configuração

- `config.exemplo.js` - Arquivo de exemplo (versionado no Git)
- `config.js` - Arquivo com credenciais reais (ignorado pelo Git, opcional)

## 📱 Telas da Aplicação

### 1. Tela de Login
- Aproximação do crachá (simulação)
- Gradiente animado de fundo
- Interface intuitiva

### 2. Tela de Itens
- Lista de insumos disponíveis
- Busca por nome ou código
- Carrinho com contador
- Cards responsivos

### 3. Tela de Revisão
- Lista de itens selecionados
- Controles de quantidade
- Botão de confirmação

### 4. Tela de Sucesso
- Confirmação da retirada
- Resumo dos itens
- Redirecionamento automático

## 🎯 Funcionalidades Especiais

### Simulação de NFC
Para desenvolvimento, a aplicação inclui uma simulação de NFC que permite testar o fluxo completo digitando códigos de crachá.

### Busca Inteligente
Sistema de busca que filtra itens por nome ou código em tempo real.

### Estados de Loading
Indicadores visuais durante carregamento de dados e processamento.

### Tratamento de Erros
Mensagens de erro amigáveis e recuperação automática.

## 🔄 Fluxo da Aplicação

1. **Login**: Usuário aproxima crachá (simulado)
2. **Autenticação**: Validação com API backend
3. **Carregamento**: Busca de itens do laboratório
4. **Seleção**: Usuário adiciona itens ao carrinho
5. **Revisão**: Confirmação dos itens selecionados
6. **Retirada**: Envio para API e confirmação
7. **Sucesso**: Tela de confirmação e reset

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework mobile
- **Expo**: Plataforma de desenvolvimento
- **React Navigation**: Navegação entre telas
- **Expo Linear Gradient**: Gradientes
- **Expo Vector Icons**: Ícones
- **React Native Safe Area Context**: Área segura

## ✅ Funcionalidades Implementadas

- [x] Scanner de código de barras
- [x] Notificações de estoque baixo
- [x] Indicadores visuais de estoque crítico
- [x] Busca inteligente com escaneamento
- [x] Integração real com NFC
- [x] Sistema de autenticação com tokens JWT
- [x] Refresh token automático
- [x] Histórico de retiradas
- [x] Proteção de rotas autenticadas

## 📋 Próximas Melhorias

- [ ] Modo offline
- [ ] Sincronização de dados offline
- [ ] Notificações push
- [ ] Biometria para autenticação rápida

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
