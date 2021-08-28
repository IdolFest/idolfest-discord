import { config as dotenv } from "dotenv"
dotenv()

const assertToken = (str, validate = x => !!x) => {
	const value = process.env[str]
	if (!validate(value)) {
		throw new Error(`Invalid environment variable for ${str}`)
	}
	return value
}

const discordBotToken = assertToken(`DISCORD_BOT_TOKEN`)

const Discord = {
	botToken: discordBotToken
}

export {
	Discord,

	discordBotToken,
}