# 🚀 Instruções de Uso - LabSync React Native

## Como Testar a Aplicação

### 1. Executar o Projeto

```bash
cd LabSyncRN
npm start
```

### 2. Testar no Dispositivo

- **Android**: Escaneie o QR code com o app Expo Go
- **iOS**: Escaneie o QR code com a câmera do iPhone
- **Web**: Pressione 'w' no terminal para abrir no navegador

### 3. Fluxo de Teste

#### Tela de Login (Screen 1)
- Toque no ícone NFC laranja
- Digite um código de teste (ex: `CODIGO123`)
- A aplicação simulará a autenticação

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

### 4. Funcionalidades Especiais

#### Simulação de NFC
- Na tela de login, toque no ícone NFC
- Digite qualquer código para simular o crachá
- A aplicação fará a autenticação com a API

#### Busca Inteligente
- Digite na barra de pesquisa
- Filtre por nome ou código do item
- Toque no "X" para limpar a busca

#### Modal de Detalhes
- Toque em qualquer card de item
- Ajuste a quantidade no modal
- Toque fora do modal para fechar

#### Navegação
- Use o botão "Sair" para logout
- Use o botão "Cancelar" na revisão
- Botão voltar do Android funciona em todas as telas

### 5. Estados de Loading

- **Skeleton Cards**: Aparecem durante carregamento dos itens
- **Toast Notifications**: Mostram status das operações
- **Botões Desabilitados**: Durante processamento

### 6. Tratamento de Erros

- **Login Inválido**: Toast de erro, volta para tela de login
- **Falha na API**: Mensagem de erro específica
- **Sem Itens**: Mensagem "Nenhum item encontrado"
- **Carrinho Vazio**: Botão de revisão desabilitado

### 7. Personalização

#### Cores e Tema
- Edite `src/theme.js` para alterar cores
- Cores DASA: Azul escuro (#0D274D), Laranja (#ff751f), Azul claro (#5AC3E5)

#### API
- Configure `config.js` com sua URL da API
- Teste com diferentes códigos de usuário

#### Imagens
- Adicione imagens em `assets/`
- URLs de placeholder são usadas por padrão

### 8. Comandos Úteis

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

### 9. Solução de Problemas

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

### 10. Próximos Passos

1. **Integração Real NFC**: Implementar leitura real de crachás
2. **Scanner de Código**: Adicionar leitura de código de barras
3. **Modo Offline**: Cache de dados para uso sem internet
4. **Relatórios**: Histórico de retiradas
5. **Notificações**: Alertas de estoque baixo

---

## 🎯 Dicas de Desenvolvimento

- Use o **React Native Debugger** para debug
- **Flipper** para inspeção de rede
- **Expo Dev Tools** para logs em tempo real
- Teste em dispositivos reais para melhor experiência
