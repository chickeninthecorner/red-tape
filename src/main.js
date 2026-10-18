import Phaser from './lib/phaser.js';
import { SCENE_KEYS } from './common/scene-keys.js';
import { GameScene } from './scenes/game-scene.js';
import { PreloadScene } from './scenes/preload-scene.js';
import { LoseScene } from './scenes/lose-scene.js';
import { MainScene } from './scenes/main-scene.js';

/** @type {Phaser.Types.Core.GameConfig} */
const gameConfig = {
  type: Phaser.AUTO,
  pixelArt: false,
  title: 'Red Tape',
  scale: {
    parent: 'game-container',
    width: 1280,
    height: 720,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  backgroundColor: '#17183B',
  fps: {
        target: 60,
        forceSetTimeOut: true
  },
};

const game = new Phaser.Game(gameConfig);

game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
game.scene.add(SCENE_KEYS.GAME_SCENE, GameScene);
game.scene.add(SCENE_KEYS.LOSE_SCENE, LoseScene);
game.scene.add(SCENE_KEYS.MAIN_SCENE, MainScene);
game.scene.start(SCENE_KEYS.PRELOAD_SCENE);
