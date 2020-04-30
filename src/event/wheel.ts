import EE from '@antv/event-emitter';
import { IElement } from '@antv/g-base';
import * as d3Ease from 'd3-ease';
import { GestureEvent } from '../gestures/gesture';
import { GM } from '../gm';
import { clock } from '../utils/clock';
import { Event } from './event';

// 看那个曲线跟合适了
const ease = d3Ease.easeCubicIn;

const TOTAL_MS = 800; // 惯性滚动时间；调参工程师，或者根据速度来计算这个时间

const SWIPE = 'swipe';
const PAN = 'pan';
const WHEEL = 'wheel';

/**
 * 给 view 添加移动端的滚动能力：
 *  - 监听 touch 事件，emit wheel 事件
 *  - 滚动惯性包装
 *  - 和 pc 的 wheel 事件保持基本一致
 */
export class Wheel extends EE implements Event {
  // 监听的 G element
  private element: IElement;

  private gm: GM;

  private raf;
  private rafMs: number = 0;

  // 最后一次 move 的时间
  private ms: number;

  constructor(element: IElement) {
    super();
    this.element = element;

    this.gm = new GM(element, { gestures: ['Pan', 'Swipe'] });

    this.gm.on(SWIPE, this.onSwipe);
    this.gm.on(PAN, this.onPan);
  }

  public destroy() {
    window.cancelAnimationFrame(this.raf);

    this.gm.destroy();

    this.off();
  }

  /**
   * pan 事件
   * @param ev
   */
  private onPan = (ev: GestureEvent) => {
    const { deltaX, deltaY } = ev;

    const e = this.getWrapperEvent(ev, deltaX, deltaY);

    this.emit(WHEEL, e);
  };

  /**
   * 当出现 swipe 事件的时候
   * @param ev
   */
  private onSwipe = (ev: GestureEvent) => {
    const { speedX, speedY } = ev;
    // raf 循环执行的时间戳
    this.rafMs = clock.now();
    this.ms = this.rafMs;

    // 对于没有滑动的情况下，不做处理
    if (speedX !== 0 || speedY !== 0) {
      this.rafInertia(ev);
    }
  };

  // 使用 raf 进行惯性滑动
  private rafInertia(ev) {
    const { speedX, speedY } = ev;

    this.raf = window.requestAnimationFrame(() => {
      const now = clock.now();

      let ratio = (now - this.ms) / TOTAL_MS;
      if (ratio < 1) {
        ratio = ease(1 - ratio);
        // 折损之后的速度 * 时间，等于距离
        const t = now - this.rafMs;
        const movedX = speedX * ratio * t;
        const movedY = speedY * ratio * t;

        const e = this.getWrapperEvent(ev, movedX, movedY);

        // 发出 wheel 事件
        this.emit(WHEEL, e);

        this.rafMs = now; // 记录时间

        // 进行下一次
        this.rafInertia(ev);
      }
    });
  }

  private getWrapperEvent(ev, deltaX: number, deltaY: number) {
    // 移动端的滑动应该是跟随手指
    return { ...ev, deltaX: -deltaX, deltaY: -deltaY };
  }
}
