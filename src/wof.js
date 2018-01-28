var logger = require("winston");
import mojify from "mojify";

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});

/* States of game:
	Pre-selection
	Round 1
	Offer 1
	Round 2
	Offer 2
	...
	Round 9
	Offer 9
	Open chosen case

*/

const maxIncorrect = 5;

const puzzles = [
	{answer: "TEST PUZZLE ONE",		category: "PHRASE"},
	{answer: "TEST PUZZLE TWO",		category: "PHRASE"},
	{answer: "TEST PUZZLE THREE",	category: "PHRASE"},
	{answer: "TEST PUZZLE FOUR",	category: "PHRASE"},
	{answer: "TEST PUZZLE FIVE",	category: "PHRASE"},
];



export default class WheelOfFortuneGame {

	gameHandler(user, userID, channelID, message, evt) {
		const callLetterRegex = /^.*\[([a-zA-Z]{1})\].*$/;
		const solveRegex = /^.*\[(.{2,})\].*$/;
		if (userID === this.userID) {
			let message = "";
			if (callLetterRegex.test(message)) {
				const letter = message.replace(callLetterRegex, "$1").toUpperCase();
				// if letter hasn't already been called
				if (!this.calledLetters.some((l) => l === letter)) {
					this.calledLetters.push(letter);
					// if letter doesn't appear in puzzle
					if (!this.puzzle.includes(letter)) {
						message = `There are no ${letter}s.\n\n`;
						this.incorrectGuesses++;
						if (this.incorrectGuesses === maxIncorrect) {
							message = message.concat(this.handleLoss());
						} else {
							message = message.concat(`${this.printPuzzleBoard()}\n${this.printCategory}\n${this.promptForGuess}`);
						}
					} else {
						// tell user how many times it appears, and print the board again
						const count = (this.puzzle.answer.match(new RegExp("/" + letter + "/", "g")) || []).length;
						if (count === 1) {
							message = `There is one ${letter}!\n\n${this.printPuzzleBoard()}\n${this.printCategory}\n${this.promptForGuess}`;
						} else {
							message = `There are ${count} ${letter}s!\n\n${this.printPuzzleBoard()}\n${this.printCategory}\n${this.promptForGuess}`;
						}
					}
					
				} else {
					message = `${letter} has already been called. Don't worry, we won't count that as a wrong guess.\n\n` + 
						`${this.printPuzzleBoard()}\n${this.printCategory}\n${this.promptForGuess}`;
				}

				this.bot.sendMessage({
					to: this.channelID,
					message: message,
				}, this.sendCallback);

			} else if (solveRegex.test(message)) {
				const guess = message.replace(solveRegex, "$1").toUpperCase();
				if (this.puzzle.answer === guess) {
					// tell user they've got it right
					this.handleWin();
				} else {
					// TODO tell user they're wrong
					this.incorrectGuesses++;
					if (this.incorrectGuesses === maxIncorrect) {
						// TODO game over, tell the user the right answer
					} else {
						// TODO print the board again
					}
				}
				this.bot.sendMessage({
					to: this.channelID,
					message: message,
				}, this.sendCallback);
			}

			
		}
	}

	sendCallback(err, resp) {
		if (err) {
			logger.error(err);
		} else if (resp) {
			logger.info(resp);
		}
	}


	constructor(bot, userID, channelID, endGameCallback) {
		this.bot = bot;
		this.channelID = channelID;
		this.userID = userID;
		this.endGameCallback = endGameCallback;


		this.puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
		this.incorrectGuesses = 0;
		this.calledLetters = [];

		this.bot.sendMessage({
			to: this.channelID,
			message: `Welcome to the game, <@!${userID}>!\n\n${this.printPuzzleBoard()}\n${this.printCategory()}\n${this.promptForGuess()}`,
		}, this.sendCallback);
	}

	printPuzzleBoard() {
		// TODO
	}

	printCategory() {
		return `\`\`\`${this.category}\`\`\``;
	}

	promptForGuess() {
		return `Choose a Letter, or try to Solve (place your guess for either within "[ ]"). You have ${maxIncorrect - this.incorrectGuesses} remaining.`;
	}

	handleLoss() {
		return `Sorry <@!${this.userID}>, you've run out of incorrect guesses. This was the correct answer:\n\n${this.printPuzzleBoard()}\n${this.printCategory()}\nThanks for playing!`;
	}

	handleWin() {
		return `Congratulations <@!${this.userID}>! You've solved the puzzle!\n\n${this.printPuzzleBoard()}\n${this.printCategory()}\nThanks for playing!`;
	}

	endGame() {
		this.endGameCallback();
	}
}