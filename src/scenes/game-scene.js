import { Item, AcceptButton, RejectButton, Flash, RuleList, LoadingFrame, MiniRestartButton } from '../common/custom-objects.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

export class GameScene extends Phaser.Scene {
  INITIAL_TIME = 60 * 1000;
  MAX_TIME = 60 * 1000
  TIME_PENALTY = 15 * 1000;
  TIME_REWARD = 10 * 1000;
  TIME_TO_SCORE_CONVERSION = 0.5 / 1000;
  MAX_RULES = 6;
  SCORE_TEXT_OBJECT_MAX_SCALE = 1.5;
  SCORE_TEXT_OBJECT_SCALE_LERP = 0.2;
  CORRECTS_NEEDED_PER_DIFFICULTY = 5;
  CORRECTS_NEEDED_PER_RULE = 5;
  objects;
  itemIndex;
  corrects;
  wrongs;
  score;
  loadingFrameObject;
  ruleListObject;
  itemIndexTextObject;
  acceptButtonObject;
  rejectButtonObject;
  timer;
  timerTextObject;
  scoreTextObject;
  progressBarObject;
  currentItemObject;

  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });
  }

  init() {
    this.objects = [];

    this.itemIndex = 0;

    this.corrects = 0;
    this.wrongs = 0;
    this.score = 0;
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

    this.add.image(this.scale.width / 2, this.scale.height / 2, ASSET_KEYS.BACKGROUND).setScale(2).setDepth(0);

    this.ruleListObject = new RuleList(this, this.scale.width / 2 + 32, 32).setDepth(2);
    this.ruleListObject.addRule();
    this.add.existing(this.ruleListObject);
    this.objects.push(this.ruleListObject);

    this.timer = this.time.addEvent({
        delay: this.INITIAL_TIME,
        paused: true,
        callback: this.onTimerComplete,
        callbackScope: this,
    });
    this.timerTextObject = this.add.text(64 + 256, 32, this.timer.getRemainingSeconds(), {fontFamily: "Tengoku", fontSize:48, color: "#0E0F23"}).setOrigin(0.5, 0);

    this.itemIndexTextObject = this.add.text(this.scale.width / 4, 176, `Item #${this.itemIndex}`, {fontFamily: "Tengoku", fontSize:36  , color: "#86615C"}).setOrigin(0.5).setDepth(1);
    this.createNewItem();

    this.acceptButtonObject = new AcceptButton(this, 468, 624).setDepth(2);
    this.add.existing(this.acceptButtonObject);
    this.objects.push(this.acceptButtonObject);

    this.rejectButtonObject = new RejectButton(this, 172, 624).setDepth(2);
    this.add.existing(this.rejectButtonObject);
    this.objects.push(this.rejectButtonObject);
    
    this.scoreTextObject =  this.add.text(576, 32 + 56, this.score, {fontFamily: "Tengoku", fontSize:36, color: "#0E0F23", align: "right"}).setOrigin(1, 1).setDepth(2);

    this.add.image(this.scale.width / 4 - 512 / 2, 96, ASSET_KEYS.PROGRESS_BAR_BACKGROUND).setOrigin(0).setDepth(2);
    this.progressBarObject = this.add.image(this.scale.width / 4 - 512 / 2, 96, ASSET_KEYS.PROGRESS_BAR).setOrigin(0).setDepth(2);

    this.miniRestartButtonObject = new MiniRestartButton(this, 64, 32, this.prepareRestart);
    this.add.existing(this.miniRestartButtonObject);
    this.objects.push(this.miniRestartButtonObject);
  }

  update() {
    this.objects.forEach(object => {
      if (typeof object.update == 'function') {
        object.update();
      }
    })
    const remainingTime = this.timer.getRemaining();
    let digits;
    if (remainingTime < this.TIME_PENALTY) {
      digits = 2;
    }
    else {
      digits = 1;
    }
    this.timerTextObject.text = (remainingTime / 1000).toFixed(digits);
    this.progressBarObject.setScale(1 * remainingTime / this.MAX_TIME, 1);

    this.scoreTextObject.scale = this.scoreTextObject.scale - (this.scoreTextObject.scale - 1) * this.SCORE_TEXT_OBJECT_SCALE_LERP;
  }

  evaluate(answer) {
    if (answer == this.correctAction) {
      this.corrects += 1;

      if (this.corrects % this.CORRECTS_NEEDED_PER_RULE == 0) {
        if (this.ruleListObject.ruleCount == this.MAX_RULES) {
          this.ruleListObject.spliceRule(1);
          const flash = new Flash(this, this.scale.width / 4, this.scale.height / 2, "modifiedRules").setDepth(3);
          this.add.existing(flash);
          this.objects.push(flash);
        }
        else{
          const flash = new Flash(this, this.scale.width / 4, this.scale.height / 2, "newRule").setDepth(3);
          this.add.existing(flash);
          this.objects.push(flash);
        }

        this.ruleListObject.addRule(this.corrects / this.CORRECTS_NEEDED_PER_DIFFICULTY);
      }
      
      let bonusScore;
      if (this.timer.paused)
      {
        this.timer.paused = false;
        bonusScore = 0;
      }
      else
      {
        
        const remainingTime = this.timer.getRemaining();
        bonusScore = Math.max(0, Math.ceil((remainingTime + this.TIME_REWARD - this.MAX_TIME) * this.TIME_TO_SCORE_CONVERSION));

        const newRemainingTime = Math.min(remainingTime + this.TIME_REWARD, this.MAX_TIME)
        this.timer.reset({
            delay: newRemainingTime,
            callback: this.onTimerComplete,
            callbackScope: this,
        });
      }

      this.score += 10 + bonusScore;
      this.scoreTextObject.text = this.score;

      this.createNewItem();
      
      this.scoreTextObject.scale = this.SCORE_TEXT_OBJECT_MAX_SCALE;
    } 
    else {
      if (!this.timer.paused)
      {
        this.wrongs += 1;

        const newRemainingTime = this.timer.getRemaining() - this.TIME_PENALTY;

        if (newRemainingTime <= 0) { // instantly transition if not any time left
          this.onTimerComplete();
        }
        else {
              this.timer.reset({
              delay: newRemainingTime,
              callback: this.onTimerComplete,
              callbackScope: this,
            });
        }
      }

      const flash = new Flash(this, this.scale.width / 4, this.scale.height / 2, "wrong").setDepth(3);
      this.add.existing(flash);
      this.objects.push(flash);

      this.cameras.main.shake(500, 0.005);

      this.createNewItem();
    }
  }

  createNewItem() {
    if (this.itemIndex > 0) {
      this.currentItemObject.prepareDestroy();
      const index = this.objects.indexOf(this.currentItemObject);
      this.objects.splice(index, 1);
    }

    this.itemIndex += 1;
    this.itemIndexTextObject.text = `Item #${this.itemIndex}`;

    const properties = this.ruleListObject.generateItemProperties();
    this.color = properties[0];
    this.number = properties[1];
    this.letter = properties[2];

    this.correctAction = this.ruleListObject.getCorrectAction(this.color, this.number, this.letter);

    this.currentItemObject = new Item(this, this.scale.width / 4, this.scale.height / 2, this.color, this.number, this.letter).setDepth(1);
    this.add.existing(this.currentItemObject);
    this.objects.push(this.currentItemObject);
  }

  onTimerComplete() {
    this.scene.start(SCENE_KEYS.LOSE_SCENE, {score: this.score, corrects: this.corrects, wrongs: this.wrongs});
  }

  prepareRestart() {
    this.loadingFrameObject = new LoadingFrame(this, this.scale.width / 2, this.scale.height / 2, "in", SCENE_KEYS.GAME_SCENE).setDepth(99);
    this.add.existing(this.loadingFrameObject);
    this.objects.push(this.loadingFrameObject);
  }
}
