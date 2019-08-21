// 时钟
export const clock = typeof performance === 'object' && performance.now ? performance : Date;
