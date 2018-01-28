var math = require("mathjs");
var logger = require("winston");
import mojify from "./mojify.js";

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

const values = [
	{value: 0.5,	string: "50c"},
	{value: 1,		string: "$1"},
	{value: 2,		string: "$2"},
	{value: 5,		string: "$5"},
	{value: 10,		string: "$10"},
	{value: 20,		string: "$20"},
	{value: 50,		string: "$50"},
	{value: 100,	string: "$100"},
	{value: 150,	string: "$150"},
	{value: 200,	string: "$200"},
	{value: 250,	string: "$250"},
	{value: 500,	string: "$500"},
	{value: 750,	string: "$750"},
	{value: 1000,	string: "$1,000"},
	{value: 2000,	string: "$2,000"},
	{value: 3000,	string: "$3,000"},
	{value: 4000,	string: "$4,000"},
	{value: 5000,	string: "$5,000"},
	{value: 10000,	string: "$10,000"},
	{value: 15000,	string: "$15,000"},
	{value: 20000,	string: "$20,000"},
	{value: 30000,	string: "CAR"},
	{value: 50000,	string: "$50,000"},
	{value: 75000,	string: "$75,000"},
	{value: 100000,	string: "$100,000"},
	{value: 200000,	string: "$200,000"}
];

const roundLengths = [6,5,4,3,2,1,1,1,1,1];


export default class DealOrNoDealGame {
	/**
	 * Shuffles array in place. ES6 version
	 * @param {Array} a items The array containing the items.
	 */

	shuffle(a) {
		for (let i = a.length; i; i--) {
			let j = Math.floor(Math.random() * i);
			[a[i - 1], a[j]] = [a[j], a[i - 1]];
		}
	}

	gameHandler(user, userID, channelID, message, evt) {
		const caseSelectRegex = /^.*\[([0-9]+)\].*$/;
		const offerRegex = /^.*\[([DN])\].*$/;
		if (userID === this.userID) {
			if (caseSelectRegex.test(message)) {
				if (!this.offerAvailable) {
					// grab the case number out of the message
					const caseNumber = parseInt(message.replace(caseSelectRegex, "$1"));
					if (isNaN(caseNumber) || caseNumber <= 0 || caseNumber > this.cases.length) {
						this.bot.sendMessage({
							to: this.channelID,
							message: `There is no case ${caseNumber} in this game. Please select another.`
						}, this.sendCallback);
					} else if (this.ownCase === -1) {
						this.selectOwnCase(caseNumber);
					} else if (!this.cases[caseNumber - 1].removed) {
						this.removeCase(caseNumber);
					} else {
						this.bot.sendMessage({
							to: this.channelID,
							message: `Case ${caseNumber} has already been selected. Please select a different case.`
						}, this.sendCallback);
					}
				}
			} else if (offerRegex.test(message) && this.offerAvailable) {
				const response = message.replace(offerRegex, "$1");
				if (response === "D") {
					this.acceptOffer();
				} else if (response === "N") {
					this.rejectOffer();
				}
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

		this.ownCase = -1;
		this.currentRound = 0;
		this.casesBeforeNextOffer = roundLengths[0];
		this.offerAvailable = false;
		this.currentOffer = 0;
		this.cases = values.map((v) => {
			v.removed = false;
			return v;
		});

		this.shuffle(this.cases);
		
		this.bot.sendMessage({
			to: this.channelID,
			message: `Welcome to the game, <@!${userID}>!\n\n${this.printRemainingCases()}\n${this.printRemainingValues()}\nChoose a Case (number within "[ ]")`
		}, this.sendCallback);
	}

	printRemainingValues() {
		const valueTable = values.map((v) => {
			if (this.cases.find((c) => c.value === v.value).removed) {
				return "";
			} else {
				return v.string;
			}
		});

		const maxStringLength = Math.max(...values.map((v) => v.string.length));

		let lines = [];

		for (var i = 0; i < valueTable.length/2; i++) {
			lines.push(`|${this.padValue(valueTable[i], maxStringLength)}|${this.padValue(valueTable[i + valueTable.length/2], maxStringLength)}|`);
		}
		return `\`\`\`\n${lines.join("\n")}\n\`\`\``;


	}

	padValue(value, width) {
		const canvas = Array(width + 1).join(" ");
		return (value + canvas).slice(0,width);
	}

	printRemainingCases() {
		const unselectedCases = this.cases.map((c, index) => {
			return index + 1;
		}).filter((n) => {
			return !this.cases[n - 1].removed && this.ownCase !== n;
		});
		if (unselectedCases.length > 6) {
			const caseStrings = [
				`${this.printCase(1)}-${this.printCase(2)}-${this.printCase(3)}-${this.printCase(4)}-${this.printCase(5)}-${this.printCase(6)}`,
				`---${this.printCase(7)}-${this.printCase(8)}-${this.printCase(9)}-${this.printCase(10)}---`,
				`${this.printCase(11)}-${this.printCase(12)}-${this.printCase(13)}-${this.printCase(14)}-${this.printCase(15)}-${this.printCase(16)}`,
				`---${this.printCase(17)}-${this.printCase(18)}-${this.printCase(19)}-${this.printCase(20)}---`,
				`${this.printCase(21)}-${this.printCase(22)}-${this.printCase(23)}-${this.printCase(24)}-${this.printCase(25)}-${this.printCase(26)}`
			];

			const stringArray = caseStrings.map(function(line) {
				return mojify(line);
			}).join("\n");

			return stringArray;
		} else {
			const caseString = unselectedCases.map((n) => { return this.printCase(n); }).join("-");
			return mojify(caseString);
		}
		
	}

	calculateOffer() {
		const remainingValues = this.cases.filter((c) => {return c.removed === false; }).map((c) => {return c.value;});
		const meanValue = math.mean(remainingValues);
		// deduct a random amount between 5% and 15%
		const deductionFactor = Math.random() * 0.1 + 0.05;
		const unroundedOffer = meanValue * (1 - deductionFactor);
		const evenness = Math.pow(10, Math.floor(Math.log10(unroundedOffer)) - 1);
		return Math.floor(unroundedOffer / evenness) * evenness;
	}

	promptForCaseRemoval() {
		const numCases = this.casesBeforeNextOffer;
		var areIs = numCases === 1 ? "is" : "are";
		var noun = numCases === 1 ? "case" : "cases";
		return `Please select a case to remove. There ${areIs} ${numCases} ${noun} left before the next offer.`;
	}

	numRemainingCases() {
		return values.filter((c) => { return c.removed === false; }).length;
	}

	printCase(num) {
		if (this.cases[num - 1].removed || this.ownCase === num) {
			return "--";
		} else {
			return num < 10 ? "0" + num.toString() : num.toString();
		}
	}

	selectOwnCase(num) {
		this.ownCase = num;
		this.bot.sendMessage({
			to: this.channelID,
			message: `You have chosen Case ${num}\n${this.printRemainingCases()}\n${this.printRemainingValues()}\n${this.promptForCaseRemoval()}`
		}, this.sendCallback);
	}

	removeCase(num) {
		let selectedCase = this.cases[num - 1];

		selectedCase.removed = true;

		this.casesBeforeNextOffer -= 1;
		var prompt;
		if (this.casesBeforeNextOffer === 0) {
			this.currentOffer = this.calculateOffer();
			this.offerAvailable = true;
			prompt = `The banker is willing to offer you $${this.currentOffer} for your case. Enter [D] for Deal, or [N] for No Deal.`;
		} else {
			prompt = this.promptForCaseRemoval();
		}

		this.bot.sendMessage({
			to: this.channelID,
			message: `Case ${num} contains:\n\`\`\`\n${selectedCase.string}\n\`\`\`\n${this.printRemainingCases()}\n${this.printRemainingValues()}\n${prompt}`
		}, this.sendCallback);
	}

	acceptOffer() {
		this.bot.sendMessage({
			to: this.channelID,
			message: `DEAL!\n\nYour case contained:\n\`\`\`\n${this.cases[this.ownCase - 1].string}\n\`\`\`\nCongratulations <@!${this.userID}>, you've won $${this.currentOffer}! Thanks for playing!`
		}, this.sendCallback);
		this.endGame();
	}

	rejectOffer() {
		this.offerAvailable = false;
		this.currentRound += 1;
		this.casesBeforeNextOffer = roundLengths[this.currentRound];
		if (this.currentRound === roundLengths.length - 1) {
			this.bot.sendMessage({
				to: this.channelID,
				message: `NO DEAL!\n\nYour case contains:\n\`\`\`\n${this.cases[this.ownCase - 1].string}\n\`\`\`\n` + 
				`Congratulations <@!${this.userID}>, you've won ${this.cases[this.ownCase - 1].string}! Thanks for playing!`
			}, this.sendCallback);
			this.endGame();
		} else {
			this.bot.sendMessage({
				to: this.channelID,
				message: `NO DEAL!\n\n${this.printRemainingCases()}\n${this.printRemainingValues()}\n${this.promptForCaseRemoval()}`
			}, this.sendCallback);
		}
		
	}

	endGame() {
		this.endGameCallback();
	}
}