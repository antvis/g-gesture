import { Event } from '@antv/g';
import { GM } from '../gm';

/**
 * 事件数据定义
 */
export interface GestureEvent {
  readonly event: Event;
  readonly x: number;
  readonly y: number;

  readonly deltaX?: number;
  readonly deltaY?: number;

  readonly clientX?: number;
  readonly clientY?: number;

  // 滚动
  readonly speedX?: number;
  readonly speedY?: number;
}

export type GestureCtor = new (cfg: any) => Gesture;

export abstract class Gesture {
  protected abstract EVENT = 'gesture';

  protected gm: GM;

  constructor(gm: GM) {
    this.gm = gm;
  }

  /**
   * 处理事件
   * @param ev
   */
  public do(ev: Event) {
    const { type } = ev;

    switch (type) {
      case 'touchstart':
        this.onTouchStart(ev);
        break;
      case 'touchmove':
        this.onTouchMove(ev);
        break;
      case 'touchend':
        this.onTouchEnd(ev);
        break;
      case 'touchcancel':
        this.onTouchCancel(ev);
        break;
      default:
        return;
    }
  }

  /**
   * 触发事件
   * @param e
   */
  protected emit(e: GestureEvent) {
    this.gm.emit(this.EVENT, e);
  }

  protected abstract onTouchStart(ev);
  protected abstract onTouchMove(ev);
  protected abstract onTouchEnd(ev);
  protected abstract onTouchCancel(ev);
}
