import { ASSET_KEYS } from './assets.js';


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


export class RedFlash extends Phaser.GameObjects.Container {
	MAX_TIME = 1 * 1000;

	constructor(scene, x, y) {
		super(scene, x, y);
		this.scene = scene;

		this.spriteObject = scene.add.image(0, 0, ASSET_KEYS.RED_FLASH);

		this.textObject = scene.add.text(
			0, 
			0, 
			"INCORRECT", 
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