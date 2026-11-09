import { useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 把帧号换算成「秒」，与 HTML 版 render(t) 的 t 完全等价。
 * 241 帧 @30fps → t 从 0 到 8.000，与原模板时间轴一一对应。
 */
export const useT = (): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** 总时长（秒） */
export const useDuration = (): number => {
  const { durationInFrames, fps } = useVideoConfig();
  return durationInFrames / fps;
};
