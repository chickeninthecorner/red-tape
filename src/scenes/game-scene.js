import { Item, AcceptButton, RejectButton, Flash, RuleList } from '../common/custom-objects.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

export class GameScene extends Phaser.Scene {
  INITIAL_TIME = 50 * 1000;
  MAX_TIME = 100 * 1000
  TIME_PENALTY = 7.5 * 1000;
  TIME_REWARD = 7.5 * 1000;
  TIME_TO_SCORE_CONVERSION = 0.1 / 1000;
  MAX_RULES = 7;
  SCORE_TEXT_OBJECT_MAX_SCALE = 1.5;
  SCORE_TEXT_OBJECT_SCALE_LERP = 0.2;

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

    this.ruleListObject = new RuleList(this, this.scale.width / 2 + 48, 32).setDepth(1);
    this.ruleListObject.addRule();
    this.add.existing(this.ruleListObject);

    this.itemIndex = 0;
    this.itemIndexTextObject = this.add.text(this.scale.width / 4, 176, `Item #${this.itemIndex}`, {fontFamily: "Tengoku", fontSize:36  , color: "#86615C"}).setOrigin(0.5).setDepth(1);
    this.createNewItem();
    this.objects.push(this.ruleListObject);

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
    
    this.timer = this.time.addEvent({
        delay: this.INITIAL_TIME,
        // callback: this.onTimerComplete,
        // callbackScope: this
    });
    this.timerTextObject = this.add.text(64, 32, this.timer.getRemainingSeconds(), {fontFamily: "Tengoku", fontSize:48, color: "#0E0F23"});
    
    this.score = 0;
    this.corrects = 0;
    this.scoreTextObject =  this.add.text(576, 32, this.score, {fontFamily: "Tengoku", fontSize:48, color: "#0E0F23", align: "right"}).setOrigin(1, 1);
    this.scoreTextObject.y += this.scoreTextObject.displayHeight;

    this.progressBarObject = this.add.image(this.scale.width / 4 - 512 / 2, 96, ASSET_KEYS.PROGRESS_BAR).setOrigin(0);
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

    this.scoreTextObject.scale = this.scoreTextObject.scale - (this.scoreTextObject.scale - 1) * this.SCORE_TEXT_OBJECT_SCALE_LERP;
  }

  evaluate(answer) {
    if (answer == this.correctAction) {
      this.corrects += 1;

      if (this.corrects % 10 == 0) {
        if (this.ruleListObject.length == this.MAX_RULES) {
          this.ruleListObject.spliceRule(1);
          const flash = new Flash(this, this.scale.width / 4, this.scale.height / 2, "modifiedRules").setDepth(1);
          this.add.existing(flash);
          this.objects.push(flash);
        }
        else{
          const flash = new Flash(this, this.scale.width / 4, this.scale.height / 2, "newRule").setDepth(1);
          this.add.existing(flash);
          this.objects.push(flash);
        }

        this.ruleListObject.addRule();

      }

      const remainingTime = this.timer.getRemaining();
      const bonusScore = Math.max(0, Math.ceil((this.timer.getRemaining() + this.TIME_REWARD - this.MAX_TIME) * this.TIME_TO_SCORE_CONVERSION));

      this.score += 10 + bonusScore;
      this.scoreTextObject.text = this.score;

      this.timer.reset({
          delay: Math.min(remainingTime + this.TIME_REWARD, this.MAX_TIME),
      });

      this.createNewItem();
      
      this.scoreTextObject.scale = this.SCORE_TEXT_OBJECT_MAX_SCALE;
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
      const index = this.objects.indexOf(this.currentItemObject);
      this.objects.splice(index, 1)
    }

    this.itemIndex += 1;
    this.itemIndexTextObject.text = `Item #${this.itemIndex}`;

    const properties = this.ruleListObject.generateItemProperties();
    this.color = properties[0];
    this.number = properties[1];
    this.letter = properties[2];

    this.correctAction = this.ruleListObject.getCorrectAction(this.color, this.number, this.letter);

    this.currentItemObject = new Item(this, this.scale.width / 4, this.scale.height / 2, this.color, this.number, this.letter)
    this.add.existing(this.currentItemObject);
    this.objects.push(this.currentItemObject);
  }
}
