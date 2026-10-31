import { GenericButton, LoadingFrame } from '../common/custom-objects.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

export class MainScene extends Phaser.Scene {
	score;
	corrects;
	wrongs;
	objects;

  constructor() {
	super({
	  key: SCENE_KEYS.MAIN_SCENE,
	});
  }

  init() {
	this.objects = [];
  }

  /**
   * @public
   * Tied to the Phaser Scene lifecycle. Will run one time after the PRELOAD
   * logic is finished. Runs each time the Phaser Scene restarts.
   * @returns {void}
   */
  create() {
	this.loadingFrameObject = new LoadingFrame(this, this.scale.width / 2, this.scale.height / 2, "out").setDepth(99);
    this.add.existing(this.loadingFrameObject);
    this.objects.push(this.loadingFrameObject);
	
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
		"RED TAPE", 
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

	const authorTextObject = this.add.rexBBCodeText(
		this.scale.width / 2, 
		line2TextObject.y + line2TextObject.displayHeight + 16,
		"By chickeninthecorner", 
		{
			fontFamily: "Tengoku", 
			fontSize:24, color: "#0E0F23", 
		},
	).setOrigin(0.5, 0);

	const playButton = new GenericButton(
		this, 
		this.scale.width * 2 / 5, 
		authorTextObject.y + authorTextObject.displayHeight + 64,
		"Start",
		this.prepareStart
	);
	// container has not setOrigin method
	playButton.y += playButton.spriteObject.displayHeight / 2;
	playButton.x -= playButton.spriteObject.displayWidth / 2;
	this.add.existing(playButton);
	this.objects.push(playButton);

	const tutorialButton = new GenericButton(
		this, 
		this.scale.width * 4 / 5, 
		authorTextObject.y + authorTextObject.displayHeight + 64,
		"Tutorial",
		this.prepareTutorial
	);
	// container has not setOrigin method
	tutorialButton.y += tutorialButton.spriteObject.displayHeight / 2;
	tutorialButton.x -= tutorialButton.spriteObject.displayWidth / 2;
	this.add.existing(tutorialButton);
	this.objects.push(tutorialButton);
  }

  update() {
	this.objects.forEach(object => object.update());
  }

  prepareStart() {
	this.loadingFrameObject = new LoadingFrame(this, this.scale.width / 2, this.scale.height / 2, "in", SCENE_KEYS.GAME_SCENE).setDepth(99);
	this.add.existing(this.loadingFrameObject);
	this.objects.push(this.loadingFrameObject);
  }

  prepareTutorial() {
	this.loadingFrameObject = new LoadingFrame(this, this.scale.width / 2, this.scale.height / 2, "in", SCENE_KEYS.TUTORIAL_SCENE).setDepth(99);
	this.add.existing(this.loadingFrameObject);
	this.objects.push(this.loadingFrameObject);
  }
}
