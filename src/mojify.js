const number_words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

export default function (line) {
	return line.split("").map(char => {
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
}