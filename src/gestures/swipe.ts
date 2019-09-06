/*
划动
move 和 end 相差小于 100 ms
 */
import { Event } from '@antv/g';
import { clock } from '../utils/clock';
import { Gesture } from './gesture';

const SWIPE_TIME_GAP = 100;

export class Swipe extends Gesture {
  protected EVENT: string = 'swipe';

  // 最后一次 move 的事件，用于区分 swipe 和 pan
  private latestMoveTime: number = 0;

  // 最后交互的时间，用于计算速度
  private ms: number = 0;
  // 最后的 move 速度，用于touchend 之后做惯性
  private speedX: number = 0;
  private speedY: number = 0;
  // 最后 move 的 x，y 位置
  private preX: number = 0;
  private preY: number = 0;

  protected onTouchCancel(ev) {}

  protected onTouchEnd(ev: Event) {
    const speedX = this.speedX;
    const speedY = this.speedY;

    if (clock.now() - this.latestMoveTime < SWIPE_TIME_GAP) {
      const { x, y } = ev;

      // 抛出事件
      this.emit({ x, y, speedX, speedY, event: ev });
    }
  }

  protected onTouchMove(ev) {
    const { x, y } = ev;

    const ms = clock.now();
    // 1. 计算 wheel 偏移
    const deltaX = x - this.preX;
    const deltaY = y - this.preY;
    const deltaTime = ms - this.ms;

    // 2. 计算速度（简版吧）
    this.speedX = deltaX / deltaTime;
    this.speedY = deltaY / deltaTime;

    // 记录最后一次移动事件
    this.latestMoveTime = ms;
  }

  protected onTouchStart(ev) {
    const { x, y } = ev;

    // 初始化
    this.speedX = this.speedY = 0;
    this.preX = x;
    this.preY = y;
    this.ms = clock.now();
  }
}
