export type SkinTone = 'pale' | 'fair' | 'tan' | 'olive' | 'dark' | 'ebony';
export type EyeColor = 'blue' | 'green' | 'brown' | 'amber' | 'purple' | 'red';
export type HairStyle = 'steve_classic' | 'alex_ponytail' | 'curly_crop' | 'undercut' | 'hoodie' | 'none';
export type HairColor = 'brown' | 'black' | 'blonde' | 'ginger' | 'white' | 'cyan';
export type FacialHair = 'beard_full' | 'goatee' | 'mustache' | 'stubbled' | 'none';
export type Accessory = 'vr_headset' | 'pixel_glasses' | 'iron_helmet' | 'diamond_crown' | 'headphones' | 'none';
export type Outfit = 'tuxedo' | 'overalls' | 'hoodie_emerald' | 'diamond_chestplate' | 'netherite_armor' | 'flannel';
export type HeldItem = 'diamond_sword' | 'golden_apple' | 'totem_of_undying' | 'potion_healing' | 'redstone_torch' | 'none';

export interface AvatarComposition {
  skinTone: SkinTone;
  eyeColor: EyeColor;
  hairStyle: HairStyle;
  hairColor: HairColor;
  facialHair: FacialHair;
  accessory: Accessory;
  outfit: Outfit;
  heldItem: HeldItem;
}

export const DEFAULT_AVATAR: AvatarComposition = {
  skinTone: 'fair',
  eyeColor: 'blue',
  hairStyle: 'steve_classic',
  hairColor: 'brown',
  facialHair: 'beard_full',
  accessory: 'headphones',
  outfit: 'hoodie_emerald',
  heldItem: 'diamond_sword',
};
