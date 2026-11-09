import React from 'react';
import { GoldText, Txt } from './GoldText';
import { QrBlock } from './QrBlock';
import { Rule } from './Rule';
import { Sfx } from './Sfx';
import { SplitReveal } from './SplitReveal';
import { DrawRect } from './DrawLine';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import type { Theme } from '../theme';
import type { HebaoProps } from '../data/types';

/**
 * 定版 —— 每套模板的最后 1.4 秒结构完全相同：
 * 主标题 → 副题 → 短金线 → 二维码 → 扫码语 → 日期 → 合规小字
 * 抽成组件后，各模板只需决定「定版从第几秒开始」和少量版式偏移。
 */
export const EndCard: React.FC<{
  theme: Theme;
  t: number;
  /** 定版起点（主标题入场开始） */
  start: number;
  p: HebaoProps;
  /** 主标题字号 */
  titleSize?: number;
  /** 副题字号 */
  subSize?: number;
  /** 二维码尺寸 */
  qrSize?: number;
  /** 二维码纵坐标 */
  qrTop?: number;
  /** 主标题纵坐标 */
  titleTop?: number;
  /** 显示短金线 */
  line?: boolean;
  /** 显示日期 */
  date?: boolean;
  /** 显示合规小字 */
  note?: boolean;
  /** 显示扫码语 */
  qrCap?: boolean;
  /** 定版整体纵向偏移 */
  offsetY?: number;
  titleLetterSpacing?: number;
  /** 覆盖主标题/副题（tenure 等模板定版文案与全局不同） */
  titleText?: string;
  subText?: string;
  /** 覆盖日期/合规小字纵坐标（letter 版等独立定版） */
  dateTop?: number;
  noteTop?: number;
  /* ── 定版动效（2026-11 起全库默认开启）── */
  /** 主标题逐字砸入（GSAP SplitText drop 手法），false 则整块入场 */
  splitTitle?: boolean;
  /** 短金线改为描线生长（GSAP DrawSVG 手法） */
  drawLine?: boolean;
}> = ({
  theme,
  t,
  start,
  p,
  titleSize = 150,
  subSize = 38,
  qrSize = 220,
  qrTop = 970,
  titleTop = 520,
  line = true,
  date = true,
  note = true,
  qrCap = true,
  offsetY = 0,
  titleLetterSpacing = 30,
  titleText,
  subText,
  dateTop,
  noteTop,
  splitTitle = true,
  drawLine = true,
}) => {
  const T = theme;
  const oy = offsetY;
  const titleP = outExpo(seg(t, start, start + 0.48));
  const subP = outExpo(seg(t, start + 0.34, start + 0.62));
  const lineP = outExpo(seg(t, start + 0.46, start + 0.74));
  const qrP = outBack(seg(t, start + 0.54, start + 0.88), 1.5);
  const capP = outExpo(seg(t, start + 0.68, start + 0.94));
  const dateP = outExpo(seg(t, start + 0.82, start + 1.08));
  const noteP = outExpo(seg(t, start + 0.94, start + 1.2));
  const titleStr = titleText ?? p.slogan2;

  return (
    <>
      {/* 定版入场 whoosh：主标题砸下的收束动作（与 Stage 扫光 shimmer 不同轨不重复） */}
      <Sfx name="sfx_whoosh" at={start} vol={0.28} />
      {splitTitle ? (
        <SplitReveal
          theme={T}
          t={t}
          text={titleStr}
          size={titleSize}
          top={titleTop + oy}
          start={start}
          mode="drop"
          staggerEach={0.06}
          dur={0.46}
          weight={700}
          letterSpacing={titleLetterSpacing}
          lineHeight={Math.round(titleSize * 1.33)}
        />
      ) : (
        <GoldText
          theme={T}
          size={titleSize}
          weight={700}
          letterSpacing={titleLetterSpacing}
          lineHeight={Math.round(titleSize * 1.33)}
          style={{
            position: 'absolute',
            top: titleTop + oy,
            width: 1080,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: titleP,
            transform: `translateY(${(1 - titleP) * 40}px)`,
          }}
        >
          {titleStr}
        </GoldText>
      )}

      <Txt
        size={subSize}
        color={T.cream2}
        weight={300}
        font="serif"
        letterSpacing={6}
        lineHeight={Math.round(subSize * 1.4)}
        style={{
          position: 'absolute',
          top: titleTop + 270 + oy,
          width: 1080,
          textAlign: 'center',
          opacity: subP,
          transform: `translateY(${(1 - subP) * 22}px)`,
        }}
      >
        {subText ?? p.endsub}
      </Txt>

      {line &&
        (drawLine ? (
          <DrawRect
            left={480}
            top={titleTop + 370 + oy}
            w={120}
            h={2}
            t={t}
            start={start + 0.46}
            dur={0.32}
            color={rgba(T.pale, 0.85)}
            strokeWidth={2}
            opacity={0.7}
          />
        ) : (
          <Rule
            theme={T}
            t={t}
            start={start + 0.46}
            dur={0.28}
            left={480}
            top={titleTop + 370 + oy}
            width={120}
          />
        ))}

      <QrBlock
        theme={T}
        left={540 - qrSize / 2}
        top={qrTop + oy}
        size={qrSize}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, start + 0.54, start + 0.7)),
          transform: `scale(${lerp(0.86, 1, qrP)})`,
        }}
      />

      {qrCap && (
        <Txt
          size={32}
          color={rgba(T.soft, 0.9)}
          weight={500}
          letterSpacing={6}
          lineHeight={45}
          style={{
            position: 'absolute',
            top: qrTop + 264 + oy,
            width: 1080,
            textAlign: 'center',
            opacity: capP,
            transform: `translateY(${(1 - capP) * 18}px)`,
          }}
        >
          {p.qrCap}
        </Txt>
      )}

      {date && (
        <Txt
          size={30}
          color={rgba(T.mist, 1)}
          weight={300}
          letterSpacing={8}
          lineHeight={42}
          style={{
            position: 'absolute',
            top: dateTop ?? titleTop + 1048 + oy,
            width: 1080,
            textAlign: 'center',
            opacity: dateP,
          }}
        >
          {p.dateText}
        </Txt>
      )}

      {note && (
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={4}
          lineHeight={36}
          style={{
            position: 'absolute',
            top: noteTop ?? titleTop + 1104 + oy,
            width: 1080,
            textAlign: 'center',
            opacity: noteP,
          }}
        >
          {p.note}
        </Txt>
      )}
    </>
  );
};

/** 荣誉标签胶囊 —— 人物章里的 MDRT / 星级会员 */
export const Pill: React.FC<{
  theme: Theme;
  text: string;
  top: number;
  p?: number;
  left?: number;
  width?: number;
  size?: number;
  minWidth?: number;
  height?: number;
  padX?: number;
}> = ({ theme, text, top, p = 1, left = 0, width = 1080, size = 27, minWidth = 400, height = 74, padX = 44 }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      display: 'flex',
      justifyContent: 'center',
      opacity: clamp01(p * 2.4),
    }}
  >
    <div
      style={{
        minWidth,
        height,
        borderRadius: height / 2,
        padding: `0 ${padX}px`,
        border: `1px solid ${rgba(theme.line, 0.5)}`,
        background: rgba(theme.line, 0.12),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        transform: `scale(${lerp(0.9, 1, p)})`,
      }}
    >
      <Txt size={size} color={theme.bright} weight={500} letterSpacing={3} lineHeight={38}>
        {text}
      </Txt>
    </div>
  </div>
);
