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
    this.load.font("Tengoku", "assets/fonts/Tengoku.ttf", "truetype");
    this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
  }

  create() {
    // this.scene.start(SCENE_KEYS.LOSE_SCENE);
    this.scene.start(SCENE_KEYS.MAIN_SCENE);
  }
}
