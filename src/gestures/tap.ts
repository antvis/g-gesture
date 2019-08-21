/*
一次点击，start 和 end 不能超过 2px，时间不超过 300ms
 */
import { Event } from '@antv/g';
import { clock } from '../utils/clock';
import { Gesture } from './gesture';

const TIME = 300;

const DISTANCE = 2;

export class Tap extends Gesture {
  protected EVENT: string = 'tap';

  private touchStartTime: number;
  private touchStartX: number;
  private touchStartY: number;

  protected onTouchCancel(ev) {}

  protected onTouchEnd(ev) {
    const { x, y } = ev;

    if (
      x - this.touchStartX < DISTANCE &&
      y - this.touchStartY < DISTANCE &&
      clock.now() - this.touchStartTime < TIME
    ) {
      this.emit({ x, y });
    }
  }

  protected onTouchMove(ev) {}

  protected onTouchStart(ev) {
    const { x, y } = ev;

    this.touchStartTime = clock.now();
    this.touchStartX = x;
    this.touchStartY = y;
  }
}
