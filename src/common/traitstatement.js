function getUniqueLetters(word) {
	const letters = new Set();
	for (let i = 0; i < word.length; i++) {
		letters.add(word[i]);
	}
	return [...letters];
}

class Statement {
	validAnswers = [];
	NOUNS = ["time", "mind", "bomb", "hour", "help", "risk", "task", "pain", "clue", "flaw", "game"];

	constructor(trait) {
		if (trait == "color") {
			const statementType = Phaser.Utils.Array.GetRandom(["darkShade", "lightShade", "colorShade"]);

			switch (statementType) {
				case "darkShade":	
					this.validAnswers = ["darkRed", "darkGreen", "darkBlue"];
					this.text = "is a dark color";
					break;
				case "lightShade":
					this.validAnswers = ["lightRed", "lightGreen", "lightBlue"];
					this.text = "is a light color";
					break;
				case "colorShade":
					const prefix = ["light", "dark"];
					const suffix = Phaser.Utils.Array.GetRandom(["Red", "Green", "Blue"]);
					this.validAnswers = [];
					prefix.forEach(element => {
						this.validAnswers.push(element + suffix)
					});
					this.text = `is a shade of ${suffix.toLowerCase()}`;
			}
		}
		else if (trait == "number") {
			const statementType = Phaser.Utils.Array.GetRandom(["prime", "odd", "even", "perfectSquare"]);

			switch (statementType) {
				case "prime":	
					this.validAnswers = [2, 3, 5, 7];
					this.text = "is prime";
					break;
				case "odd":
					this.validAnswers = [1, 3, 5, 7, 9];
					this.text = "is odd";
					break;
				case "even":
					this.validAnswers = [0, 2, 4, 6, 8];
					this.text = "is even";
					break;
				case "perfectSquare":
					this.validAnswers = [0, 1, 4, 9];
					this.text = "is a perfect square";
					break;
			}
		}
		else if (trait == "letter") {
			const statementType = Phaser.Utils.Array.GetRandom(["vowel", "consonant", "fromWord"]);

			switch (statementType) {
				case "consonant":	
					this.validAnswers = ["b", "c", "d", "f", "g", "h"];
					this.text = "is a consonant";
					break;
				case "vowel":
					this.validAnswers = ["a", "e", "i"];
					this.text = "is a vowel";
					break;
				case "fromWord":
					const word = Phaser.Utils.Array.GetRandom(this.NOUNS);
					this.validAnswers = getUniqueLetters(word);
					this.text = `is in the word ${word.toUpperCase()}`;
					break;
			}
		}
	}
}

class Trait {
	constructor() {
		this.type = Phaser.Utils.Array.GetRandom(["color", "number", "letter"]);
		this.text = `the ${this.type[0].toUpperCase()}${this.type.slice(1)}`;
	}
}

export class TraitStatement { 
	constructor() {
		this.trait = new Trait();
		this.statement = new Statement(this.trait.type);
	}

	get text() {
		return `${this.trait.text} ${this.statement.text}`;
	}

	isValidFor(color, number, letter) {
		let answer;
		switch(this.trait.type)
		{
			case "color":
				answer = color;
				break;
			case "number":
				answer = number;
				break;
			case "letter":
				answer = letter;
		}

		return this.statement.validAnswers.includes(answer);
	}
}