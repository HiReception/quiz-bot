var logger = require("winston");
import mojify from "./mojify";

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
	{answer: "TEST PUZZLE ONE",		category: "PHRASE", board: ["------------","TEST-PUZZLE-","----ONE-----","------------"]},
	{answer: "TEST PUZZLE TWO",		category: "PHRASE", board: ["------------","TEST-PUZZLE-","----TWO-----","------------"]},
	{answer: "TEST PUZZLE THREE",	category: "PHRASE", board: ["------------","TEST-PUZZLE-","---THREE----","------------"]},
	{answer: "TEST PUZZLE FOUR",	category: "PHRASE", board: ["------------","TEST-PUZZLE-","----FOUR----","------------"]},
	{answer: "TEST PUZZLE FIVE",	category: "PHRASE", board: ["------------","TEST-PUZZLE-","----FIVE----","------------"]},
];

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


export default class WheelOfFortuneGame {
	

	gameHandler(user, userID, channelID, message, evt) {
		const callLetterRegex = /^.*\[([a-zA-Z]{1})\].*$/;
		const solveRegex = /^.*\[(.{2,})\].*$/;
		if (userID === this.userID) {
			let response = "";
			if (callLetterRegex.test(message)) {
				const letter = message.replace(callLetterRegex, "$1").toUpperCase();
				// if letter hasn't already been called
				if (!this.calledLetters.some((l) => l === letter)) {
					this.calledLetters.push(letter);
					// if letter doesn't appear in puzzle
					if (!this.puzzle.answer.includes(letter)) {
						response = `There are no ${letter}s.\n\n`;
						this.incorrectGuesses++;
						if (this.incorrectGuesses === maxIncorrect) {
							response = response.concat(this.handleLoss());
						} else {
							response = response.concat(`${this.printPuzzleBoard()}\n${this.printCategory()}\n${this.promptForGuess()}`);
						}
					} else {
						// tell user how many times it appears, and print the board again
						const count = (this.puzzle.answer.match(new RegExp(letter, "g")) || []).length;
						if (count === 1) {
							response = `There is one ${letter}!\n\n${this.printPuzzleBoard()}\n${this.printCategory()}\n${this.promptForGuess()}`;
						} else {
							response = `There are ${count} ${letter}s!\n\n${this.printPuzzleBoard()}\n${this.printCategory()}\n${this.promptForGuess()}`;
						}
					}
					
				} else {
					response = `${letter} has already been called. Don't worry, we won't count that as a wrong guess.\n\n` + 
						`${this.printPuzzleBoard()}\n${this.printCategory()}\n${this.promptForGuess()}`;
				}

				this.bot.sendMessage({
					to: this.channelID,
					message: response,
				}, this.sendCallback);

			} else if (solveRegex.test(message)) {
				const guess = message.replace(solveRegex, "$1").toUpperCase();
				if (this.puzzle.answer === guess) {
					// tell user they've got it right
					response = this.handleWin();
					this.endGame();
				} else {
					response = "Sorry, that's not the correct solution.\n";
					this.incorrectGuesses++;
					if (this.incorrectGuesses === maxIncorrect) {
						// game over, tell the user the right answer
						response = response.concat(this.handleLoss());
						this.endGame();
					} else {
						// TODO print the board again
						response = response.concat(`${this.printPuzzleBoard()}\n${this.printCategory()}\n${this.promptForGuess()}`);
					}
				}
				this.bot.sendMessage({
					to: this.channelID,
					message: response,
				}, this.sendCallback);
			}

			
		}
	}

	sendCallback(err, resp) {
		if (err) {
			logger.error(err);
		} else if (resp) {
			// TODO
		}
	}

	getUserID() {
		return this.userID;
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

	printPuzzleBoard(fullyRevealed = false) {
		return this.puzzle.board.map((line) => {
			return mojify(Array.prototype.map.call(line, (c) => (letters.includes(c) && !this.calledLetters.some((l) => l === c) && !fullyRevealed) ? "_" : c).join(""));
		}).join("\n");
	}

	printCategory() {
		return `\`\`\`${this.puzzle.category}\`\`\``;
	}

	promptForGuess() {
		const plural = (maxIncorrect - this.incorrectGuesses) === 1 ? "guess" : "guesses";
		return `Choose a Letter, or try to Solve (place your guess for either within "[ ]"). You have ${maxIncorrect - this.incorrectGuesses} ${plural} remaining.`;
	}

	handleLoss() {
		return `Sorry <@!${this.userID}>, you've run out of incorrect guesses. This was the correct answer:\n\n${this.printPuzzleBoard(true)}\n${this.printCategory()}\nThanks for playing!`;
	}

	handleWin() {
		return `Congratulations <@!${this.userID}>! You've solved the puzzle!\n\n${this.printPuzzleBoard(true)}\n${this.printCategory()}\nThanks for playing!`;
	}

	endGame() {
		this.endGameCallback(this.channelID);
	}
}