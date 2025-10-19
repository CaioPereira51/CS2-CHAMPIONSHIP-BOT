import { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
  .setName("criartime")
  .setDescription("Cria um time para o campeonato de CS2")
  .addStringOption(option =>
    option.setName("nome")
      .setDescription("Nome do time")
      .setRequired(true))
  .addUserOption(option =>
    option.setName("jogador1")
      .setDescription("Primeiro jogador")
      .setRequired(true))
  .addUserOption(option =>
    option.setName("jogador2")
      .setDescription("Segundo jogador")
      .setRequired(true))
  .addUserOption(option =>
    option.setName("jogador3")
      .setDescription("Terceiro jogador")
      .setRequired(true))
  .addUserOption(option =>
    option.setName("jogador4")
      .setDescription("Quarto jogador")
      .setRequired(true))
  .addUserOption(option =>
    option.setName("jogador5")
      .setDescription("Quinto jogador")
      .setRequired(true))
  .addStringOption(option =>
    option.setName("logo")
      .setDescription("URL da logo do time (opcional)")
      .setRequired(false));

export async function execute(interaction) {
  try {
    // Defer a resposta pois criar canais pode demorar
    await interaction.deferReply();

    // Pegar os dados do comando
    const nomeTime = interaction.options.getString("nome");
    const jogador1 = interaction.options.getUser("jogador1");
    const jogador2 = interaction.options.getUser("jogador2");
    const jogador3 = interaction.options.getUser("jogador3");
    const jogador4 = interaction.options.getUser("jogador4");
    const jogador5 = interaction.options.getUser("jogador5");
    const logo = interaction.options.getString("logo");

    // Validações
    if (!nomeTime || nomeTime.trim() === "") {
      return await interaction.editReply({
        content: "❌ O nome do time não pode estar vazio!"
      });
    }

    // Verificar se todos os jogadores foram mencionados
    const jogadores = [jogador1, jogador2, jogador3, jogador4, jogador5];
    if (jogadores.some(j => !j)) {
      return await interaction.editReply({
        content: "❌ Todos os 5 jogadores devem ser mencionados!"
      });
    }

    // Verificar se há jogadores duplicados
    const jogadoresIds = jogadores.map(j => j.id);
    const jogadoresUnicos = new Set(jogadoresIds);
    if (jogadoresUnicos.size !== 5) {
      return await interaction.editReply({
        content: "❌ Não é permitido adicionar o mesmo jogador mais de uma vez!"
      });
    }

    // Validar URL da logo (se fornecida)
    if (logo) {
      try {
        new URL(logo);
        // Verificar se é uma URL de imagem válida
        if (!logo.match(/\.(jpeg|jpg|gif|png|webp)$/i) && !logo.includes('cdn.discordapp.com') && !logo.includes('media.discordapp.net')) {
          return await interaction.editReply({
            content: "⚠️ A URL da logo deve ser uma imagem válida (jpeg, jpg, gif, png, webp)!"
          });
        }
      } catch (error) {
        return await interaction.editReply({
          content: "❌ A URL da logo fornecida não é válida!"
        });
      }
    }

    // Criar o objeto do time
    const time = {
      id: Date.now().toString(),
      nome: nomeTime,
      jogadores: jogadores.map(j => ({
        id: j.id,
        username: j.username,
        tag: j.tag
      })),
      logo: logo || null,
      criadoPor: interaction.user.id,
      criadoEm: new Date().toISOString()
    };

    // Carregar times existentes
    const timesPath = path.join(process.cwd(), "times.json");
    let times = [];
    
    if (fs.existsSync(timesPath)) {
      const data = fs.readFileSync(timesPath, "utf-8");
      times = JSON.parse(data);
    }

    // Verificar se já existe um time com o mesmo nome
    if (times.some(t => t.nome.toLowerCase() === nomeTime.toLowerCase())) {
      return await interaction.editReply({
        content: `❌ Já existe um time chamado **${nomeTime}**!`
      });
    }

    // Criar categoria e canais privados para o time
    const guild = interaction.guild;
    
    try {
      // Criar a categoria
      const categoria = await guild.channels.create({
        name: `Time ${nomeTime}`,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: guild.id, // @everyone
            allow: [PermissionFlagsBits.ViewChannel], // Todos podem ver
            deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] // Mas não podem interagir
          },
          // Permissões para cada jogador do time
          ...jogadoresIds.map(jogadorId => ({
            id: jogadorId,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.Speak
            ]
          }))
        ]
      });

      // Criar canal de texto
      const canalTexto = await guild.channels.create({
        name: `geral-${nomeTime.toLowerCase().replace(/\s+/g, '-')}`,
        type: ChannelType.GuildText,
        parent: categoria.id,
        permissionOverwrites: [
          {
            id: guild.id, // @everyone
            allow: [PermissionFlagsBits.ViewChannel], // Todos podem ver
            deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] // Mas não podem ler/enviar
          },
          // Permissões para cada jogador do time
          ...jogadoresIds.map(jogadorId => ({
            id: jogadorId,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.AddReactions,
              PermissionFlagsBits.AttachFiles,
              PermissionFlagsBits.EmbedLinks
            ]
          }))
        ]
      });

      // Criar canal de voz
      const canalVoz = await guild.channels.create({
        name: `Voz ${nomeTime}`,
        type: ChannelType.GuildVoice,
        parent: categoria.id,
        permissionOverwrites: [
          {
            id: guild.id, // @everyone
            allow: [PermissionFlagsBits.ViewChannel], // Todos podem ver
            deny: [PermissionFlagsBits.Connect] // Mas não podem entrar
          },
          // Permissões para cada jogador do time
          ...jogadoresIds.map(jogadorId => ({
            id: jogadorId,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.Speak,
              PermissionFlagsBits.Stream,
              PermissionFlagsBits.UseVAD
            ]
          }))
        ]
      });

      // Adicionar IDs dos canais ao objeto do time
      time.canais = {
        categoriaId: categoria.id,
        textoId: canalTexto.id,
        vozId: canalVoz.id
      };

      // Enviar mensagem de boas-vindas no canal de texto
      await canalTexto.send({
        content: `🎉 **Bem-vindos ao time ${nomeTime}!**\n\n` +
                 `👥 **Membros:**\n${jogadores.map((j, i) => `${i + 1}. ${j}`).join('\n')}\n\n` +
                 `Este é o canal privado do seu time. Apenas vocês podem ver e interagir aqui!\n` +
                 `Boa sorte no campeonato! 🏆`
      });

    } catch (error) {
      console.error("Erro ao criar canais:", error);
      return await interaction.editReply({
        content: "❌ Erro ao criar os canais do time. Verifique se o bot tem permissões de **Gerenciar Canais**!"
      });
    }

    // Adicionar o novo time
    times.push(time);

    // Salvar no arquivo JSON
    fs.writeFileSync(timesPath, JSON.stringify(times, null, 2), "utf-8");

    // Criar o embed bonito
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`🏆 ${nomeTime}`)
      .setDescription("Time criado com sucesso!")
      .addFields(
        {
          name: "👥 Jogadores",
          value: jogadores.map((j, index) => `${index + 1}. ${j}`).join("\n"),
          inline: false
        },
        {
          name: "📁 Canais Criados",
          value: `📝 <#${time.canais.textoId}>\n🔊 <#${time.canais.vozId}>`,
          inline: false
        }
      )
      .setFooter({ text: "Campeonato CS2 • Powered by Championship Bot" })
      .setTimestamp();

    // Adicionar logo se fornecida
    if (logo) {
      embed.setThumbnail(logo);
    }

    // Responder com o embed
    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    console.error("Erro ao criar time:", error);
    
    // Se já respondeu à interação, edita; senão, responde
    const errorMessage = {
      content: "❌ Ocorreu um erro ao criar o time. Tente novamente!",
      ephemeral: true
    };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
}

