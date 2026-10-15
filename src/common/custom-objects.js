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
	MAX_TIME = 1 * 1000;

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
				break;
			case "modifiedRules":
				frame = "newRule";
				text = "MODIFIED\nRULES";
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
		this.alpha = Math.sqrt(this.timer.getRemaining() / this.MAX_TIME);
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
	propertiesList = [];
	ruleCount;
	ruleIndex;
	RULE_TYPES = [Is, IsAndNot, IsNorIs, IsXorIs];
	RULE_TYPES_WEIGHTS = [8, 4, 2, 1];
	PROPERTIES_BATCH_SIZE = 10;
	MAX_REGENERATE_ATTEMPT = 10;
	TARGET_ACCEPT_COUNT = 6;
	TARGET_REJECT_COUNT = 3;
	LERP = 0.3;


	constructor(scene, x, y) {
		super(scene, x, y);
		this.scene = scene;
		this.initialY = y;
		this.targetPosY = y;

		this.rules.push(new Default());
		this.ruleCount = 1;
		this.ruleIndex = 1;
		this.ruleNums.push(this.ruleIndex);

		this.textObject = this.scene.add.rexBBCodeText(
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

		this.textObject.setInteractive().on("wheel", (pointer, dx, dy) => {
			this.targetPosY += Math.round(dy);
		});
	}
	
	update(time, delta) {
		const minY = this.initialY - Math.max(0, 64 + this.textObject.displayHeight - this.scene.scale.height);
		const maxY = this.initialY

		if (this.targetPosY < minY) {
			this.targetPosY = (minY - this.targetPosY) * this.LERP + this.targetPosY;
		}

		if (this.targetPosY > maxY) {
			this.targetPosY = (maxY - this.targetPosY) * this.LERP + this.targetPosY;
		}

		this.y = (this.targetPosY - this.y) * this.LERP + this.y;
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

		this.updateText();
	}

	spliceRule(index) {
		this.rules.splice(index, 1);
		this.ruleNums.splice(index, 1);
		this.ruleCount -= 1;

		this.updateText();
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

	get length() {
		return this.rules.length;
	}

	getActionCount(action) {
		let result = 0;

		this.rules.forEach(rule => {
			if (rule.action == action) {
				result += 1;
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

	generateItemProperties() {
		if (this.propertiesList.length == 0) {
			let attempts = this.MAX_REGENERATE_ATTEMPT
			let accepts = 0;
			let rejects = 0;
			while (this.propertiesList.length < this.PROPERTIES_BATCH_SIZE) {
				const prefix = Phaser.Utils.Array.GetRandom(["dark", "light"]);
				const suffix = Phaser.Utils.Array.GetRandom(["Red", "Green", "Blue"]);
				const color = prefix + suffix;
				const number = Phaser.Math.Between(0, 9);
				const letter = Phaser.Utils.Array.GetRandom(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);

				const correctAction = this.getCorrectAction(color, number, letter);

				if (attempts > 0) {
					if (correctAction == "accept") {
						if (accepts == this.TARGET_ACCEPT_COUNT && rejects < this.TARGET_REJECT_COUNT) {
							attempts -= 1;
							continue;
						}
						accepts += 1;
					}

					if (correctAction == "reject") {
						if (rejects == this.TARGET_REJECT_COUNT && accepts < this.TARGET_ACCEPT_COUNT) {
							attempts -= 1;
							continue;
						}
						rejects += 1;
					}
				}


				this.propertiesList.push([color, number, letter]);
			}
		}
		
		return this.propertiesList.pop();
	}
}