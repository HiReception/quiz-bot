var logger = require("winston");

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});

const maxIncorrect = 5;

const puzzles = [
	{answer: "ANIMAL RESCUE",					category: "PHRASE", 			board: ["            ","   ANIMAL   ","   RESCUE   ","            "]},
	{answer: "ENGLISH BREAKFAST TEA",			category: "FOOD & DRINK", 		board: ["  ENGLISH   "," BREAKFAST  ","    TEA     ","            "]},
	{answer: "CRUSHED ICE",						category: "FOOD & DRINK", 		board: ["            ","CRUSHED ICE ","            ","            "]},
	{answer: "APPLE TART",						category: "FOOD & DRINK", 		board: ["            "," APPLE TART ","            ","            "]},
	{answer: "HAIL TO THE CHIEF",				category: "TITLE", 				board: ["            ","HAIL TO THE ","   CHIEF    ","            "]},
	{answer: "BANJO PLAYER",					category: "OCCUPATION", 		board: ["            ","BANJO PLAYER","            ","            "]},
	{answer: "GENUINE LEATHER TRIM",			category: "THING", 				board: ["            ","  GENUINE   ","LEATHER TRIM","            "]},
	{answer: "KENNEDY CENTER HONOREES",			category: "PEOPLE", 			board: ["  KENNEDY   ","   CENTER   ","  HONOREES  ","            "]},
	{answer: "CLINICALLY TESTED",				category: "PHRASE", 			board: ["            "," CLINICALLY ","   TESTED   ","            "]},
	{answer: "MONUMENT VALLEY",					category: "ON THE MAP", 		board: ["            ","  MONUMENT  ","   VALLEY   ","            "]},
	{answer: "SLEEPLESS IN SEATTLE",			category: "TITLE", 				board: ["            ","SLEEPLESS IN","  SEATTLE   ","            "]},
	{answer: "BUSINESS CARD HOLDER",			category: "THING", 				board: ["            ","  BUSINESS  ","CARD HOLDER ","            "]},
	{answer: "EASTERN STANDARD TIME",			category: "THING", 				board: ["  EASTERN   ","  STANDARD  ","    TIME    ","            "]},
	{answer: "GREEN WITH ENVY",					category: "PHRASE", 			board: ["            "," GREEN WITH ","    ENVY    ","            "]},
	{answer: "LIGHTHOUSE",						category: "THING", 				board: ["            "," LIGHTHOUSE ","            ","            "]},
	{answer: "PARCHMENT PAPER",					category: "THING", 				board: ["            "," PARCHMENT  ","   PAPER    ","            "]},
	{answer: "RIGHTFUL OWNER",					category: "PERSON", 			board: ["            ","  RIGHTFUL  ","   OWNER    ","            "]},
	{answer: "ROW ROW ROW YOUR BOAT",			category: "TITLE", 				board: ["            ","ROW ROW ROW "," YOUR BOAT  ","            "]},
	{answer: "CASPER WYOMING",					category: "ON THE MAP", 		board: ["            ","   CASPER   ","  WYOMING   ","            "]},
	{answer: "ATTENTION SHOPPERS",				category: "PHRASE", 			board: ["            "," ATTENTION  ","  SHOPPERS  ","            "]},
	{answer: "RUNS BATTED IN",					category: "THINGS", 			board: ["            ","RUNS BATTED ","     IN     ","            "]},
	{answer: "BAY LEAVES & ROSEMARY",			category: "FOOD & DRINK", 		board: ["            "," BAY LEAVES "," & ROSEMARY ","            "]},
	{answer: "EARS OF CORN",					category: "FOOD & DRINK", 		board: ["            ","EARS OF CORN","            ","            "]},
	{answer: "MARRIED NAME",					category: "THING", 				board: ["            ","MARRIED NAME","            ","            "]},
	{answer: "COVER MODEL",						category: "PERSON", 			board: ["            ","COVER MODEL ","            ","            "]},
	{answer: "EXOTIC BEACHES",					category: "PLACES", 			board: ["            ","   EXOTIC   ","  BEACHES   ","            "]},
	{answer: "HUDSON RIVER",					category: "ON THE MAP", 		board: ["            ","HUDSON RIVER","            ","            "]},
	{answer: "BROWN RECLUSE SPIDER",			category: "ANIMAL", 			board: ["   BROWN    ","  RECLUSE   ","   SPIDER   ","            "]},
	{answer: "NEW ORLEANS LOUISIANA",			category: "ON THE MAP", 		board: ["            ","NEW ORLEANS "," LOUISIANA  ","            "]},
	{answer: "OVEN FRIED CHICKEN",				category: "FOOD & DRINK", 		board: ["            "," OVEN FRIED ","  CHICKEN   ","            "]},
	{answer: "COFFEE & TEA STAINS",				category: "THINGS", 			board: ["            ","COFFEE & TEA","   STAINS   ","            "]},
	{answer: "HASTE MAKES WASTE",				category: "PHRASE", 			board: ["            ","HASTE MAKES ","   WASTE    ","            "]},
	{answer: "ATHENS GREECE",					category: "ON THE MAP", 		board: ["            ","   ATHENS   ","   GREECE   ","            "]},
	{answer: "BOSTON LEGAL",					category: "TITLE", 				board: ["            ","BOSTON LEGAL","            ","            "]},
	{answer: "FALLING STAR",					category: "THING", 				board: ["            ","FALLING STAR","            ","            "]},
	{answer: "RECORDING SESSION",				category: "THING", 				board: ["            "," RECORDING  ","  SESSION   ","            "]},
	{answer: "MY NAME IS EARL",					category: "TITLE", 				board: ["            "," MY NAME IS ","    EARL    ","            "]},
	{answer: "GUEST COTTAGE",					category: "PLACE", 				board: ["            ","   GUEST    ","  COTTAGE   ","            "]},
	{answer: "BY HOOK OR BY CROOK",				category: "PHRASE", 			board: ["            "," BY HOOK OR ","  BY CROOK  ","            "]},
	{answer: "DOUBLE STUF OREOS",				category: "FOOD & DRINK", 		board: ["            ","DOUBLE STUF ","   OREOS    ","            "]},
	{answer: "HONOLULU HAWAII",					category: "ON THE MAP", 		board: ["            ","  HONOLULU  ","   HAWAII   ","            "]},
	{answer: "LAS VEGAS NEVADA",				category: "ON THE MAP", 		board: ["            "," LAS VEGAS  ","   NEVADA   ","            "]},
	{answer: "OLD NEWSPAPERS",					category: "THINGS", 			board: ["            ","    OLD     "," NEWSPAPERS ","            "]},
	{answer: "POLITICAL SATIRE",				category: "THING", 				board: ["            "," POLITICAL  ","   SATIRE   ","            "]},
	{answer: "GAS & WATER PUMP",				category: "THING", 				board: ["            ","GAS & WATER ","    PUMP    ","            "]},
	{answer: "ASPIRING ACTOR",					category: "OCCUPATION", 		board: ["            ","  ASPIRING  ","   ACTOR    ","            "]},
	{answer: "DEMOCRATIC PARTY",				category: "TITLE", 				board: ["            "," DEMOCRATIC ","   PARTY    ","            "]},
	{answer: "MOVIE TRAILER HITCH",				category: "BEFORE & AFTER", 	board: ["   MOVIE    ","  TRAILER   ","   HITCH    ","            "]},
	{answer: "NO SHOES NO SHIRT NO SERVICE",	category: "PHRASE", 			board: ["  NO SHOES  ","  NO SHIRT  "," NO SERVICE ","            "]},
	{answer: "BACKYARD BARBECUE",				category: "EVENT", 				board: ["            ","  BACKYARD  ","  BARBECUE  ","            "]},
	{answer: "GREAT WHITE PELICAN",				category: "ANIMAL", 			board: ["            ","GREAT WHITE ","  PELICAN   ","            "]},
	{answer: "JEWELRY CABINET",					category: "AROUND THE HOUSE", 	board: ["            ","  JEWELRY   ","  CABINET   ","            "]},
	{answer: "ROADSIDE FAMILY DINER",			category: "PLACE", 				board: ["            ","  ROADSIDE  ","FAMILY DINER","            "]},
	{answer: "SCRAPBOOK",						category: "THING", 				board: ["            "," SCRAPBOOK  ","            ","            "]},
	{answer: "BEEN THERE DONE THAT",			category: "PHRASE", 			board: ["            "," BEEN THERE "," DONE THAT  ","            "]},
	{answer: "BRANSON MISSOURI",				category: "ON THE MAP", 		board: ["            ","  BRANSON   ","  MISSOURI  ","            "]},
	{answer: "GAME OF CARDS",					category: "THING", 				board: ["            ","  GAME OF   ","   CARDS    ","            "]},
	{answer: "PAR FOR THE COURSE",				category: "PHRASE", 			board: ["            ","PAR FOR THE ","   COURSE   ","            "]},
	{answer: "PRACTICAL ATTIRE",				category: "THING", 				board: ["            "," PRACTICAL  ","   ATTIRE   ","            "]},
	{answer: "BIRTHDAY PARTY",					category: "EVENT", 				board: ["            ","  BIRTHDAY  ","   PARTY    ","            "]},
	{answer: "DOG WAGGING ITS TAIL",			category: "PHRASE", 			board: ["            ","DOG WAGGING ","  ITS TAIL  ","            "]},
	{answer: "HIGH SCHOOL",						category: "PLACE", 				board: ["            ","HIGH SCHOOL ","            ","            "]},
	{answer: "JAMBALAYA",						category: "FOOD & DRINK", 		board: ["            "," JAMBALAYA  ","            ","            "]},
	{answer: "REAR BUMPER CROP",				category: "BEFORE & AFTER", 	board: ["            ","REAR BUMPER ","    CROP    ","            "]},
	{answer: "BURNED TO A CRISP",				category: "PHRASE", 			board: ["            ","BURNED TO A ","   CRISP    ","            "]},
	{answer: "PERSONAL SPACE CASE",				category: "BEFORE & AFTER", 	board: ["            ","  PERSONAL  "," SPACE CASE ","            "]},
	{answer: "RARE QUALITIES",					category: "PHRASE", 			board: ["            ","    RARE    "," QUALITIES  ","            "]},
	{answer: "CELEBRITY JOURNALIST",			category: "OCCUPATION", 		board: ["            "," CELEBRITY  "," JOURNALIST ","            "]},
	{answer: "RELIEF PITCHER",					category: "OCCUPATION", 		board: ["            ","   RELIEF   ","  PITCHER   ","            "]},
	{answer: "BENJAMIN FRANKLIN",				category: "PROPER NAME", 		board: ["            ","  BENJAMIN  ","  FRANKLIN  ","            "]},
	{answer: "INSPIRING LECTURE",				category: "EVENT", 				board: ["            "," INSPIRING  ","  LECTURE   ","            "]},
	{answer: "PEACH COBBLER",					category: "FOOD & DRINK", 		board: ["            ","   PEACH    ","  COBBLER   ","            "]},
	{answer: "PLASTIC FORKS",					category: "THINGS", 			board: ["            ","  PLASTIC   ","   FORKS    ","            "]},
	{answer: "SHARP AS A TACK",					category: "PHRASE", 			board: ["            "," SHARP AS A ","    TACK    ","            "]},
	{answer: "CUSTOMER SERVICE AWARD",			category: "THING", 				board: ["  CUSTOMER  ","  SERVICE   ","   AWARD    ","            "]},
	{answer: "RENTAL CAR",						category: "THING", 				board: ["            "," RENTAL CAR ","            ","            "]},
	{answer: "SECRET BALLOT",					category: "PHRASE", 			board: ["            ","   SECRET   ","   BALLOT   ","            "]},
	{answer: "SHAGGY & SCOOBY-DOO",				category: "CHARACTERS",			board: ["            ","  SHAGGY &  "," SCOOBY-DOO ","            "]},
	{answer: "SHOW SOME RESPECT",				category: "PHRASE", 			board: ["            "," SHOW SOME  ","  RESPECT   ","            "]},
	{answer: "BEANS & CORNBREAD",				category: "FOOD & DRINK", 		board: ["            ","  BEANS &   "," CORNBREAD  ","            "]},
	{answer: "SIGHT UNSEEN",					category: "PHRASE", 			board: ["            ","SIGHT UNSEEN","            ","            "]},
	{answer: "CIVIL CEREMONY",					category: "EVENT", 				board: ["            ","   CIVIL    ","  CEREMONY  ","            "]},
	{answer: "HOMEMADE DINNER ROLLS",			category: "FOOD & DRINK", 		board: ["            ","  HOMEMADE  ","DINNER ROLLS","            "]},
	{answer: "LEGENDARY FILMMAKER",				category: "OCCUPATION", 		board: ["            "," LEGENDARY  "," FILMMAKER  ","            "]},
	{answer: "COMIC ACTOR JACK BLACK",			category: "PROPER NAME", 		board: ["            ","COMIC ACTOR "," JACK BLACK ","            "]},
	{answer: "DEAD RINGER",						category: "PHRASE", 			board: ["            ","DEAD RINGER ","            ","            "]},
	{answer: "GOLDEN GATE BRIDGE",				category: "ON THE MAP", 		board: ["            ","GOLDEN GATE ","   BRIDGE   ","            "]},
	{answer: "PERMISSION GRANTED",				category: "PHRASE", 			board: ["            "," PERMISSION ","  GRANTED   ","            "]},
	{answer: "PLEASE TAKE YOUR SEATS",			category: "PHRASE", 			board: ["            ","PLEASE TAKE "," YOUR SEATS ","            "]},
	{answer: "COMMON PHEASANT",					category: "ANIMAL", 			board: ["            ","   COMMON   ","  PHEASANT  ","            "]},
	{answer: "DESSERT BOWL",					category: "AROUND THE HOUSE", 	board: ["            ","DESSERT BOWL","            ","            "]},
	{answer: "EIFFEL TOWER",					category: "ON THE MAP", 		board: ["            ","EIFFEL TOWER","            ","            "]},
	{answer: "MOTORCYCLE GANG",					category: "THING", 				board: ["            "," MOTORCYCLE ","    GANG    ","            "]},
	{answer: "MUSHROOM RISOTTO",				category: "FOOD & DRINK",		board: ["            ","  MUSHROOM  ","  RISOTTO   ","            "]},
	{answer: "CONNECTING FLIGHT",				category: "THING", 				board: ["            "," CONNECTING ","   FLIGHT   ","            "]},
	{answer: "ONE-LINERS & ZINGERS",			category: "THINGS", 			board: ["            "," ONE-LINERS "," & ZINGERS  ","            "]},
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
						// print the board again
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
		return `\`\`\`${this.puzzle.board.map((line) => {
			return Array.prototype.map.call(line, (c) => (letters.includes(c) && !this.calledLetters.some((l) => l === c) && !fullyRevealed) ? "_" : c).join("");
		}).join("\n")}\`\`\``;
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