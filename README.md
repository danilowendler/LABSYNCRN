# LabSync - Quiosque React Native

Aplicação React Native para quiosque de retirada de insumos laboratoriais, desenvolvida com Expo.

## 📱 Funcionalidades

- **Autenticação por NFC**: Simulação de leitura de crachá para login
- **Catálogo de Itens**: Visualização de insumos disponíveis com busca
- **Carrinho de Compras**: Seleção e ajuste de quantidades
- **Revisão de Pedidos**: Confirmação antes da retirada
- **Confirmação de Retirada**: Tela de sucesso com resumo
- **Interface Responsiva**: Otimizada para tablets e dispositivos móveis

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
- `npm run android` - Executa no Android
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

O arquivo `config.js` contém credenciais sensíveis e **NÃO deve ser commitado** no Git. Ele já está incluído no `.gitignore`.

### Configuração Inicial

1. Copie o arquivo de exemplo:
   ```bash
   cp config.exemplo.js config.js
   ```

2. Edite o `config.js` com suas credenciais reais:
   ```javascript
   const API_CONFIG = {
     BASE_URL: 'http://seu-servidor:porta/api',
     API_KEY: 'sua-chave-api'
   };
   
   export default API_CONFIG;
   ```

### Arquivos de Configuração

- `config.exemplo.js` - Arquivo de exemplo (versionado no Git)
- `config.js` - Arquivo com credenciais reais (ignorado pelo Git)

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

## 📋 Próximas Melhorias

- [ ] Integração real com NFC
- [ ] Scanner de código de barras
- [ ] Modo offline
- [ ] Sincronização de dados
- [ ] Relatórios de uso
- [ ] Notificações push

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
