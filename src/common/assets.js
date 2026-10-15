export const ASSET_KEYS = Object.freeze({
  SQUARES: 'SQUARES',
  BACKGROUND: 'BACKGROUND',
  PROGRESS_BAR: 'PROGRESS_BAR',
  REJECT_BUTTON: 'REJECT_BUTTON',
  ACCEPT_BUTTON: 'ACCEPT_BUTTON',
  RED_FLASH: 'RED_FLASH',
});

export const IMAGE_ASSETS = [
  {
    assetKey: ASSET_KEYS.BACKGROUND,
    path: 'assets/images/background.png',
  },
  {
    assetKey: ASSET_KEYS.PROGRESS_BAR,
    path: 'assets/images/progress_bar.png',
  },
  {
    assetKey: ASSET_KEYS.REJECT_BUTTON,
    path: 'assets/images/reject_button.png',
  },
  {
    assetKey: ASSET_KEYS.ACCEPT_BUTTON,
    path: 'assets/images/accept_button.png',
  },
  {
    assetKey: ASSET_KEYS.RED_FLASH,
    path: 'assets/images/red_flash.png',
  },
];

export const TEXTURE_ATLAS_ASSETS = [
  {
    assetKey: ASSET_KEYS.SQUARES,
    textureURL: 'assets/images/square_spritesheet.png',
    atlasURL: 'assets/images/square_spritesheet.json',
  },
];
