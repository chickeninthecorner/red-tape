import { Item } from '../common/custom-objects.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';
import { RuleList } from '../common/rulelist.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });
  }

  // init() {

  // }

  /**
   * @public
   * Tied to the Phaser Scene lifecycle. Will run one time after the PRELOAD
   * logic is finished. Runs each time the Phaser Scene restarts.
   * @returns {void}
   */
  create() {
    this.MAX_TIME = 100 * 1000;

    const ruleList = new RuleList();
    ruleList.addRule();
    ruleList.addRule();
    ruleList.printRules();

    this.add.image(0, 0, ASSET_KEYS.BACKGROUND).setOrigin(0);
    
    this.itemIndex = 1;
    const prefix = Phaser.Utils.Array.GetRandom(["dark", "light"]);
    const suffix = Phaser.Utils.Array.GetRandom(["Red", "Green", "Blue"]);
    this.color = prefix + suffix;
    this.number = Phaser.Math.Between(0, 9);
    this.letter = Phaser.Utils.Array.GetRandom(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);

    // let textColor;
    // if (this.color.startsWith("dark")) {
    //   textColor = "#FFFFFF"
    // }
    // else {
    //   textColor = "#0E0F23"
    // }

    // this.add.image(this.scale.width / 4, this.scale.height / 2, ASSET_KEYS.SQUARES, this.color);
    // this.add.text(
    //   this.scale.width / 4, 
    //   this.scale.height / 2, 
    //   `${this.number}${this.letter.toUpperCase()}`, 
    //   {
    //     fontFamily: "Tengoku", 
    //     fontSize: 96, 
    //     color: textColor,
    //   }
    // ).setOrigin(0.5);

    this.objects = [];
    
    this.currenItem = new Item(this, this.scale.width / 4, this.scale.height / 2, this.color, this.number, this.letter)
    this.add.existing(this.currenItem);
    this.objects.push(this.currenItem);

    this.add.text(
      this.scale.width / 2 + 32, 
      32, 
      ruleList.text, 
      {
        fontFamily: "Tengoku", 
        fontSize:24, color: "#0E0F23", 
        wordWrap: {
          width: this.scale.width / 2 - 50,
        },
      },
    );

    this.timer = this.time.addEvent({
        delay: this.MAX_TIME,
        // callback: this.onTimerComplete,
        // callbackScope: this
    });
    this.timerTextObject = this.add.text(this.scale.width / 4, 48, this.timer.getRemainingSeconds(), {fontFamily: "Tengoku", fontSize:48, color: "#0E0F23"}).setOrigin(0.5);
    this.progressBarObject = this.add.image(this.scale.width / 4 - 512 / 2, 96, ASSET_KEYS.PROGRESS_BAR).setOrigin(0);

    this.add.text(this.scale.width / 4, this.scale.height / 4, `Item #${this.itemIndex}`, {fontFamily: "Tengoku", fontSize:36  , color: "#86615C"}).setOrigin(0.5);

    // const helloButton = this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
    // helloButton.setInteractive();

    // helloButton.on('pointerover', () => { console.log('pointerover'); });
  }

  update(time, delta) {
    this.objects.forEach(object => {
      object.update(time, delta);
    })
    const remainingTime = this.timer.getRemaining();
    this.timerTextObject.text = (remainingTime / 1000).toFixed(1);
    this.progressBarObject.setScale(1 * remainingTime / this.MAX_TIME, 1);
  }
}
