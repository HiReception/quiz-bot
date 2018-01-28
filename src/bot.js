var Discord = require("discord.io");
var logger = require("winston");
var auth;
if (!process.env.token) {
	auth = require("../auth.json");
}

import mojify from "./mojify.js";

import DealOrNoDealGame from "./dond.js";


logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});



logger.level = "debug";

if (process.env.token) {
	logger.info("Using Heroku token: " + process.env.token);
} else {
	logger.info("Using Local token: " + auth.token);
}
// Initialise the bot
var bot = new Discord.Client({
	token: process.env.token || auth.token,
	autorun: true
});

bot.on("ready", function(evt) {
	logger.info("Connected");
	logger.info("Logged in as: ");
	logger.info(bot.username + " - (" + bot.id + ")");
});

bot.on("disconnect", function(err, code) {
	logger.info("Disconnect");
	logger.info(err);
	logger.info(code);
});



var gameHandler = null;

const clearHandler = () => {
	gameHandler = null;
};

bot.on("message", (user, userID, channelID, message, evt) => {
	if (message.substring(0,6) === "!quiz ") {

		var args = message.substring(6).split(" ");
		var cmd = args[0];
		logger.info("I've been pinged: " + args);
		args = args.splice(1);
		switch(cmd) {
		case "hello":
			bot.sendMessage({
				to: channelID,
				message: "COME OOOOOOOON DOOOOOOWN!!!"
			});
			break;
		case "wof":
			var board = ["---TESTING--","--WHEEL-OF--","--FORTUNE---","---BOARD----"];
			bot.sendMessage({
				to: channelID,
				message: board.map((line) => mojify(line)).join("\n")
			});
			break;
		case "dond":
			if (gameHandler === null) {
				let dondGame = new DealOrNoDealGame(bot, userID, channelID.toString(), clearHandler);
				gameHandler = dondGame.gameHandler.bind(dondGame);
			} else {
				// TODO game already started
			}
			break;
		}
	}

	if (gameHandler) {
		gameHandler(user, userID, channelID, message, evt);
	}
});