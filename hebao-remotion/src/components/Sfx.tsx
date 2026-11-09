import React from 'react';
import { Audio, Sequence, staticFile, useVideoConfig } from 'remotion';

/**
 * 关键帧音效：在指定秒数触发一次短音效。
 * 音源在 public/assets/sfx/（全部由 tools/gen_sfx.js 纯代码合成，与底乐同一音色世界）。
 * 用法：<Sfx name="sfx_stamp" at={1.78} vol={0.5} />
 */
export const Sfx: React.FC<{
  /** 文件名（不带扩展名），对应 public/assets/sfx/{name}.wav */
  name: string;
  /** 触发时刻（秒） */
  at: number;
  /** 音量 0~1，默认 0.5 */
  vol?: number;
}> = ({ name, at, vol = 0.5 }) => {
  const { fps } = useVideoConfig();
  const from = Math.max(0, Math.round(at * fps));
  return (
    <Sequence from={from} durationInFrames={Math.ceil(fps * 2.2)} name={`sfx:${name}`}>
      <Audio src={staticFile(`assets/sfx/${name}.wav`)} volume={vol} />
    </Sequence>
  );
};
