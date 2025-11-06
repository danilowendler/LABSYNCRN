# 🚀 Instruções de Uso - LabSync React Native

## Como Testar a Aplicação

### 1. Executar o Projeto

```bash
cd LabSyncRN
npm start
```

### 2. Testar no Dispositivo

- **Mobile**: Escaneie o QR code com o app Expo Go
- **iOS**: Escaneie o QR code com a câmera do iPhone
- **Web**: Pressione 'w' no terminal para abrir no navegador

#### 🖥️ Testando na Web (Sem NFC Físico)

Para testar no navegador web sem hardware NFC:

```bash
npm run web
```

**Como funciona no web:**
- O NFC real não está disponível no navegador
- Ao clicar no ícone NFC, um modal aparece automaticamente
- Digite qualquer código de crachá (ex: `CODIGO123`) para simular
- O fluxo completo funciona normalmente: autenticação, itens, carrinho, etc.
- O scanner de código de barras também funciona no navegador (use a câmera do computador)

**Nota**: A aplicação detecta automaticamente quando está rodando em web e usa o modo simulado do NFC.

### 3. Contas de Teste

Para realizar testes de autenticação, use as seguintes credenciais cadastradas no banco de dados:

#### 👤 Conta de Administrador
- **Código de Acesso**: `42`
- **Perfil**: Admin@0101
- **ID**: 42

#### 👤 Conta de Funcionário Padrão
- **Código de Acesso**: `63`
- **Perfil**: SenhaForte@123
- **ID**: 63

**Como usar**: Digite o código de acesso (42 ou 63) no campo de login e pressione "ENTRAR".

### 4. Fluxo de Teste

#### Tela de Login (Screen 1)
- **Primeira vez**: Abre tela de login
- Digite o código de acesso no campo de texto (use: `42` ou `63`)
- Pressione "ENTRAR" ou Enter
- A aplicação autenticará e salvará o token

#### Próximas Vezes
- **Ao abrir o app**: Se tiver token válido, vai direto para tela de itens
- **Se token expirar**: Volta para tela de login automaticamente
- **Para fazer logout**: Toque em "Sair" na tela de itens

#### Tela de Itens (Screen 2)
- Visualize a lista de itens carregados
- Use a barra de pesquisa para filtrar
- Toque em "Adicionar" para selecionar itens
- Toque no card do item para abrir modal de detalhes
- Veja o contador no carrinho (canto superior direito)

#### Tela de Revisão (Screen 3)
- Toque em "Revisar Itens" quando tiver itens selecionados
- Ajuste quantidades com os botões + e -
- Toque em "Confirmar" para finalizar

#### Tela de Sucesso (Screen 4)
- Veja o resumo da retirada
- Aguarde o redirecionamento automático (4 segundos)

### 5. Funcionalidades Especiais

#### Simulação de NFC
- Na tela de login, toque no ícone NFC
- **No mobile**: Se o dispositivo suportar NFC, usa o NFC real. Caso contrário, aparece um prompt para digitar o código
- **Na web**: Um modal aparece automaticamente para digitar o código
- Digite qualquer código para simular o crachá (ex: `CODIGO123`)
- A aplicação fará a autenticação com a API

#### Scanner de Código de Barras (NOVO)
- Clique no botão do scanner (ícone QR code) na tela de itens
- Permita o acesso à câmera quando solicitado
- Posicione o código de barras dentro do quadro
- O item será encontrado automaticamente e abrirá o modal
- Toque em "Cancelar" para fechar o scanner

#### Busca Inteligente
- Digite na barra de pesquisa
- Filtre por nome ou código do item
- Toque no "X" para limpar a busca

#### Alertas de Estoque (NOVO)
- Banner amarelo aparece quando há itens com estoque crítico
- Exibe quantos itens estão com estoque baixo
- Toque no "X" para fechar o alerta
- Itens com estoque baixo aparecem com borda vermelha

#### Modal de Detalhes
- Toque em qualquer card de item
- Ajuste a quantidade no modal
- Toque fora do modal para fechar

#### Navegação
- Use o botão "Sair" para logout
- Use o botão "Cancelar" na revisão
- Botão voltar do dispositivo funciona em todas as telas

### 6. Estados de Loading

- **Skeleton Cards**: Aparecem durante carregamento dos itens
- **Toast Notifications**: Mostram status das operações
- **Botões Desabilitados**: Durante processamento

### 7. Tratamento de Erros

- **Login Inválido**: Toast de erro, volta para tela de login
- **Falha na API**: Mensagem de erro específica
- **Sem Itens**: Mensagem "Nenhum item encontrado"
- **Carrinho Vazio**: Botão de revisão desabilitado

### 8. Personalização

#### Cores e Tema
- Edite `src/theme.js` para alterar cores
- Cores DASA: Azul escuro (#0D274D), Laranja (#ff751f), Azul claro (#5AC3E5)

#### API
- Configure `config.js` com sua URL da API
- Teste com diferentes códigos de usuário

#### Imagens
- Adicione imagens em `assets/`
- URLs de placeholder são usadas por padrão

### 9. Comandos Úteis

```bash
# Limpar cache
npm start -- --clear

# Executar em modo de produção
npm run build

# Verificar dependências
npm audit

# Atualizar dependências
npm update
```

### 10. Solução de Problemas

#### App não carrega
- Verifique se o servidor está rodando
- Limpe o cache: `npm start -- --clear`
- Reinicie o Metro bundler

#### Erro de API
- Verifique a URL em `config.js`
- Teste a conectividade com o servidor
- Verifique se a API está acessível

#### Imagens não carregam
- Verifique se as imagens estão em `assets/`
- Use URLs válidas para imagens externas
- Teste com placeholder: `https://via.placeholder.com/90x90`

#### Performance lenta
- Feche outros apps no dispositivo
- Use um dispositivo com mais RAM
- Teste no emulador para melhor performance

### 11. Funcionalidades Implementadas

#### ✅ Scanner de Código de Barras
- Nova funcionalidade de leitura de códigos de barras
- Botão de scanner no topo da tela de itens
- Scanner com visualização de câmera
- Verificação automática de permissões
- Busca automática do item após escaneamento

#### ✅ Notificações de Estoque
- Alertas de estoque baixo/crítico
- Banner informativo no topo da tela de itens
- Indicador visual dos itens críticos

### 12. Funcionalidades Implementadas Adicionais

#### ✅ Integração Real NFC
- Implementação de leitura real de crachás usando `react-native-nfc-manager`
- Detecção automática de tags NFC-A
- Fallback para modo simulado em dispositivos sem suporte
- Abertura automática de configurações quando NFC está desabilitado
- Indicador visual durante leitura

#### ✅ Relatórios e Histórico
- Tela de histórico de retiradas (Screen 5)
- Visualização de todas as retiradas realizadas
- Detalhes de cada retirada: data, usuário, itens e quantidades
- Botão de acesso no header da tela de itens
- Estado persistente durante a sessão

### 13. Próximos Passos (Não Implementados)

1. **Modo Offline**: Cache de dados para uso sem internet

---

## 🎯 Dicas de Desenvolvimento

- Use o **React Native Debugger** para debug
- **Flipper** para inspeção de rede
- **Expo Dev Tools** para logs em tempo real
- Teste em dispositivos reais para melhor experiência
