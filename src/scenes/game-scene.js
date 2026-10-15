import { Item, AcceptButton, RejectButton, Flash } from '../common/custom-objects.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';
import { RuleList } from '../common/rulelist.js';

export class GameScene extends Phaser.Scene {
  MAX_TIME = 100 * 1000
  TIME_PENALTY = 10 * 1000;
  TIME_REWARD = 15 * 1000;

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
    this.objects = [];

    this.ruleList = new RuleList();
    this.ruleList.addRule();

    this.itemIndex = 0;
    this.createNewItem();

    this.add.image(0, 0, ASSET_KEYS.BACKGROUND).setOrigin(0);
    
    this.currentItemObject = new Item(this, this.scale.width / 4, this.scale.height / 2, this.color, this.number, this.letter).setDepth(0);
    this.add.existing(this.currentItemObject);
    this.objects.push(this.currentItemObject);

    this.acceptButtonObject = new AcceptButton(this, 468, 624).setDepth(0);
    this.add.existing(this.acceptButtonObject);
    this.objects.push(this.acceptButtonObject);

    this.rejectButtonObject = new RejectButton(this, 172, 624).setDepth(0);
    this.add.existing(this.rejectButtonObject);
    this.objects.push(this.rejectButtonObject);

    this.add.text(
      this.scale.width / 2 + 32, 
      32, 
      this.ruleList.text, 
      {
        fontFamily: "Tengoku", 
        fontSize:24, color: "#0E0F23", 
        wordWrap: {
          width: this.scale.width / 2 - 50,
        },
      },
    ).setDepth(0);;

    this.timer = this.time.addEvent({
        delay: this.MAX_TIME,
        // callback: this.onTimerComplete,
        // callbackScope: this
    });
    this.timerTextObject = this.add.text(64, 32, this.timer.getRemainingSeconds(), {fontFamily: "Tengoku", fontSize:48, color: "#0E0F23"});
    
    this.score = 0;
    this.scoreTextObject =  this.add.text(576, 32, this.score, {fontFamily: "Tengoku", fontSize:48, color: "#0E0F23", align: "right"}).setOrigin(1, 0);

    this.progressBarObject = this.add.image(this.scale.width / 4 - 512 / 2, 96, ASSET_KEYS.PROGRESS_BAR).setOrigin(0);

    this.itemIndexTextObject = this.add.text(this.scale.width / 4, 176, `Item #${this.itemIndex}`, {fontFamily: "Tengoku", fontSize:36  , color: "#86615C"}).setOrigin(0.5);
  }

  update(time, delta) {
    this.objects.forEach(object => {
      if (typeof object.update == 'function') {
        object.update(time, delta);
      }
    })
    const remainingTime = this.timer.getRemaining();
    this.timerTextObject.text = (remainingTime / 1000).toFixed(1);
    this.progressBarObject.setScale(1 * remainingTime / this.MAX_TIME, 1);
  }

  evaluate(answer) {
    if (answer == this.correctAction) {
      this.score += 10;
      this.scoreTextObject.text = this.score;

      this.timer.reset({
          delay: Math.min(this.timer.getRemaining() + this.TIME_REWARD, this.MAX_TIME),
      });

      this.createNewItem();
    } else {
      const flash = new Flash(this, this.scale.width / 4, this.scale.height / 2, "wrong").setDepth(1);;
      this.add.existing(flash);
      this.objects.push(flash);

      this.timer.reset({
          delay: this.timer.getRemaining() - this.TIME_PENALTY,
      });

      this.createNewItem();
    }
  }

  createNewItem() {
    if (typeof this.currentItemObject != "undefined") {
      this.currentItemObject.destroy();
    }
    const index = this.objects.indexOf(this.currentItemObject);
    this.objects.splice(index, 1);

    this.itemIndex += 1;
    if (typeof this.itemIndexTextObject != "undefined") {
      this.itemIndexTextObject.destroy();
    }
    this.itemIndexTextObject = this.add.text(this.scale.width / 4, 176, `Item #${this.itemIndex}`, {fontFamily: "Tengoku", fontSize:36  , color: "#86615C"}).setOrigin(0.5);

    const prefix = Phaser.Utils.Array.GetRandom(["dark", "light"]);
    const suffix = Phaser.Utils.Array.GetRandom(["Red", "Green", "Blue"]);
    this.color = prefix + suffix;
    this.number = Phaser.Math.Between(0, 9);
    this.letter = Phaser.Utils.Array.GetRandom(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);

    this.correctAction = this.ruleList.getCorrectAction(this.color, this.number, this.letter);

    this.currentItemObject = new Item(this, this.scale.width / 4, this.scale.height / 2, this.color, this.number, this.letter)
    this.add.existing(this.currentItemObject);
    this.objects.push(this.currentItemObject);
  }
}
