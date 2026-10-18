import { ASSET_KEYS } from './assets.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { Default, Is, IsAndIs, IsAndNot, IsNorIs, IsXorIs, AtLeastTwoOfThree } from '../common/rule.js';

class ParticleDrag extends Phaser.GameObjects.Particles.ParticleProcessor {
    constructor(retention = 0.90) {
        super();
        this.retention = retention;
    }
    update(particle) {
        particle.velocityX *= this.retention;
        particle.velocityY *= this.retention;
    }
}

export class Item extends Phaser.GameObjects.Container {
	LERP = 0.1;

	constructor(scene, x, y, color, number, letter) {
		super(scene, x - 500, y);
		this.scene = scene;

		this.emitter = scene.add.particles(0, 0, ASSET_KEYS.SQUARES, {
			frame: color,
			speed: { max: 1000, min: 100 },
			angle: { min: -180, max: 180 },
			lifespan: { min: 100, max: 1000 },
			scale: { min: 0.01, max: 0.3},
			alpha: { start: 0.5, end: 0.0 },
			emitting: false,
		});
		this.emitter.addParticleProcessor(new ParticleDrag(0.9));

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

		this.add([this.emitter, this.spriteObject, this.textObject]);
	}

	update(time, delta) {
		this.spriteObject.rotation += 0.0001 * delta;
		this.x = (this.scene.scale.width / 4 - this.x) * this.LERP + this.x;
	}

	prepareDestroy() {
		this.spriteObject.alpha = 0;
		this.textObject.alpha = 0;

		this.emitter.explode(25, 0, 0)

		this.scene.time.addEvent({
			delay: 1000,
			callback: this.destroy,
			callbackScope: this
		});
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


export class RestartButton extends Phaser.GameObjects.Container {
	MAX_SCALE = 1.05;
	LERP = 0.2;

	constructor(scene, x, y) {
		super(scene, x, y);
		this.scene = scene;

		this.hovered = false;

		this.spriteObject = scene.add.image(0, 0, ASSET_KEYS.GENERIC_BUTTON).setScale(1 , 1).setInteractive();
		this.spriteObject.on('pointerover', () => this.hovered = true);
		this.spriteObject.on('pointerout', () => this.hovered = false);
		this.spriteObject.on('pointerdown', () => this.press());

		this.textObject = scene.add.text(
			0, 
			0, 
			"Restart", 
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
		this.disableInteractive();

		this.scene.prepareRestart();
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
				break;
			case "lose":
				frame = "wrong";
				text = "";
				break;
		}

		this.spriteObject = scene.add.image(0, 0, ASSET_KEYS.FLASHES, frame).setScale(2).setOrigin(0.75, 0.5).setInteractive(); // block accept/reject inputs

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
		this.alpha = this.timer.getRemaining() / this.MAX_TIME;
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
	RULE_TYPES = [Is, IsAndIs, IsAndNot, IsNorIs, IsXorIs, AtLeastTwoOfThree];
	RULE_TYPES_DIFFICULTY_RANGES = [1, 2, 3, 4, 5, 100] // difficulty < 1 means lowest scaling
	RULE_TYPES_WEIGHTS = [
		[1],
		[0, 2, 2],
		[1, 2, 2, 1],
		[1, 2, 2, 2, 1],
		[1, 1, 1, 2, 2, 1],
		[1, 1, 1, 2, 2, 2],
	]
	PROPERTIES_BATCH_SIZE = 5;
	MAX_REGENERATE_ATTEMPTS = 10;
	TARGET_ACCEPT_COUNT = 2;
	TARGET_REJECT_COUNT = 2;
	LERP = 0.4;
	WORD_WRAP_WIDTH = 544;
	MAX_TEXT_HEIGHT_BEFORE_SCROLLABLE = 656;
	rules = [];
	ruleNums = [];
	propertiesList = [];
	ruleCount = 0;
	ruleIndex = 0;

	constructor(scene, x, y) {
		super(scene, x, y);
		this.scene = scene;

		this.textObject = this.scene.add.rexBBCodeText(
			0, 
			0, 
			"", 
			{
				fontFamily: "Tengoku", 
				fontSize:24, color: "#0E0F23", 
				wordWrap: {
				width: this.WORD_WRAP_WIDTH,
				},
			},
		);
		this.initialY = this.textObject.y;
		this.targetPosY = this.textObject.y;

		// add default rule
		this.rules.push(new Default());
		this.ruleCount += 1;
		this.ruleIndex += 1;
		this.ruleNums.push(this.ruleIndex);

		this.updateText();

		const scrollBarX = this.WORD_WRAP_WIDTH + 16;
		this.scrollBarBackgroundObject = this.scene.add.image(scrollBarX, 0, ASSET_KEYS.SCROLL_BAR_BACKGROUND).setScale(0.5, 1).setOrigin(0);
		this.scrollBarObject = this.scene.add.image(scrollBarX, 0, ASSET_KEYS.SCROLL_BAR).setScale(0.5, 1).setOrigin(0).setAlpha(0);

		this.add([this.textObject, this.scrollBarBackgroundObject, this.scrollBarObject]);

		this.textObject.setInteractive().on("wheel", (pointer, dx, dy) => {
			this.targetPosY += Math.round(-dy * 0.5);
			this.revealScrollBar();
		});
	}
	
	update(time, delta) {
		if (this.targetPosY < this.textMinY) {
			this.targetPosY = (this.textMinY - this.targetPosY) * this.LERP + this.targetPosY;
		}

		if (this.targetPosY > this.textMaxY) {
			this.targetPosY = (this.textMaxY - this.targetPosY) * this.LERP + this.targetPosY;
		}

		this.textObject.y = (this.targetPosY - this.textObject.y) * this.LERP + this.textObject.y;

		const visibleRatio = this.visibleHeight / this.textObject.displayHeight
		this.scrollBarObject.displayHeight = this.MAX_TEXT_HEIGHT_BEFORE_SCROLLABLE * visibleRatio;
		const progressRatio = Math.min(Math.max((this.textObject.y - this.textMaxY) / (this.textMinY - this.textMaxY), 0), 1);
		this.scrollBarObject.y = progressRatio * (this.MAX_TEXT_HEIGHT_BEFORE_SCROLLABLE - this.scrollBarObject.displayHeight);

		this.scrollBarBackgroundObject.alpha -= 0.005;
		this.scrollBarObject.alpha -= 0.005;
	}

	revealScrollBar() {
		this.scrollBarBackgroundObject.alpha = 1;
		this.scrollBarObject.alpha = 1;
	}

	get visibleHeight() {
		return Math.min(this.MAX_TEXT_HEIGHT_BEFORE_SCROLLABLE, this.textObject.displayHeight);
	}

	get textMinY() {
		return this.initialY + this.visibleHeight - this.textObject.displayHeight;
	}

	get textMaxY() {
		return this.initialY;
	}

	getRule(difficulty = 0) {
		let weightsIndex = 0;
		while(difficulty >= this.RULE_TYPES_DIFFICULTY_RANGES[weightsIndex]) {
			weightsIndex += 1;
		}
		const weights = this.RULE_TYPES_WEIGHTS[weightsIndex];
		const ruleType = weightedRandom(this.RULE_TYPES, weights);
		console.log(weights);

		const numAccept = this.getActionCount("accept");
		const numReject = this.getActionCount("reject");
		if (numReject == 0 || numAccept > numReject) {
			return new ruleType("reject");
		}
		else if (numReject > numAccept) {
			return new ruleType("accept");
		}
		else {
			return new ruleType();
		}
	}

	addRule(difficulty = 0) {
		const rule = this.getRule(difficulty);

		this.rules.push(rule);
		this.ruleCount += 1;
		this.ruleIndex += 1;
		this.ruleNums.push(this.ruleIndex);

		this.updateText();

		this.scrollToBottom();
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

	scrollToBottom() {
		this.targetPosY = this.textMinY;
		this.revealScrollBar();
	}

	get text() {
		let result = "";

		for (let i = 0; i < this.ruleCount; i++) {
			if (result !== "") {
				result += "\n\n";
			}

			result += `RULE #${this.ruleNums[i]}\n---\n${this.rules[i].text}`;
		}

		return result;
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
			let attempts = this.MAX_REGENERATE_ATTEMPTS
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


function easeInCubic(x) {
	return x * x * x;
}


export class LoadingFrame extends Phaser.GameObjects.Sprite {
	DURATION = 0.5 * 1000;
	MAX_DISPLACEMENT = 720;

	constructor(scene, x, y, loadType, nextScene) {
		super(scene, x, y, ASSET_KEYS.LOADING_FRAME);
		this.scene = scene
		this.initialY = y;
		this.loadType = loadType;
		this.nextScene = nextScene;

		this.setInteractive(); // block accept/reject inputs

		this.timer = this.scene.time.addEvent({
			delay: this.DURATION,
			callback: this.onTimerComplete,
			callbackScope: this
		});
	}

	update() {
		const progress = 1 - this.timer.getRemaining() / this.DURATION
		if (this.loadType == "in") {
			this.y = this.initialY - this.MAX_DISPLACEMENT * easeInCubic(1 - progress);
		}
		else if (this.loadType == "out") {
			this.y = this.initialY - this.MAX_DISPLACEMENT * easeInCubic(progress);
		}
	}

	onTimerComplete() {
		const index = this.scene.objects.indexOf(this);
		this.scene.objects.splice(index, 1);

		if (this.loadType == "in") {
			this.scene.scene.start(this.nextScene);
		}
		else {
			this.destroy();
		}
	}
}