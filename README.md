# 🎮 CS2 Championship Bot

![Discord.js](https://img.shields.io/badge/discord.js-v14.23.2-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.9.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

Bot Discord para gerenciar times de campeonato de Counter-Strike 2.

## 🚀 Recursos

- ✅ Criar times com 5 jogadores
- ✅ Adicionar logo personalizada para cada time
- ✅ **Criar automaticamente categoria e canais privados para cada time**
- ✅ **Canal de texto privado** (apenas membros do time podem ler/escrever)
- ✅ **Canal de voz privado** (apenas membros do time podem entrar)
- ✅ Outros usuários podem VER os canais mas não podem acessar
- ✅ Listar todos os times cadastrados
- ✅ Deletar times com autocomplete (remove canais automaticamente)
- ✅ Validação completa de dados
- ✅ Persistência em JSON
- ✅ Interface visual bonita com embeds

## 📋 Comandos

### `/criartime`
Cria um novo time para o campeonato e automaticamente cria canais privados.

**Parâmetros:**
- `nome` (obrigatório): Nome do time
- `jogador1` a `jogador5` (obrigatórios): Menções aos 5 jogadores
- `logo` (opcional): URL da imagem do logo do time

**O que acontece:**
1. ✅ Cria uma **categoria** com o nome do time (ex: "Time Astralis")
2. ✅ Cria um **canal de texto** dentro da categoria (ex: "geral-astralis")
3. ✅ Cria um **canal de voz** dentro da categoria (ex: "Voz Astralis")
4. ✅ Configura **permissões privadas**: apenas os 5 jogadores podem acessar
5. ✅ Outros usuários podem VER os canais mas não podem interagir
6. ✅ Envia mensagem de boas-vindas no canal do time

**Exemplo:**
```
/criartime nome:"Astralis" jogador1:@Caio jogador2:@Lucas jogador3:@Pedro jogador4:@Gustavo jogador5:@Rafael logo:"https://example.com/logo.png"
```

### `/listartimes`
Lista todos os times cadastrados no campeonato. Mostra informações completas incluindo os canais privados de cada time.

### `/deletartime`
Remove um time do campeonato e **deleta automaticamente** a categoria e todos os canais privados. O comando possui autocomplete para facilitar a seleção do time.

**Parâmetros:**
- `nome` (obrigatório): Nome do time a ser deletado (com autocomplete)

**Exemplo:**
```
/deletartime nome:"Astralis"
```

## ⚠️ IMPORTANTE: Permissões Necessárias

Para que o bot funcione completamente, ele precisa das seguintes **permissões obrigatórias**:

- ✅ **Manage Channels** - Para criar/deletar categorias e canais
- ✅ **Manage Roles** - Para configurar permissões dos canais
- ✅ View Channels
- ✅ Send Messages
- ✅ Embed Links
- ✅ Use Slash Commands

**📖 Leia o arquivo `PERMISSOES_BOT.md` para instruções detalhadas!**

## ⚙️ Instalação

### 1. Pré-requisitos
- Node.js 16.9.0 ou superior
- npm ou yarn
- Uma aplicação Discord (bot) criada no [Discord Developer Portal](https://discord.com/developers/applications)

### 2. Clonar e instalar dependências

```bash
# Instalar dependências
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Token do Bot Discord
# Obtenha em: https://discord.com/developers/applications
TOKEN=seu_token_aqui

# ID da aplicação do bot
# Encontre na página do aplicativo no Discord Developer Portal
CLIENT_ID=seu_client_id_aqui

# ID do servidor Discord onde o bot será usado
# Clique com botão direito no servidor e copie o ID (necessário ativar modo desenvolvedor)
GUILD_ID=seu_guild_id_aqui
```

### 4. Executar o bot

```bash
npm start
```

## 📖 Como obter as credenciais

### Token do Bot (TOKEN)
1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Selecione sua aplicação (ou crie uma nova)
3. Vá em "Bot" no menu lateral
4. Clique em "Reset Token" e copie o token gerado
5. ⚠️ **IMPORTANTE:** Nunca compartilhe este token!

### Client ID (CLIENT_ID)
1. No Discord Developer Portal
2. Vá em "General Information"
3. Copie o "Application ID"

### Guild ID (GUILD_ID)
1. No Discord, ative o Modo Desenvolvedor:
   - Configurações → Avançado → Modo Desenvolvedor
2. Clique com o botão direito no seu servidor
3. Selecione "Copiar ID"

### Adicionar o bot ao servidor
1. No Discord Developer Portal, vá em "OAuth2" → "URL Generator"
2. Selecione os escopos: `bot` e `applications.commands`
3. Selecione as permissões (TODAS são necessárias):
   - ✅ `View Channels`
   - ✅ `Manage Channels` **(OBRIGATÓRIA!)**
   - ✅ `Manage Roles` **(OBRIGATÓRIA!)**
   - ✅ `Send Messages`
   - ✅ `Embed Links`
   - ✅ `Read Message History`
   - ✅ `Use Slash Commands`
4. Copie a URL gerada e abra no navegador
5. Selecione seu servidor e autorize o bot

## 📁 Estrutura do projeto

```
CS2 Championship Bot/
├── commands/
│   ├── criartime.js      # Comando para criar times
│   ├── listartimes.js    # Comando para listar times
│   └── deletartime.js    # Comando para deletar times
├── index.js              # Arquivo principal do bot
├── times.json            # Armazenamento dos times (gerado automaticamente)
├── package.json          # Dependências do projeto
├── .env                  # Variáveis de ambiente (criar manualmente)
├── .gitignore           # Arquivos ignorados pelo git
└── README.md            # Este arquivo
```

## 🎨 Validações implementadas

- ✅ Verifica se todos os 5 jogadores foram mencionados
- ✅ Impede jogadores duplicados no mesmo time
- ✅ Valida que o nome do time não está vazio
- ✅ Verifica se já existe um time com o mesmo nome
- ✅ Valida URL da logo (se fornecida)
- ✅ Tratamento completo de erros

## 💾 Persistência de dados

Os times são salvos automaticamente no arquivo `times.json` na raiz do projeto. Este arquivo é criado automaticamente quando o primeiro time é cadastrado.

**Estrutura do JSON:**
```json
[
  {
    "id": "1234567890",
    "nome": "Astralis",
    "jogadores": [
      {
        "id": "123456789",
        "username": "caio",
        "tag": "caio#1234"
      }
    ],
    "logo": "https://example.com/logo.png",
    "criadoPor": "987654321",
    "criadoEm": "2025-10-19T12:00:00.000Z"
  }
]
```

## 🛠️ Tecnologias utilizadas

- [Node.js](https://nodejs.org/) - Runtime JavaScript
- [discord.js v14](https://discord.js.org/) - Biblioteca para interagir com a API do Discord
- [dotenv](https://www.npmjs.com/package/dotenv) - Gerenciamento de variáveis de ambiente

## 📝 Notas

- O bot usa ES6 Modules (`import`/`export`)
- Os comandos são registrados automaticamente ao iniciar o bot
- O arquivo `times.json` persiste entre reinicializações
- Todos os embeds seguem um padrão visual consistente com a cor #0099ff

## 🤝 Suporte

Se encontrar algum problema ou tiver sugestões, sinta-se à vontade para abrir uma issue ou contribuir com o projeto!

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Veja o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para saber como contribuir.

## 📜 Histórico de Versões

Veja o arquivo [CHANGELOG.md](CHANGELOG.md) para ver as mudanças em cada versão.

## 🆘 Precisa de Ajuda?

- 📖 Leia os guias na documentação
- 🐛 [Reporte bugs](../../issues)
- 💡 [Sugira novas funcionalidades](../../issues)
- ❓ [Faça perguntas](../../discussions)

---

**Desenvolvido com ❤️ para o Campeonato de CS2**

