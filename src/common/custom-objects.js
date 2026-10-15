import { ASSET_KEYS } from './assets.js';
import { Default, Is, IsAndNot, IsNorIs, IsXorIs } from '../common/rule.js';

export class Item extends Phaser.GameObjects.Container {
	LERP = 0.1;

	constructor(scene, x, y, color, number, letter) {
		super(scene, x - 500, y);
		this.scene = scene;

		this.spriteObject = scene.add.image(0, 0, ASSET_KEYS.SQUARES, scene.color).setScale(0.875);
		this.spriteObject.rotation += Phaser.Math.FloatBetween(-0.5, 0.5);
		
		let textColor;
		if (color.startsWith("dark")) {
			textColor = "#FFFFFF";
			}
		else {
			textColor = "#0E0F23";
			}

		this.textObject = scene.add.text(
			0, 
			0, 
			`${number}${letter.toUpperCase()}`, 
			{
				fontFamily: "Tengoku", 
				fontSize: 96, 
				color: textColor,
			}
		).setOrigin(0.5);

		this.add([this.spriteObject, this.textObject]);
	}

	update(time, delta) {
		this.spriteObject.rotation += 0.0001 * delta;
		this.x = (this.scene.scale.width / 4 - this.x) * this.LERP + this.x;
	}
}


export class AcceptButton extends Phaser.GameObjects.Container {
	MAX_SCALE = 1.05;
	MIN_SCALE = 0.8;
	LERP = 0.2;

	constructor(scene, x, y) {
		super(scene, x, y);
		this.scene = scene;

		this.hovered = false;

		this.spriteObject = scene.add.image(0, 0, ASSET_KEYS.ACCEPT_BUTTON).setScale(1 , 1).setInteractive();
		this.spriteObject.on('pointerover', () => this.hovered = true);
		this.spriteObject.on('pointerout', () => this.hovered = false);
		this.spriteObject.on('pointerdown', () => this.press());

		this.textObject = scene.add.text(
			0, 
			0, 
			"Accept", 
			{
				fontFamily: "Tengoku", 
				fontSize: 48, 
				color: "#FFFFFF",
			}
		).setOrigin(0.5);

		this.add([this.spriteObject, this.textObject]);
	}

	update() {
		if (this.hovered) {
			this.setScale((this.MAX_SCALE - this.scale) * this.LERP + this.scale);
		}
		else {
			this.setScale((1 - this.scale) * this.LERP + this.scale);
		}
	}

	press() {
		this.setScale(this.MIN_SCALE);
		this.scene.evaluate("accept");
	}
}


export class RejectButton extends Phaser.GameObjects.Container {
	MAX_SCALE = 1.05;
	MIN_SCALE = 0.8;
	LERP = 0.2;

	constructor(scene, x, y) {
		super(scene, x, y);
		this.scene = scene;

		this.hovered = false;

		this.spriteObject = scene.add.image(0, 0, ASSET_KEYS.REJECT_BUTTON).setScale(1 , 1).setInteractive();
		this.spriteObject.on('pointerover', () => this.hovered = true);
		this.spriteObject.on('pointerout', () => this.hovered = false);
		this.spriteObject.on('pointerdown', () => this.press());

		this.textObject = scene.add.text(
			0, 
			0, 
			"Reject", 
			{
				fontFamily: "Tengoku", 
				fontSize: 48, 
				color: "#FFFFFF",
			}
		).setOrigin(0.5);

		this.add([this.spriteObject, this.textObject]);
	}

	update() {
		if (this.hovered) {
			this.setScale((this.MAX_SCALE - this.scale) * this.LERP + this.scale);
		}
		else {
			this.setScale((1 - this.scale) * this.LERP + this.scale);
		}
	}

	press() {
		this.setScale(this.MIN_SCALE);
		this.scene.evaluate("reject");
	}
}


export class Flash extends Phaser.GameObjects.Container {
	MAX_TIME = 2 * 1000;

	constructor(scene, x, y, type) {
		super(scene, x, y);
		this.scene = scene;

		let frame;
		let text;
		switch (type) {
			case "wrong":
				frame = "wrong";
				text = "INCORRECT";
				break;
			case "newRule":
				frame = "newRule";
				text = "NEW RULE";
		}

		this.spriteObject = scene.add.image(0, 0, ASSET_KEYS.FLASHES, frame);
		this.textObject = scene.add.text(
			0, 
			0, 
			text, 
			{
				fontFamily: "Tengoku", 
				fontSize: 96, 
				color: "#FFFFFF",
			}
		).setOrigin(0.5);

		this.add([this.spriteObject, this.textObject]);

		this.timer = this.scene.time.addEvent({
			delay: this.MAX_TIME,
			callback: this.onTimerComplete,
			callbackScope: this
		});
	}

	update(time, delta) {
		this.alpha = this.timer.getRemaining() / this.MAX_TIME
	}

	onTimerComplete() {
		const index = this.scene.objects.indexOf(this);
		this.scene.objects.splice(index, 1);
		this.destroy();
	}
}


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


export class RuleList extends Phaser.GameObjects.Container {
	rules = [];
	ruleNums = [];
	ruleCount;
	ruleIndex;
	RULE_TYPES = [Is, IsAndNot, IsNorIs, IsXorIs];
	RULE_TYPES_WEIGHTS = [8, 4, 2, 1];

	constructor(scene, x, y) {
		super(scene, x, y);
		this.scene = scene;

		this.rules.push(new Default());
		this.ruleCount = 1;
		this.ruleIndex = 1;
		this.ruleNums.push(this.ruleIndex);

		this.textObject = this.scene.add.text(
			0, 
			0, 
			this.text, 
			{
				fontFamily: "Tengoku", 
				fontSize:24, color: "#0E0F23", 
				wordWrap: {
				width: this.scene.scale.width / 2 - 50,
				},
			},
		);

		this.add(this.textObject)
	}

	getRule() {
		const ruleType = weightedRandom(this.RULE_TYPES, this.RULE_TYPES_WEIGHTS);
		const numAccept = this.getActionCount("accept");
		const numReject = this.getActionCount("reject");
		if (numReject == 0 || numAccept > numReject + 1) {
			return new ruleType("reject");
		}
		else if (numReject > numAccept + 1) {
			return new ruleType("accept");
		}
		else {
			return new ruleType();
		}
	}

	addRule() {
		const rule = this.getRule();

		this.rules.push(rule);
		this.ruleCount += 1;
		this.ruleIndex += 1;
		this.ruleNums.push(this.ruleIndex);
	}

	updateText() {
		this.textObject.text = this.text;
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