import React from 'react';
import { Chapter } from './Chapter';
import { GoldText, Txt } from './GoldText';
import { NumRoll } from './NumRoll';
import { PhotoCard } from './PhotoCard';
import { Sfx } from './Sfx';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import type { Theme } from '../theme';
import type { HebaoProps } from '../data/types';

/** 开场标语章：eyebrow + 金色大字（多套模板共用） */
export const SloganChapter: React.FC<{
  theme: Theme;
  t: number;
  slogan: string;
  eyebrow?: string;
  in: [number, number];
  out?: [number, number];
  eyebrowTop?: number;
  sloganTop?: number;
  size?: number;
  scaleIn?: boolean;
}> = ({ theme, t, slogan, eyebrow, in: inR, out, eyebrowTop = 540, sloganTop = 620, size = 140, scaleIn = true }) => {
  const peb = outExpo(seg(t, inR[0] + 0.04, inR[0] + 0.3));
  const psg = outBack(seg(t, inR[0] + 0.18, inR[0] + 0.58), 1.8);
  return (
    <Chapter t={t} in={inR} out={out}>
      <Sfx name="sfx_chime" at={inR[0] + 0.44} vol={0.22} />
      {eyebrow && (
        <Txt
          size={26}
          color={rgba(theme.soft, 0.85)}
          weight={300}
          letterSpacing={14}
          lineHeight={36}
          style={{ position: 'absolute', top: eyebrowTop, width: 1080, textAlign: 'center', opacity: peb }}
        >
          {eyebrow}
        </Txt>
      )}
      <GoldText
        theme={theme}
        size={size}
        weight={700}
        letterSpacing={24}
        lineHeight={Math.round(size * 1.36)}
        font="serif"
        style={{
          position: 'absolute',
          top: sloganTop,
          width: 1080,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          opacity: clamp01(seg(t, inR[0] + 0.18, inR[0] + 0.42)),
          transform: scaleIn ? `scale(${lerp(1.3, 1, psg)})` : undefined,
        }}
      >
        {slogan}
      </GoldText>
    </Chapter>
  );
};

/** 核心数字章：dlabel + 大滚数 + delta（quote/radar/checklist 等共用） */
export const NumChapter: React.FC<{
  theme: Theme;
  t: number;
  p: HebaoProps;
  in: [number, number];
  out?: [number, number];
  numSize?: number;
  labelTop?: number;
  numTop?: number;
  deltaTop?: number;
  numStart?: number;
  numDur?: number;
}> = ({ theme, t, p, in: inR, out, numSize = 276, labelTop = 560, numTop = 648, deltaTop = 1030, numStart, numDur = 1.08 }) => {
  const c0 = inR[0];
  const ns = numStart ?? c0 + 0.12;
  const pl = outExpo(seg(t, c0 + 0.06, c0 + 0.3));
  const pd = outExpo(seg(t, c0 + 1.0, c0 + 1.26));
  return (
    <Chapter t={t} in={inR} out={out}>
      <Sfx name="sfx_whoosh" at={ns} vol={0.18} />
      <Sfx name="sfx_pop" at={ns + 0.84} vol={0.3} />
      <Txt
        size={34}
        color={rgba(theme.soft, 0.85)}
        weight={300}
        letterSpacing={6}
        lineHeight={48}
        style={{
          position: 'absolute',
          top: labelTop,
          width: 1080,
          textAlign: 'center',
          opacity: pl,
          transform: `translateY(${(1 - pl) * 18}px)`,
        }}
      >
        {p.dlabel}
      </Txt>
      <div
        style={{
          position: 'absolute',
          top: numTop,
          width: 1080,
          display: 'flex',
          justifyContent: 'center',
          opacity: outExpo(seg(t, ns + 0.06, ns + 0.32)),
        }}
      >
        <NumRoll
          theme={theme}
          target={p.premium}
          t={t}
          start={ns}
          dur={numDur}
          size={numSize}
          lineHeight={Math.round(numSize * 1.1)}
          unit="万元"
          unitSize={54}
          unitColor={rgba(theme.soft, 0.92)}
        />
      </div>
      <Txt
        size={29}
        color={rgba(theme.soft, 0.85)}
        letterSpacing={4}
        lineHeight={41}
        style={{
          position: 'absolute',
          top: deltaTop,
          width: 1080,
          textAlign: 'center',
          opacity: pd,
          transform: `translateY(${(1 - pd) * 18}px)`,
        }}
      >
        {p.delta}
      </Txt>
    </Chapter>
  );
};

/** 人物×核心数字章：左照片 + 右姓名/职务/胶囊 + 下方滚数（bars/calendar/total 等共用） */
export const PersonNumChapter: React.FC<{
  theme: Theme;
  t: number;
  p: HebaoProps;
  in: [number, number];
  out?: [number, number];
  unit?: string;
  numSize?: number;
}> = ({ theme, t, p, in: inR, out, unit = '万元', numSize = 150 }) => {
  const c0 = inR[0];
  const pp = outBack(seg(t, c0 + 0.06, c0 + 0.42), 1.4);
  const pn = outExpo(seg(t, c0 + 0.2, c0 + 0.52));
  const pr = outExpo(seg(t, c0 + 0.34, c0 + 0.64));
  const pm = outBack(seg(t, c0 + 0.46, c0 + 0.78), 1.5);
  const pl = outExpo(seg(t, c0 + 0.56, c0 + 0.8));
  const hasDec = p.premium % 1 !== 0;

  return (
    <Chapter t={t} in={inR} out={out}>
      <Sfx name="sfx_whoosh" at={c0 + 0.62} vol={0.18} />
      <Sfx name="sfx_pop" at={c0 + 1.46} vol={0.3} />
      <PhotoCard
        theme={theme}
        src={p.photo}
        left={150}
        top={510}
        width={300}
        height={390}
        style={{
          opacity: clamp01(seg(t, c0 + 0.06, c0 + 0.24)),
          transform: `scale(${lerp(0.92, 1, pp)})`,
        }}
      />
      <Txt
        size={64}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={8}
        lineHeight={92}
        style={{
          position: 'absolute',
          left: 520,
          top: 566,
          width: 430,
          opacity: pn,
          transform: `translateY(${(1 - pn) * 26}px)`,
        }}
      >
        {p.name}
      </Txt>
      <Txt
        size={28}
        color={rgba(theme.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={39}
        style={{ position: 'absolute', left: 522, top: 672, width: 430, opacity: pr }}
      >
        {p.role}
      </Txt>
      <div
        style={{
          position: 'absolute',
          left: 522,
          top: 728,
          height: 60,
          borderRadius: 30,
          padding: '0 34px',
          border: `1px solid ${rgba(theme.line, 0.5)}`,
          background: rgba(theme.line, 0.12),
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          opacity: clamp01(seg(t, c0 + 0.46, c0 + 0.62)),
          transform: `scale(${lerp(0.92, 1, pm)})`,
          transformOrigin: '0% 50%',
        }}
      >
        <Txt size={24} color={theme.bright} weight={500} letterSpacing={3} lineHeight={33}>
          {p.pill}
        </Txt>
      </div>
      <Txt
        size={30}
        color={rgba(theme.soft, 0.85)}
        weight={300}
        letterSpacing={6}
        lineHeight={42}
        style={{
          position: 'absolute',
          top: 972,
          width: 1080,
          textAlign: 'center',
          opacity: pl,
          transform: `translateY(${(1 - pl) * 18}px)`,
        }}
      >
        {p.dlabel}
      </Txt>
      <div
        style={{
          position: 'absolute',
          top: 1032,
          width: 1080,
          display: 'flex',
          justifyContent: 'center',
          opacity: outExpo(seg(t, c0 + 0.68, c0 + 0.94)),
        }}
      >
        <NumRoll
          theme={theme}
          target={p.premium}
          t={t}
          start={c0 + 0.62}
          dur={1.08}
          size={numSize}
          lineHeight={Math.round(numSize * 1.12)}
          unit={unit}
          unitSize={40}
          unitColor={rgba(theme.soft, 0.92)}
        />
      </div>
      <Txt
        size={27}
        color={rgba(theme.soft, 0.85)}
        letterSpacing={4}
        lineHeight={38}
        style={{
          position: 'absolute',
          top: 1236,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, c0 + 1.36, c0 + 1.62)),
          transform: `translateY(${(1 - outExpo(seg(t, c0 + 1.36, c0 + 1.62))) * 18}px)`,
        }}
      >
        {p.delta}
      </Txt>
    </Chapter>
  );
};
