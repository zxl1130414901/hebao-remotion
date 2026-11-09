import React from 'react';
import { Chapter } from './Chapter';
import { Txt } from './GoldText';
import { PhotoCard } from './PhotoCard';
import { Pill } from './EndCard';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import type { Theme } from '../theme';
import type { HebaoProps } from '../data/types';

/**
 * 人物章 —— 十几套模板共用的「照片 + 姓名 + 职务 + 荣誉胶囊」结构。
 * 各模板只给章节区间，元素入场按章节起点 + 固定偏移推进，保证全库节奏一致。
 */
export const PersonChapter: React.FC<{
  theme: Theme;
  t: number;
  p: HebaoProps;
  in: [number, number];
  out?: [number, number];
  photoTop?: number;
  nameTop?: number;
  roleTop?: number;
  pillTop?: number;
  /** 照片入场方式：缩放弹出（默认）或上浮 */
  photoFx?: 'scale' | 'rise';
  hidePhoto?: boolean;
  /** 不显示荣誉胶囊（star 等模板用格言替代） */
  hidePill?: boolean;
  /** 额外元素（格言等），叠加在人物章之上 */
  children?: React.ReactNode;
}> = ({ theme, t, p, in: inR, out, photoTop = 200, nameTop = 600, roleTop = 800, pillTop = 912, photoFx = 'scale', hidePhoto, hidePill, children }) => {
  const c0 = inR[0];
  const photoP = outBack(seg(t, c0 + 0.04, c0 + 0.4), 1.4);
  const nameP = outExpo(seg(t, c0 + 0.18, c0 + 0.5));
  const roleP = outExpo(seg(t, c0 + 0.38, c0 + 0.66));
  const pillP = outBack(seg(t, c0 + 0.58, c0 + 0.9), 1.5);

  return (
    <Chapter t={t} in={inR} out={out}>
      {!hidePhoto && (
        <PhotoCard
          theme={theme}
          src={p.photo}
          left={400}
          top={photoTop}
          width={280}
          height={360}
          style={{
            opacity: clamp01(seg(t, c0 + 0.04, c0 + 0.22)),
            transform:
              photoFx === 'scale'
                ? `scale(${lerp(0.93, 1, photoP)})`
                : `translateY(${(1 - photoP) * 40}px)`,
          }}
        />
      )}
      <Txt
        size={110}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={16}
        lineHeight={150}
        style={{
          position: 'absolute',
          top: nameTop,
          width: 1080,
          textAlign: 'center',
          opacity: nameP,
          transform: `translateY(${(1 - nameP) * 32}px)`,
        }}
      >
        {p.name}
      </Txt>
      <Txt
        size={32}
        color={rgba(theme.soft, 0.88)}
        weight={300}
        letterSpacing={6}
        lineHeight={45}
        style={{
          position: 'absolute',
          top: roleTop,
          width: 1080,
          textAlign: 'center',
          opacity: roleP,
        }}
      >
        {p.role}
      </Txt>
      {!hidePill && <Pill theme={theme} text={p.pill} top={pillTop} p={pillP} />}
      {children}
    </Chapter>
  );
};
