import { Gesture, GestureCtor } from './gesture';
import { Pan } from './pan';
import { Press } from './press';
import { Swipe } from './swipe';
import { Tap } from './tap';

const MAP = {
  Pan,
  Press,
  Swipe,
  Tap,
};

export const getGesture = (g: string): GestureCtor => MAP[g];

export { Gesture };
