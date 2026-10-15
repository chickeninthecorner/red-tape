import { Default, Is, IsAndNot, IsNorIs, IsXorIs } from '../common/rule.js';

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
	ITEMS = [Is, IsAndNot, IsNorIs, IsXorIs];
	WEIGHTS = [8, 4, 2, 1];

	constructor() {
		this.rules.push(new Default());
		this.ruleCount = 1;
		this.ruleIndex = 1;
		this.ruleNums.push(this.ruleIndex);
	}

	addRule() {
		const rule = weightedRandom(this.ITEMS, this.WEIGHTS);
		const numAccept = this.getActionCount("accept");
		const numReject = this.getActionCount("reject");
		console.log(numAccept, numReject);
		if (numReject == 0 || numAccept > numReject + 1) {
			this.rules.push(new rule("reject"));
		}
		else if (numReject > numAccept + 1) {
			this.rules.push(new rule("accept"));
		}
		else {
			this.rules.push(new rule());
		}

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

			result += `RULE #${this.ruleNums[i]}\n---\n${this.rules[i].text}.`;
		}

		return result;
	}

	getActionCount(action) {
		let result = 0;

		this.rules.forEach(rule => {
			if (rule.action == action) {
				result += 1;
				console.log(rule.text, rule.action);
			}
		});

		return result;
	}

	getCorrectAction(color, number, letter) {
		let result;

		this.rules.forEach(rule => {
			const action = rule.check(color, number, letter);
			if (action != "neutral") {
				result = action;
			}
		});

		return result;
	}
}