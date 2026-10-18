import { RestartButton } from '../common/custom-objects.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

export class LoseScene extends Phaser.Scene {
  constructor() {
	super({
	  key: SCENE_KEYS.LOSE_SCENE,
	});
  }

  init({score = 0, corrects = 0, wrongs = 0}) {
	this.score = score;
	this.corrects = corrects;
	this.wrongs = wrongs;
  }

  /**
   * @public
   * Tied to the Phaser Scene lifecycle. Will run one time after the PRELOAD
   * logic is finished. Runs each time the Phaser Scene restarts.
   * @returns {void}
   */
  create() {
	this.add.image(this.scale.width / 2, this.scale.height / 4, ASSET_KEYS.EMPTY_BACKGROUND).setScale(2);

	const line1TextObject = this.add.text(
		this.scale.width / 2, 
		32, 
		"--------------------", 
		{
			fontFamily: "Tengoku", 
			fontSize:60, color: "#4F6D7A", 
			align: "center",
		},
	).setOrigin(0.5, 0);

	const youLostTextObject = this.add.text(
		this.scale.width / 2, 
		line1TextObject.y + line1TextObject.displayHeight + 8, 
		"GAME OVER", 
		{
			fontFamily: "Tengoku", 
			fontSize:120, color: "#17183B", 
			align: "center",
		},
	).setOrigin(0.5, 0);

	const line2TextObject = this.add.text(
		this.scale.width / 2, 
		youLostTextObject.y + youLostTextObject.displayHeight + 8, 
		"--------------------", 
		{
			fontFamily: "Tengoku", 
			fontSize:60, color: "#4F6D7A", 
		},
	).setOrigin(0.5, 0);

	const statsTextObject = this.add.rexBBCodeText(
		this.scale.width / 2, 
		line2TextObject.y + line2TextObject.displayHeight + 16,
		`Your score is [color=#c3b51d]${this.score} points[/color]`
		+ `\nYou correctly rejected/accepted [color=green]${this.corrects} times[/color]`
		+ `\nYou incorrectly rejected/accepted [color=red]${this.wrongs} times[/color]`, 
		{
			fontFamily: "Tengoku", 
			fontSize:24, color: "#0E0F23", 
		},
	).setOrigin(0.5, 0);

	const restartButton = new RestartButton(this, this.scale.width / 2, statsTextObject.y + statsTextObject.displayHeight + 64);
	restartButton.y += restartButton.spriteObject.displayHeight / 2; // container has not setOrigin method
	this.add.existing(restartButton);
	this.objects = [restartButton];

	this.cameras.main.shake(500, 0.01)
  }

  update() {
	this.objects.forEach(object => object.update());
  }
}
