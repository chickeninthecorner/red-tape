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
		return `${this.actionText} all objects, but prioritize the newest rules that apply to the object.`;
	}

	check(color, number, letter) {
		return "accept"
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
		return `${this.actionText} if ${this.traitStatements[0].text} and .${this.traitStatements[1].text}`;
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
		return `${this.actionText} if neither ${this.traitStatements[0].text} or ${this.traitStatements[1].text}.`;
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
		return `${this.actionText} if ${this.traitStatements[0].text} or ${this.traitStatements[1].text}, unless both are true.`
	}
}

export class AtLeastTwoOfThree extends Rule {
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
		return `${this.actionText} if at least 2 out of 3 of the following are true:\n- ${this.traitStatements[0].text}\n- ${this.traitStatements[1].text}\n- ${this.traitStatements[2].text}`;
	}
}