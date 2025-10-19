import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
  .setName("deletartime")
  .setDescription("Deleta um time do campeonato de CS2")
  .addStringOption(option =>
    option.setName("nome")
      .setDescription("Nome do time a ser deletado")
      .setRequired(true)
      .setAutocomplete(true));

export async function autocomplete(interaction) {
  try {
    const timesPath = path.join(process.cwd(), "times.json");
    
    if (!fs.existsSync(timesPath)) {
      return await interaction.respond([]);
    }

    const data = fs.readFileSync(timesPath, "utf-8");
    const times = JSON.parse(data);

    const focusedValue = interaction.options.getFocused().toLowerCase();
    const filtered = times
      .filter(time => time.nome.toLowerCase().includes(focusedValue))
      .slice(0, 25) // Discord limita a 25 opções
      .map(time => ({
        name: time.nome,
        value: time.nome
      }));

    await interaction.respond(filtered);
  } catch (error) {
    console.error("Erro no autocomplete:", error);
    await interaction.respond([]);
  }
}

export async function execute(interaction) {
  try {
    // Defer a resposta pois deletar canais pode demorar
    await interaction.deferReply();

    const nomeTime = interaction.options.getString("nome");

    // Carregar times do arquivo JSON
    const timesPath = path.join(process.cwd(), "times.json");
    
    if (!fs.existsSync(timesPath)) {
      return await interaction.editReply({
        content: "❌ Não há times cadastrados para deletar!"
      });
    }

    const data = fs.readFileSync(timesPath, "utf-8");
    let times = JSON.parse(data);

    // Procurar o time pelo nome
    const timeIndex = times.findIndex(t => t.nome.toLowerCase() === nomeTime.toLowerCase());

    if (timeIndex === -1) {
      return await interaction.editReply({
        content: `❌ Não foi encontrado nenhum time com o nome **${nomeTime}**!`
      });
    }

    const timeRemovido = times[timeIndex];

    // Deletar canais do Discord (se existirem)
    if (timeRemovido.canais) {
      const guild = interaction.guild;
      
      try {
        // Deletar canais individuais primeiro (mais confiável)
        const canaisParaDeletar = [
          timeRemovido.canais.textoId,
          timeRemovido.canais.vozId,
          timeRemovido.canais.categoriaId
        ];

        for (const canalId of canaisParaDeletar) {
          try {
            // Busca o canal diretamente (não usa cache)
            const canal = await guild.channels.fetch(canalId).catch(() => null);
            if (canal) {
              await canal.delete();
              console.log(`✅ Canal ${canal.name} deletado com sucesso`);
            }
          } catch (error) {
            console.error(`Erro ao deletar canal ${canalId}:`, error.message);
          }
        }
      } catch (error) {
        console.error("Erro ao deletar canais:", error);
        // Continua mesmo se não conseguir deletar os canais
      }
    }

    // Remover o time
    times.splice(timeIndex, 1);

    // Salvar no arquivo JSON
    fs.writeFileSync(timesPath, JSON.stringify(times, null, 2), "utf-8");

    // Criar embed de confirmação
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle(`🗑️ Time Removido`)
      .setDescription(`O time **${timeRemovido.nome}** foi deletado com sucesso!${timeRemovido.canais ? '\n\n📁 Os canais privados do time foram removidos.' : ''}`)
      .addFields({
        name: "👥 Jogadores que estavam no time",
        value: timeRemovido.jogadores.map((j, index) => 
          `${index + 1}. ${j.username}`
        ).join("\n"),
        inline: false
      })
      .setFooter({ text: "Campeonato CS2 • Powered by Championship Bot" })
      .setTimestamp();

    if (timeRemovido.logo) {
      embed.setThumbnail(timeRemovido.logo);
    }

    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    console.error("Erro ao deletar time:", error);
    
    const errorMessage = {
      content: "❌ Ocorreu um erro ao deletar o time. Tente novamente!",
      ephemeral: true
    };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
}

