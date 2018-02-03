var Discord = require("discord.io");
var logger = require("winston");
var auth;
if (!process.env.token) {
	auth = require("../auth.json");
}


import DealOrNoDealGame from "./dond.js";
import WheelOfFortuneGame from "./wof.js";


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
	bot.setPresence({game: {name: "\"!quiz about\" for info"}});
});

bot.on("disconnect", function(err, code) {
	logger.info("Disconnect");
	logger.info(err);
	logger.info(code);
});

var gameHandlers = {};

var timeouts = {};

const gameTimeout = (channelID) => {
	bot.sendMessage({
		to: channelID,
		message: `<@!${gameHandlers[channelID].getUserID()}>, your game has timed out and is now over. A new game can now be started on this channel.`
	});
	clearHandler(channelID);
};


const clearHandler = (channelID) => {
	delete gameHandlers[channelID];
};

const timeoutLength = 1000 * 60 * 5; // time from last interaction with an existing game before that game will end

bot.on("message", (user, userID, channelID, message, evt) => {
	if (message.substring(0,6) === "!quiz ") {

		var args = message.substring(6).split(" ");
		var cmd = args[0];
		logger.info("I've been pinged: " + args);
		args = args.splice(1);
		switch(cmd) {
		case "about":
			bot.sendMessage({
				to: channelID,
				message: "Hi there! My name's quiz-bot, the game-show hosting Discord bot!\n\n" + 
					"I can run a selection of games right here in the Discord chat, and more games will be added as time goes on! " + 
					"To start a new game, type \"!quiz \" followed by the code for the game you want. " +
					`Just remember, if I don't hear from you within ${timeoutLength/1000} seconds, I'll end the game; wouldn't really be fair to the others if you disappeared.\n` + 
					"Currently, I can play:\n\n" +
					"- **wof**: Wheel of Fortune - You against the board, Hangman style. Pick a letter, or try and solve. Five mistakes, and you're done!\n" + 
					"- **dond**: Deal or No Deal - the classic game of strategy, tactics, and... picking random numbers. The Australian rules are in play, because of developer biases. :flag_au:\n" + 
					"\nHave fun!"
			});
			break;
		case "wof":
			if (!gameHandlers[channelID]) {
				gameHandlers[channelID] = new WheelOfFortuneGame(bot, userID, channelID.toString(), clearHandler);
			} else {
				// TODO game already started
			}
			break;
		case "dond":
			if (!gameHandlers[channelID]) {
				gameHandlers[channelID] = new DealOrNoDealGame(bot, userID, channelID.toString(), clearHandler);
			} else {
				// TODO game already started
			}
			break;
		}
	}

	if (gameHandlers[channelID]) {
		if(timeouts[channelID] && typeof timeouts[channelID] !== "undefined") {
			clearTimeout(timeouts[channelID]);
		}
		timeouts[channelID] = setTimeout(() => gameTimeout(channelID), timeoutLength);
		gameHandlers[channelID].gameHandler(user, userID, channelID, message, evt);
	}
});