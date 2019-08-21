/*
1. 按住 300ms
2. move 不超过 10ms
 */
import { Event } from '@antv/g';
import { clock } from '../utils/clock';
import { Gesture } from './gesture';

const TIME = 300;
const DISTANCE = 10;

export class Press extends Gesture {
  protected EVENT: string = 'press';

  private touchStartTime: number;
  private touchStartX: number;
  private touchStartY: number;
  private pressTimeout: number;

  protected onTouchCancel(ev) {
    this.clearTimeout();
  }

  protected onTouchEnd(ev) {
    this.clearTimeout();
  }

  protected onTouchMove(ev) {
    const { x, y } = ev;

    if (x - this.touchStartX > DISTANCE || y - this.touchStartY > DISTANCE) {
      this.clearTimeout();
    }
  }

  protected onTouchStart(ev) {
    this.clearTimeout();

    const { x, y } = ev;

    this.touchStartTime = clock.now();
    this.touchStartX = x;
    this.touchStartY = y;

    this.pressTimeout = window.setTimeout(() => {
      this.emit({ x, y });
    }, TIME);
  }

  private clearTimeout() {
    window.clearTimeout(this.pressTimeout);
  }
}
