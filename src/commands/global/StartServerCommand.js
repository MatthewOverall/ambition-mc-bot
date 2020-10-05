class StartServerCommand extends Command {
	constructor(client) {
		super(client,
			{
				"name": "Scoreboard",
				"usage": "scoreboard <objective>|clear> [list|total|query <player>]",
				"alias": "s",
				"description": "Displays a scoreboad in game"
			}
		)
	}
}

module.exports = Command
