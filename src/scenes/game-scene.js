import Phaser from '../lib/phaser.js';
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
    const prefix = Phaser.Utils.Array.GetRandom(["dark", "light"]);
    const suffix = Phaser.Utils.Array.GetRandom(["Red", "Green", "Blue"]);
    this.color = prefix + suffix;
    this.number = Phaser.Math.Between(0, 9);
    this.letter = Phaser.Utils.Array.GetRandom(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);
    
    console.log(this.color, this.number, this.letter);
    const ruleList = new RuleList();
    ruleList.addRule();
    ruleList.addRule();
    ruleList.printRules();
    console.log(ruleList.getCorrectAction(this.color, this.number, this.letter))

    this.add.image(0, 0, ASSET_KEYS.BACKGROUND).setOrigin(0);
    this.add.image(this.scale.width / 4, this.scale.height / 2, ASSET_KEYS.SQUARES, this.color);

    let textColor;
    if (this.color.startsWith("dark")) {
      textColor = "#FFFFFF"
    }
    else {
      textColor = "#0E0F23"
    }

    this.add.text(this.scale.width / 4, this.scale.height / 2, `${this.number}${this.letter.toUpperCase()}`, {fontFamily: "Tengoku", fontSize:120, color: textColor}).setOrigin(0.5);
    this.add.text(
      this.scale.width / 2 + 25, 25, ruleList.text, 
      {
        fontFamily: "Tengoku", 
        fontSize:24, color: "#0E0F23", 
        wordWrap: {
          width: this.scale.width / 2 - 50,
        }
      }
    );

    const helloButton = this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
    helloButton.setInteractive();

    helloButton.on('pointerover', () => { console.log('pointerover'); });
  }

  // update(time, delta) {

  // }
}
