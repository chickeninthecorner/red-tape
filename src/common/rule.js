import { TraitStatement } from '../common/traitstatement.js';


class Rule {
	traitStatements = [];

	constructor(traitStatementCount, action) {
		if (action == null) {
			this.action = Phaser.Utils.Array.GetRandom(["accept", "reject"]);
		}
		else {
			this.action = action;
		}

		if (this.action == "accept") {
			this.actionText = "[color=green]ACCEPT[/color]";
		}
		else if (this.action == "reject") {
			this.actionText = "[color=red]REJECT[/color]";
		}

		for (let i = traitStatementCount; i > 0; i--) {
			this.addTraitStatement()
		}
	}

	addTraitStatement() {
		// No adjacent trait statement
		if (this.traitStatements.length == 0) {
			this.traitStatements.push(new TraitStatement());
		}
		else {
			let newTraitStatement;
			let attempts = 10;
			const lastIndex = this.traitStatements.length - 1;
			do {
				newTraitStatement = new TraitStatement()
				attempts -= 1;
			} 
			while (newTraitStatement.text == this.traitStatements[lastIndex].text && attempts > 0)

			this.traitStatements.push(newTraitStatement);
		}
	}

	getTraitStatementResults(color, number, letter) {
		const traitStatementsResults = [];
		this.traitStatements.forEach(traitStatement => {
			traitStatementsResults.push(traitStatement.isValidFor(color, number, letter));
		});
		return traitStatementsResults;
	}
}

export class Default extends Rule {
	constructor(action = null) {
		super(0, "accept");
	}

	get text() {
		return "[color=green]ACCEPT[/color] all Items.";
	}

	check(color, number, letter) {
		return "accept";
	}
}

export class Is extends Rule {
	constructor(action = null) {
		super(1, action);
	}

	check(color, number, letter) {
		const traitStatementsResults = this.getTraitStatementResults(color, number, letter);

		if (traitStatementsResults[0]) {
			return this.action;
		}
		return "neutral";
	}

	get text() {
		return `${this.actionText} if ${this.traitStatements[0].text}.`;
	}
}


export class IsAndIs extends Rule {
	constructor(action = null) {
		super(2, action);
	}

	check(color, number, letter) {
		const traitStatementsResults = this.getTraitStatementResults(color, number, letter);

		if (traitStatementsResults[0] && traitStatementsResults[1]) {
			return this.action;
		}
		return "neutral";
	}

	get text() {
		return `${this.actionText} if ${this.traitStatements[0].text} and ${this.traitStatements[1].text}.`;
	}
}

export class IsAndNot extends Rule {
	constructor(action = null) {
		super(2, action);
	}

	check(color, number, letter) {
		const traitStatementsResults = this.getTraitStatementResults(color, number, letter);

		if (traitStatementsResults[0] && !traitStatementsResults[1]) {
			return this.action;
		}
		return "neutral";
	}

	get text() {
		return `${this.actionText} if ${this.traitStatements[0].text}, unless ${this.traitStatements[1].text}.`;
	}
}


export class IsNorIs extends Rule {
	constructor(action = null) {
		super(2, action);
	}

	check(color, number, letter) {
		const traitStatementsResults = this.getTraitStatementResults(color, number, letter);

		if (!(traitStatementsResults[0] || traitStatementsResults[1])) {
			return this.action;
		}
		return "neutral";
	}

	get text() {
		return `${this.actionText} if neither ${this.traitStatements[0].text} nor ${this.traitStatements[1].text}.`;
	}
}

export class IsXorIs extends Rule {
	constructor(action = null) {
		super(2, action);
	}

	check(color, number, letter) {
		const traitStatementsResults = this.getTraitStatementResults(color, number, letter);

		if (traitStatementsResults[0] != traitStatementsResults[1]) {
			return this.action;
		}
		return "neutral";
	}

	get text() {
		return `${this.actionText} if either ${this.traitStatements[0].text} or ${this.traitStatements[1].text}, unless both are true.`
	}
}

export class AtLeastTwo extends Rule {
	constructor(action = null) {
		super(3, action);
	}

	check(color, number, letter) {
		const traitStatementsResults = this.getTraitStatementResults(color, number, letter);

		let trues = 0;
		traitStatementsResults.forEach(result => {
			if (result) {
				trues += 1;
			}
		})

		if (trues >= 2) {
			return this.action;
		}
		return "neutral";
	}

	get text() {
		return `${this.actionText} if there are at least 2 true statements from the following:\n- ${this.traitStatements[0].text}\n- ${this.traitStatements[1].text}\n- ${this.traitStatements[2].text}`;
	}
}


export class Consecutive extends Rule {
	constructor(action = null) {
		super(4, action);
	}

	check(color, number, letter) {
		const traitStatementsResults = this.getTraitStatementResults(color, number, letter);

		let met = false;
		for(let i = 1; i < 4; i++) {
			if(traitStatementsResults[i - 1] && traitStatementsResults[i]) {
				met = true;
				break;
			}
		}

		if (met) {
			return this.action;
		}
		return "neutral";
	}

	get text() {
		return 	`${this.actionText} if there are at least 2 consecutive true statements from the following:`
				+ `\n- ${this.traitStatements[0].text}`
				+ `\n- ${this.traitStatements[1].text}`
				+ `\n- ${this.traitStatements[2].text}`
				+ `\n- ${this.traitStatements[3].text}`;
	}
}


export class NoConsecutive extends Rule {
	constructor(action = null) {
		super(4, action);
	}

	check(color, number, letter) {
		const traitStatementsResults = this.getTraitStatementResults(color, number, letter);

		let met = true;
		for(let i = 1; i < 4; i++) {
			if(traitStatementsResults[i - 1] && traitStatementsResults[i]) {
				met = false;
				break;
			}
		}

		if (met) {
			return this.action;
		}
		return "neutral";
	}

	get text() {
		return 	`${this.actionText} if there are no consecutive true statements from the following:`
				+ `\n- ${this.traitStatements[0].text}`
				+ `\n- ${this.traitStatements[1].text}`
				+ `\n- ${this.traitStatements[2].text}`
				+ `\n- ${this.traitStatements[3].text}`;
	}
}


export class ContiguousBlocks extends Rule {
	constructor(action = null) {
		super(4, action);
	}

	check(color, number, letter) {
		const traitStatementsResults = this.getTraitStatementResults(color, number, letter);

		let met = true;
		let transitions = 1;

		for(let i = 1; i < 4; i++) {
			if(traitStatementsResults[i] != traitStatementsResults[i - 1]) {
				if(transitions > 0) {
					transitions -= 1;
				}
				else {
					met = false;
					break;
				}
			}
		}

		if (met) {
			return this.action;
		}
		return "neutral";
	}

	get text() {
		return 	`${this.actionText} if at most 2 contiguous blocks of truth values form from the following:`
				+ `\n- ${this.traitStatements[0].text}`
				+ `\n- ${this.traitStatements[1].text}`
				+ `\n- ${this.traitStatements[2].text}`
				+ `\n- ${this.traitStatements[3].text}`;
	}
}


export class ExclusivePair extends Rule {
	constructor(action = null) {
		super(4, action);
	}

	check(color, number, letter) {
		const traitStatementsResults = this.getTraitStatementResults(color, number, letter);

		const pair1 = traitStatementsResults[0] && traitStatementsResults[1];
		const pair2 = traitStatementsResults[2] && traitStatementsResults[3];

		if ((pair1 || pair2) && pair1 != pair2) {
			return this.action;
		}
		return "neutral";
	}

	get text() {
		return 	`${this.actionText} if either are true, unless both are:`
				+ `\n- ${this.traitStatements[0].text} and ${this.traitStatements[1].text}`
				+ `\n- ${this.traitStatements[2].text} and ${this.traitStatements[3].text}`;
	}
}