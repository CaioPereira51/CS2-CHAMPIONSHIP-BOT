import { Client, GatewayIntentBits, Collection, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Carregar todos os comandos da pasta /commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Registrar comandos no Discord
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const commandsData = client.commands.map(cmd => cmd.data.toJSON());

// Suporta múltiplos servidores separados por vírgula no .env
const guildIds = process.env.GUILD_IDS?.split(",") || [];

try {
  console.log("⏳ Registrando comandos no Discord...");

  if (guildIds.length > 0) {
    for (const guildId of guildIds) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId.trim()),
        { body: commandsData }
      );
      console.log(`✅ Comandos registrados no servidor ${guildId}`);
    }
  } else {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commandsData }
    );
    console.log("✅ Comandos registrados globalmente!");
  }
} catch (error) {
  console.error("Erro ao registrar comandos:", error);
}

// Evento quando o bot estiver online
client.once("ready", () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

// Evento para lidar com interações (comandos e autocomplete)
client.on("interactionCreate", async interaction => {
  // Lidar com autocomplete
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (!command || !command.autocomplete) return;

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error("Erro no autocomplete:", error);
    }
    return;
  }

  // Lidar com comandos slash
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ Comando ${interaction.commandName} não encontrado!`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error("Erro ao executar comando:", error);
    
    const errorMessage = {
      content: "❌ Ocorreu um erro ao executar este comando!",
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

client.login(process.env.TOKEN);
