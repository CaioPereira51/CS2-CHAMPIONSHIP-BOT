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

try {
  console.log("⏳ Registrando comandos no Discord...");
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commandsData }
  );
  console.log("✅ Comandos registrados com sucesso!");
} catch (error) {
  console.error("Erro ao registrar comandos:", error);
}

// Evento de quando o bot está online
client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  console.log(`📊 Comandos disponíveis: ${client.commands.size}`);
  console.log(`🎮 Pronto para gerenciar o campeonato de CS2!`);
});

// Evento que trata os comandos e autocomplete
client.on("interactionCreate", async (interaction) => {
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

  // Lidar com comandos
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "❌ Ocorreu um erro ao executar este comando!", ephemeral: true });
  }
});

client.login(process.env.TOKEN);
