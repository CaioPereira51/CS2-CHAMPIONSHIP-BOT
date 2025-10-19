# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-10-19

### ✨ Adicionado
- Comando `/criartime` para criar times com 5 jogadores
- Criação automática de categoria e canais privados para cada time
- Canal de texto privado (apenas membros podem acessar)
- Canal de voz privado (apenas membros podem entrar)
- Comando `/listartimes` para listar todos os times cadastrados
- Comando `/deletartime` com autocomplete para remover times
- Remoção automática de canais ao deletar time
- Validação completa de dados (jogadores duplicados, nomes vazios, etc)
- Sistema de persistência com arquivo JSON
- Interface visual com embeds Discord
- Documentação completa em português
- Sistema de permissões configurável

### 🔒 Segurança
- Arquivo `.env` protegido pelo `.gitignore`
- Exemplo de configuração sem dados sensíveis
- Validação de URLs de logos

### 📚 Documentação
- README.md completo com instruções de instalação
- PERMISSOES_BOT.md com guia de permissões
- SETUP_RAPIDO.md para início rápido
- GITHUB_SETUP.md com guia de upload para GitHub
- CONTRIBUTING.md com diretrizes de contribuição
- Exemplos de uso dos comandos

---

## Legenda

- ✨ **Adicionado** - Para novas funcionalidades
- 🔄 **Modificado** - Para mudanças em funcionalidades existentes
- 🗑️ **Removido** - Para funcionalidades removidas
- 🐛 **Corrigido** - Para correções de bugs
- 🔒 **Segurança** - Para correções de vulnerabilidades
- 📚 **Documentação** - Para mudanças na documentação
- 🔧 **Manutenção** - Para mudanças que não afetam o código

