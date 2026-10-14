import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { IMAGE_ASSETS, TEXTURE_ATLAS_ASSETS } from '../common/assets.js';

export class PreloadScene extends Phaser.Scene {

  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    });
  }

  preload() {
    IMAGE_ASSETS.forEach((asset) => {
      this.load.image(asset.assetKey, asset.path);
    });
    TEXTURE_ATLAS_ASSETS.forEach((asset) => {
      this.load.atlas(asset.assetKey, asset.textureURL, asset.atlasURL);
    });
    this.load.font("AlteHaasGroteskBold", "assets/fonts/AlteHaasGroteskBold.ttf", "truetype");
    this.load.font("PressStart2P", "assets/fonts/PressStart2P.ttf", "truetype");
    this.load.font("Tengoku", "assets/fonts/Tengoku.ttf", "truetype");
  }

  create() {
    this.scene.start(SCENE_KEYS.GAME_SCENE);
  }
}
