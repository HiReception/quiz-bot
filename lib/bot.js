'use strict';

var _dond = require('./dond.js');

var _dond2 = _interopRequireDefault(_dond);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('../auth.json');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});

var number_words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

var mojify = function mojify(line) {
	return line.split("").map(function (char) {
		if (char === " ") {
			return " ";
		} else if (char === "-") {
			return "\:white_large_square:";
		} else if ("0123456789".includes(char)) {
			return "\:" + number_words[parseInt(char)] + ":";
		} else {
			return "\:regional_indicator_" + char.toLowerCase() + ":";
		}
	}).join("");
};

logger.level = "debug";
// Initialise the bot
var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

bot.on("ready", function (evt) {
	logger.info("Connected");
	logger.info("Logged in as: ");
	logger.info(bot.username + ' - (' + bot.id + ')');
});

var gameHandler = null;

var clearHandler = function clearHandler() {
	gameHandler = null;
};

bot.on("message", function (user, userID, channelID, message, evt) {
	if (message.substring(0, 6) === "!quiz ") {

		var args = message.substring(6).split(" ");
		var cmd = args[0];
		logger.info("I've been pinged: " + args);
		args = args.splice(1);
		switch (cmd) {
			case "hello":
				bot.sendMessage({
					to: channelID,
					message: "COME OOOOOOOON DOOOOOOWN!!!"
				});
				break;
			case "wof":
				var board = ["---TESTING--", "--WHEEL-OF--", "--FORTUNE---", "---BOARD----"];
				bot.sendMessage({
					to: channelID,
					message: board.map(function (line) {
						return mojify(line);
					}).join("\n")
				});
				break;
			case "dond":
				if (gameHandler === null) {
					var dondGame = new _dond2.default(bot, userID, channelID.toString(), clearHandler);
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