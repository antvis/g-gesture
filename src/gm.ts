import EE from '@antv/event-emitter';
import { Element, Event } from '@antv/g';
import { Gesture, getGesture } from './gestures';
import { Options } from './interface';

/**
 * 给 view 添加移动端的滚动能力：
 *  - 监听 touch 事件，emit wheel 事件
 *  - 滚动惯性包装
 *  - 和 pc 的 wheel 事件保持基本一致
 */
export class GM extends EE {
  // 监听的 G element
  private element: Element;
  private options: Options;

  // 手势
  // private pan: Pan;
  // private press: Press;
  // private swipe: Swipe;
  // private tap: Tap;
  private gestures: Gesture[];

  constructor(element: Element, options: Options = {}) {
    super();
    this.element = element;
    this.options = options;

    this.initialGestures();

    this.bindTouchStart();
  }

  /**
   * 销毁，取消事件绑定
   */
  public destroy() {
    this.element.off('touchstart', this.onTouchStart);

    this.off();
  }

  /**
   * 实例化手势
   */
  private initialGestures() {
    const gestures = this.options.gestures || ['Pan', 'Press', 'Swipe', 'Tap'];

    this.gestures = gestures.map(
      (gesture: string): Gesture => {
        const Ctor = getGesture(gesture);
        return new Ctor(this);
      }
    );
  }

  /**
   * 绑定 touchstart 事件
   */
  private bindTouchStart() {
    this.element.on('touchstart', this.onTouchStart);
  }

  private preventEvent(ev: TouchEvent) {
    const { type } = ev;
    const prevents = this.options.prevents || [];

    if (prevents.includes(type)) {
      ev.preventDefault();
    }
  }

  /**
   * touchstart 触发
   * @param ev
   */
  private onTouchStart = (ev: Event) => {
    this.preventEvent(ev.event);

    this.element.on('touchmove', this.onTouchMove);
    this.element.on('touchend', this.onTouchEnd);
    this.element.on('touchcancel', this.onTouchCancel);

    this.emit('touchdown', ev);
    this.doGestures(ev);
  };

  /**
   * touchmove 触发
   * @param ev
   */
  private onTouchMove = (ev: Event) => {
    this.preventEvent(ev.event);

    this.emit('touchmove', ev);
    this.doGestures(ev);
  };

  /**
   * touchend 触发
   * @param ev
   */
  private onTouchEnd = (ev: Event) => {
    this.preventEvent(ev.event);

    this.emit('touchend', ev);

    this.element.off('touchmove', this.onTouchMove);
    this.element.off('touchend', this.onTouchEnd);
    this.element.off('touchcancel', this.onTouchCancel);

    this.doGestures(ev);
  };

  /**
   * touchcancel 触发
   * @param ev
   */
  private onTouchCancel = (ev: Event) => {
    this.preventEvent(ev.event);

    this.emit('touchcancel', ev);

    this.element.off('touchmove', this.onTouchMove);
    this.element.off('touchend', this.onTouchEnd);
    this.element.off('touchcancel', this.onTouchCancel);

    this.doGestures(ev);
  };

  private doGestures(ev: Event) {
    this.gestures.forEach((g: Gesture) => {
      g.do(ev);
    });
  }
}
