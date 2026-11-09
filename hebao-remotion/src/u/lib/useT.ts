import { useCurrentFrame, useVideoConfig } from 'remotion';

/** 帧 → 秒（全库时间轴统一按秒写，升帧率不影响节奏） */
export const useT = (): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

export const useTotal = (): number => {
  const { durationInFrames, fps } = useVideoConfig();
  return durationInFrames / fps;
};
