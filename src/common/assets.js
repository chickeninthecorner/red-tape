export const ASSET_KEYS = Object.freeze({
  SQUARES: 'SQUARES',
  BACKGROUND: 'BACKGROUND',
});

export const IMAGE_ASSETS = [
  {
    assetKey: ASSET_KEYS.BACKGROUND,
    path: 'assets/images/background.png',
  },
];

export const TEXTURE_ATLAS_ASSETS = [
  {
    assetKey: ASSET_KEYS.SQUARES,
    textureURL: 'assets/images/square_spritesheet.png',
    atlasURL: 'assets/images/square_spritesheet.json',
  },
];
