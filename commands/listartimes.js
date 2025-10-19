import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
  .setName("listartimes")
  .setDescription("Lista todos os times criados para o campeonato de CS2");

export async function execute(interaction) {
  try {
    // Carregar times do arquivo JSON
    const timesPath = path.join(process.cwd(), "times.json");
    
    if (!fs.existsSync(timesPath)) {
      return await interaction.reply({
        content: "📋 Ainda não há times criados! Use `/criartime` para criar o primeiro time.",
        ephemeral: true
      });
    }

    const data = fs.readFileSync(timesPath, "utf-8");
    const times = JSON.parse(data);

    if (times.length === 0) {
      return await interaction.reply({
        content: "📋 Ainda não há times criados! Use `/criartime` para criar o primeiro time.",
        ephemeral: true
      });
    }

    // Criar embeds para cada time
    const embeds = times.map(time => {
      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`🏆 ${time.nome}`)
        .addFields({
          name: "👥 Jogadores",
          value: time.jogadores.map((j, index) => 
            `${index + 1}. <@${j.id}> (${j.username})`
          ).join("\n"),
          inline: false
        })
        .setFooter({ text: "Campeonato CS2 • Powered by Championship Bot" })
        .setTimestamp(new Date(time.criadoEm));

      // Adicionar logo se existir
      if (time.logo) {
        embed.setThumbnail(time.logo);
      }

      // Adicionar canais se existirem
      if (time.canais) {
        embed.addFields({
          name: "📁 Canais",
          value: `📝 <#${time.canais.textoId}>\n🔊 <#${time.canais.vozId}>`,
          inline: true
        });
      }

      // Adicionar informação de quem criou
      embed.addFields({
        name: "📝 Criado por",
        value: `<@${time.criadoPor}>`,
        inline: true
      });

      return embed;
    });

    // O Discord permite enviar até 10 embeds por mensagem
    if (embeds.length > 10) {
      // Se houver mais de 10 times, enviar em múltiplas mensagens
      await interaction.reply({
        content: `📊 **Total de times:** ${times.length}\n\nExibindo os primeiros 10 times:`,
        embeds: embeds.slice(0, 10)
      });

      // Enviar os restantes em mensagens de follow-up
      for (let i = 10; i < embeds.length; i += 10) {
        await interaction.followUp({
          embeds: embeds.slice(i, i + 10)
        });
      }
    } else {
      // Se houver 10 ou menos times, enviar todos de uma vez
      await interaction.reply({
        content: `📊 **Total de times cadastrados:** ${times.length}`,
        embeds: embeds
      });
    }

  } catch (error) {
    console.error("Erro ao listar times:", error);
    
    const errorMessage = {
      content: "❌ Ocorreu um erro ao listar os times. Tente novamente!",
      ephemeral: true
    };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
}

