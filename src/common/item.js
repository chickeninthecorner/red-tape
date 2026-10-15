import { ASSET_KEYS } from '../common/assets.js';

export class Item extends Phaser.GameObjects.Container {
	constructor(scene, x, y, color, number, letter) {
		super(scene, x, y);

		const sprite = scene.add.image(0, 0, ASSET_KEYS.SQUARES, scene.color);
		
		let textColor;
		if (color.startsWith("dark")) {
			textColor = "#FFFFFF";
			}
		else {
			textColor = "#0E0F23";
			}

		const text = scene.add.text(
			0, 
			0, 
			`${number}${letter.toUpperCase()}`, 
			{
			fontFamily: "Tengoku", 
			fontSize: 96, 
			color: textColor,
			}
		).setOrigin(0.5);

		this.add([sprite, text]);
	}
}