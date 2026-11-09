import React from 'react';
import { GoldText, Txt } from './GoldText';
import { QrBlock } from './QrBlock';
import { Rule } from './Rule';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { FONT_SERIF, type Theme } from '../theme';
import type { HebaoProps } from '../data/types';

/**
 * 仪式类定版 —— honor / battle / scroll / medal / silk 五套共用。
 *
 * 与原版 EndCard 的差别：仪式类模板的定版是「圆章徽标 + 公司全称 + 巨字 + 副题
 * + 短金线 + 二维码 + 日期 + 合规小字」的固定堆叠，且每套的纵坐标都是手调过的
 * （qr 尺寸 186/220、日期 1560~1602 各不相同）。这里全部改为显式传入，
 * 只把「时间轴」抽成以 L 为基准的固定偏移 —— 五套模板的时间差正好是这个结构。
 *
 * 偏移表（L = 徽标入场起点）：
 *   徽标 L→L+0.34   公司 L+0.10→L+0.36   主标题 L+0.16→L+0.66   副题 L+0.44→L+0.72
 *   金线 L+0.54→L+0.82   二维码 L+0.60→L+0.94   扫码语 L+0.74→L+1.00
 *   日期 L+0.88→L+1.14   小字 L+0.98→L+1.24
 */
export const CeremonyEnd: React.FC<{
  theme: Theme;
  t: number;
  p: HebaoProps;
  /** 徽标入场起点 */
  L: number;
  logo: { left?: number; top: number; size: number; fontSize: number };
  company?: string;
  companyTop: number;
  companySize?: number;
  /** 徽标与公司名排成一行（silk） */
  inlineRow?: boolean;
  title: { top: number; size: number; lineHeight: number; letterSpacing: number };
  /** 主标题字数自适应字号：[≤4 字, 5 字, ≥6 字] */
  titleSizes?: [number, number, number];
  /** 主标题字距从 44 收拢到目标值（honor 独有） */
  titleTrack?: boolean;
  sub: { top: number; size: number };
  line: { top: number; width: number };
  qr: { top: number; size: number };
  capTop: number;
  dateTop: number;
  noteTop: number;
}> = ({
  theme: T,
  t,
  p,
  L,
  logo,
  company = '泰康养老保险股份有限公司',
  companyTop,
  companySize = 30,
  inlineRow = false,
  title,
  titleSizes,
  titleTrack = false,
  sub,
  line,
  qr,
  capTop,
  dateTop,
  noteTop,
}) => {
  const logoP = outBack(seg(t, L, L + 0.34), 1.6);
  const logoOp = clamp01(seg(t, L, L + 0.19));
  const coP = outExpo(seg(t, L + 0.1, L + 0.36));
  const titleP = outExpo(seg(t, L + 0.16, L + 0.66));
  const subP = outExpo(seg(t, L + 0.44, L + 0.72));
  const lineP = outExpo(seg(t, L + 0.54, L + 0.82));
  const qrP = outBack(seg(t, L + 0.6, L + 0.94), 1.5);
  const capP = outExpo(seg(t, L + 0.74, L + 1.0));
  const dateP = outExpo(seg(t, L + 0.88, L + 1.14));
  const noteP = outExpo(seg(t, L + 0.98, L + 1.24));

  const titleText = p.slogan2 || '';
  const tl = Array.from(titleText).length;
  const tfs = titleSizes
    ? tl <= 4
      ? titleSizes[0]
      : tl === 5
      ? titleSizes[1]
      : titleSizes[2]
    : title.size;

  const logoCircle = (
    <div
      style={{
        width: logo.size,
        height: logo.size,
        borderRadius: '50%',
        border: `1.5px solid ${rgba(T.line, 0.75)}`,
        background: rgba(T.line, 0.12),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: inlineRow ? 1 : logoOp,
        transform: inlineRow ? undefined : `scale(${lerp(0.7, 1, logoP)})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontWeight: 600,
          fontSize: logo.fontSize,
          lineHeight: 1,
          color: T.bright,
        }}
      >
        {p.sealChar && p.sealChar !== '泰' ? p.sealChar : '泰'}
      </div>
    </div>
  );

  return (
    <>
      {inlineRow ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: logo.top,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 18,
            opacity: logoOp,
            transform: `translateY(${(1 - logoP) * -14}px)`,
          }}
        >
          {logoCircle}
          <Txt
            size={companySize}
            color={rgba(T.mist, 1)}
            weight={300}
            letterSpacing={6}
            lineHeight={Math.round(companySize * 1.4)}
            style={{ opacity: coP, transform: `translateY(${(1 - coP) * 16}px)` }}
          >
            {company}
          </Txt>
        </div>
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              left: logo.left ?? 490,
              top: logo.top,
              display: 'flex',
            }}
          >
            {logoCircle}
          </div>
          <Txt
            size={companySize}
            color={rgba(T.mist, 1)}
            weight={300}
            letterSpacing={6}
            lineHeight={Math.round(companySize * 1.4)}
            style={{
              position: 'absolute',
              left: 0,
              top: companyTop,
              width: 1080,
              textAlign: 'center',
              opacity: coP,
              transform: `translateY(${(1 - coP) * 16}px)`,
            }}
          >
            {company}
          </Txt>
        </>
      )}

      <GoldText
        theme={T}
        size={tfs}
        weight={700}
        letterSpacing={titleTrack ? lerp(44, title.letterSpacing, titleP) : title.letterSpacing}
        lineHeight={title.lineHeight}
        style={{
          position: 'absolute',
          left: 0,
          top: title.top,
          width: 1080,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          opacity: titleP,
          transform: `translateY(${(1 - titleP) * 40}px)`,
        }}
      >
        {titleText}
      </GoldText>

      <Txt
        size={sub.size}
        color={T.cream2}
        weight={300}
        font="serif"
        letterSpacing={6}
        lineHeight={Math.round(sub.size * 1.4)}
        style={{
          position: 'absolute',
          left: 0,
          top: sub.top,
          width: 1080,
          textAlign: 'center',
          opacity: subP,
          transform: `translateY(${(1 - subP) * 22}px)`,
        }}
      >
        {p.endsub}
      </Txt>

      <Rule
        theme={T}
        t={t}
        start={L + 0.54}
        dur={0.28}
        left={540 - line.width / 2}
        top={line.top}
        width={line.width}
        opacity={0.6}
        solid
        color={T.line}
      />

      <QrBlock
        theme={T}
        left={540 - qr.size / 2}
        top={qr.top}
        size={qr.size}
        radius={qr.size < 200 ? 10 : 12}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, L + 0.6, L + 0.76)),
          transform: `scale(${lerp(0.86, 1, qrP)})`,
        }}
      />

      <Txt
        size={32}
        color={rgba(T.soft, 0.9)}
        weight={500}
        letterSpacing={6}
        lineHeight={45}
        style={{
          position: 'absolute',
          left: 0,
          top: capTop,
          width: 1080,
          textAlign: 'center',
          opacity: capP,
          transform: `translateY(${(1 - capP) * 18}px)`,
        }}
      >
        {p.qrCap}
      </Txt>

      <Txt
        size={30}
        color={rgba(T.mist, 1)}
        weight={300}
        letterSpacing={8}
        lineHeight={42}
        style={{
          position: 'absolute',
          left: 0,
          top: dateTop,
          width: 1080,
          textAlign: 'center',
          opacity: dateP,
          transform: `translateY(${(1 - dateP) * 16}px)`,
        }}
      >
        {p.dateText}
      </Txt>

      <Txt
        size={28}
        color={rgba(T.mist, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={39}
        style={{
          position: 'absolute',
          left: 0,
          top: noteTop,
          width: 1080,
          textAlign: 'center',
          opacity: noteP,
          transform: `translateY(${(1 - noteP) * 16}px)`,
        }}
      >
        {p.note}
      </Txt>
    </>
  );
};
