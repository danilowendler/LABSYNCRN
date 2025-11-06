# Modo Mockado - Plano B para Demonstração

Esta branch contém uma versão do aplicativo que funciona com dados mockados, permitindo demonstração mesmo quando a API não estiver disponível.

## 🔧 Como Funciona

O modo mockado é controlado pela flag `USE_MOCK_DATA` no arquivo `src/api.js`. Quando definida como `true`, o aplicativo:

- ✅ Aceita qualquer credencial no login (modo demo)
- ✅ Retorna uma lista pré-definida de itens mockados
- ✅ Simula o registro de retiradas sem enviar para a API
- ✅ Mantém toda a funcionalidade da interface

## 📋 Dados Mockados

Os dados mockados estão definidos em `src/mockData.js` e incluem:

- 10 itens de exemplo com códigos EAN, quantidades e nomes
- Um usuário demo padrão
- Simulação de delay de rede para experiência realista

## 🔄 Alternando entre Modo API e Modo Mockado

Para alternar entre os modos, edite o arquivo `src/api.js`:

```javascript
// Para usar dados mockados (modo demo)
const USE_MOCK_DATA = true;

// Para usar API real
const USE_MOCK_DATA = false;
```

## 🚀 Como Usar

1. Certifique-se de estar na branch `mock-data`:
   ```bash
   git checkout mock-data
   ```

2. O modo mockado já está ativado por padrão nesta branch

3. Execute o aplicativo normalmente:
   ```bash
   npm start
   ```

4. No login, você pode usar qualquer ID e senha (exemplo: ID: `1`, Senha: `demo`)

## 📝 Notas Importantes

- Esta branch é uma cópia da branch `main` com modificações para dados mockados
- A branch `main` continua funcionando com a API real
- Para apresentação, use esta branch se a API não estiver disponível
- Para desenvolvimento normal, use a branch `main`

## 🔀 Voltar para Modo API

Para voltar a usar a API real, você pode:

1. Fazer checkout da branch `main`:
   ```bash
   git checkout main
   ```

2. Ou alterar `USE_MOCK_DATA` para `false` nesta branch

