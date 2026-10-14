import { Default, Is, IsAndNot, IsNorIs, IsXorIs } from '../common/rule.js';
import Phaser from '../lib/phaser.js';

function weightedRandom(items, weightsInput) {
    var i;
	let weights = [...weightsInput];

    for (i = 1; i < weights.length; i++)
        weights[i] += weights[i - 1];
    
    var random = Math.random() * weights[weights.length - 1];
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    
    return items[i];
}

export class RuleList {
	rules = [];
	ruleNums = [];
	ruleCount;
	ruleIndex;

	constructor() {
		this.rules.push(new Default());
		this.ruleCount = 1;
		this.ruleIndex = 1;
		this.ruleNums.push(this.ruleIndex);
	}

	addRule() {
		const ITEMS = [Is, IsAndNot, IsNorIs, IsXorIs];
		const WEIGHTS = [8, 4, 2, 1];
		const rule = weightedRandom(ITEMS, WEIGHTS);
		this.rules.push(new rule());

		this.ruleCount += 1;
		this.ruleIndex += 1;
		this.ruleNums.push(this.ruleIndex);
	}

	printRules() {
		this.rules.forEach(rule => {
			console.log(rule.text);
		});
	}

	get text() {
		let result = "";

		for (let i = 0; i < this.ruleCount; i++) {
			if (result !== "") {
				result += "\n\n";
			}

			result += `RULE #${this.ruleNums[i]}\n${this.rules[i].text}`;
		}

		return result;
	}

	getCorrectAction(color, number, letter) {
		let result;

		this.rules.forEach(rule => {
			const action = rule.check(color, number, letter);
			if (action != "neutral") {
				result = action;
			}
			console.log(Math.random(), action);
		});

		return result;
	}
}