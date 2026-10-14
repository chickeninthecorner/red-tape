import Phaser from '../lib/phaser.js';

class Statement {
	validAnswers = [];

	constructor(trait) {
		if (trait == "color") {
			const statementType = Phaser.Utils.Array.GetRandom(["darkShade", "lightShade", "colorShade"]);

			switch (statementType) {
				case "darkShade":	
					this.validAnswers = ["darkRed", "darkGreen", "darkBlue"];
					this.text = "is dark";
					break;
				case "lightShade":
					this.validAnswers = ["lightRed", "lightGreen", "lightBlue"];
					this.text = "is light";
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
			const statementType = Phaser.Utils.Array.GetRandom(["prime", "odd", "even"]);

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
			}
		}
		else if (trait == "letter") {
			const statementType = Phaser.Utils.Array.GetRandom(["vowel", "consonant"]);

			switch (statementType) {
				case "consonant":	
					this.validAnswers = ["b", "c", "d", "f", "g", "h"];
					this.text = "is a consonant";
					break;
				case "vowel":
					this.validAnswers = ["a", "e", "i"];
					this.text = "is a vowel";
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
			case "number":
				answer = number;
			case "letter":
				answer = letter;
		}

		return this.statement.validAnswers.includes(answer);
	}
}