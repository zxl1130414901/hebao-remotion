import { StampInk } from '../components/textures';
import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/** 结业考核科目（培训场景固定内容，开箱即用） */
const SUBJECTS = [
  { k: '保险基础知识', v: 96, g: 'A+' },
  { k: '产品条款与核保', v: 92, g: 'A' },
  { k: '客户需求分析', v: 94, g: 'A+' },
  { k: '合规与销售行为', v: 98, g: 'A+' },
];

/**
 * 65 · 结业通关版
 * 叙事：培训抬头 → 四科成绩逐行上分 → 总分与「结业」大章 → 人 → 定版
 * 与旧模板差异：完全不是业绩模板 —— 主角是「学会了什么」，用于新人培训结业。
 */
export const Graduate: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const total = SUBJECTS.reduce((a, b) => a + b.v, 0);
  const stampP = outBack(seg(t, 1.9, 2.24), 2.4);

  return (
    <Stage theme={T} brand={p.brand} bottomtag="GRADUATION　·　CERTIFIED">
      {/* 01 成绩单 */}
      <Chapter t={t} in={[0.04, 0.34]} out={[2.6, 2.88]}>
        <Sfx name="sfx_stamp" at={2.14} vol={0.48} />
        <Txt
          size={23}
          color={rgba(T.mist, 0.85)}
          letterSpacing={9}
          lineHeight={33}
          style={{
            position: 'absolute',
            left: 0,
            top: 336,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          2026　第三期　新人特训营
        </Txt>
        <Txt
          size={62}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={10}
          lineHeight={84}
          style={{
            position: 'absolute',
            left: 0,
            top: 380,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.12, 0.44)),
          }}
        >
          {p.slogan || '结业考核'}
        </Txt>

        {/* 表头 */}
        <div
          style={{
            position: 'absolute',
            left: 118,
            top: 520,
            width: 844,
            display: 'flex',
            alignItems: 'baseline',
            paddingBottom: 16,
            borderBottom: `1px solid ${rgba(T.line, 0.42)}`,
            opacity: outExpo(seg(t, 0.24, 0.54)),
          }}
        >
          <Txt size={24} color={rgba(T.mist, 0.85)} letterSpacing={6} lineHeight={34}>
            考核科目
          </Txt>
          <Txt
            size={24}
            color={rgba(T.mist, 0.85)}
            letterSpacing={6}
            lineHeight={34}
            style={{ marginLeft: 'auto', width: 130, textAlign: 'right' }}
          >
            成绩
          </Txt>
          <Txt
            size={24}
            color={rgba(T.mist, 0.85)}
            letterSpacing={6}
            lineHeight={34}
            style={{ width: 118, textAlign: 'right' }}
          >
            等级
          </Txt>
        </div>

        {SUBJECTS.map((s, i) => {
          const s0 = 0.4 + i * 0.24;
          const e = outExpo(seg(t, s0, s0 + 0.34));
          const score = Math.round(s.v * outExpo(seg(t, s0 + 0.06, s0 + 0.5)));
          return (
            <div
              key={s.k}
              style={{
                position: 'absolute',
                left: 118,
                top: 448 + i * 118,
                width: 844,
                display: 'flex',
                alignItems: 'baseline',
                paddingBottom: 22,
                borderBottom: `1px solid ${rgba(T.line, 0.16)}`,
                opacity: e,
                transform: `translateY(${(1 - e) * 22}px)`,
              }}
            >
              <Txt size={34} color={rgba(cream, 0.88)} letterSpacing={4} lineHeight={48}>
                {s.k}
              </Txt>
              <div
                style={{
                  marginLeft: 'auto',
                  width: 130,
                  textAlign: 'right',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'baseline',
                  gap: 6,
                }}
              >
                <GoldText theme={T} size={54} weight={700} font="num" lineHeight={68}>
                  {score}
                </GoldText>
                <Txt size={22} color={rgba(T.mist, 0.85)} font="num" lineHeight={32}>
                  /100
                </Txt>
              </div>
              <Txt
                size={40}
                color={rgba(gold, 0.92)}
                weight={700}
                font="num"
                letterSpacing={1}
                lineHeight={54}
                style={{ width: 118, textAlign: 'right' }}
              >
                {s.g}
              </Txt>
            </div>
          );
        })}

        {/* 总分 */}
        <div
          style={{
            position: 'absolute',
            left: 118,
            top: 1060,
            width: 844,
            display: 'flex',
            alignItems: 'baseline',
            opacity: outExpo(seg(t, 1.46, 1.76)),
            transform: `translateY(${(1 - outExpo(seg(t, 1.46, 1.8))) * 20}px)`,
          }}
        >
          <Txt size={30} color={rgba(T.mist, 0.85)} letterSpacing={8} lineHeight={42}>
            总　　分
          </Txt>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <GoldText theme={T} size={92} weight={700} font="num" lineHeight={112}>
              {total}
            </GoldText>
            <Txt size={26} color={rgba(T.mist, 0.85)} font="num" lineHeight={36}>
              /400
            </Txt>
          </div>
        </div>
        <Txt
          size={50}
          color={rgba(gold, 0.9)}
          weight={700}
          font="serif"
          letterSpacing={8}
          lineHeight={68}
          style={{
            position: 'absolute',
            left: 118,
            top: 1178,
            opacity: outExpo(seg(t, 1.66, 1.96)),
            transform: `translateY(${(1 - outExpo(seg(t, 1.66, 2.0))) * 18}px)`,
          }}
        >
          评定等级　优秀
        </Txt>

        {/* 结业大章 */}
        <div
          style={{
            position: 'absolute',
            left: 724,
            top: 1142,
            width: 238,
            height: 238,
            borderRadius: '50%',
            border: `6px solid ${rgba(gold, 0.85)}`,
            background: rgba(gold, 0.12),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `rotate(-12deg) scale(${stampP})`,
            opacity: Math.min(1, stampP * 1.5),
            boxShadow: `0 0 34px ${rgba(gold, 0.3)}`,
          }}
        >
          {/* 金章压印质感 */}
          <StampInk color="rgba(190,140,50,0.9)" opacity={0.38} />
          <Txt
            size={62}
            color={T.goldA}
            weight={700}
            font="serif"
            letterSpacing={4}
            lineHeight={78}
          >
            结业
          </Txt>
          <Txt
            size={19}
            color={rgba(gold, 0.85)}
            letterSpacing={3}
            lineHeight={24}
            style={{ marginTop: 4 }}
          >
            CERTIFIED
          </Txt>
        </div>
      </Chapter>

      {/* 02 通关宣言 */}
      <Chapter t={t} in={[2.66, 2.96]} out={[4.5, 4.78]}>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={14}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 560,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.74, 3.04)),
          }}
        >
          全 科 通 过
        </Txt>
        <div style={{ position: 'absolute', left: 0, top: 610, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={196}
            weight={700}
            font="num"
            lineHeight={228}
            style={{
              opacity: outExpo(seg(t, 2.68, 2.98)),
              transform: `scale(${lerp(1.16, 1, outBack(seg(t, 2.68, 3.1), 1.9))})`,
            }}
          >
            {p.hero || '4'}
          </GoldText>
          <Txt
            size={64}
            color={rgba(cream, 0.9)}
            weight={500}
            font="serif"
            letterSpacing={6}
            lineHeight={84}
            style={{ marginTop: -22, opacity: outExpo(seg(t, 2.84, 3.14)) }}
          >
            科全优
          </Txt>
        </div>

        <Txt
          size={34}
          color={rgba(cream, 0.84)}
          font="serif"
          letterSpacing={7}
          lineHeight={48}
          style={{
            position: 'absolute',
            left: 0,
            top: 950,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.0, 3.32)),
          }}
        >
          {p.subValue || '从今天起，可以独立面对客户了'}
        </Txt>

        {[
          { k: '班级排名', v: '第 3 名 / 48 人' },
          { k: '实操演练', v: '全部一次通过' },
          { k: '带教评语', v: '专业扎实，开口自如' },
        ].map((f, i) => {
          const s0 = 3.16 + i * 0.2;
          const e = outExpo(seg(t, s0, s0 + 0.36));
          return (
            <div
              key={f.k}
              style={{
                position: 'absolute',
                left: 160,
                top: 1090 + i * 118,
                width: 760,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                opacity: e,
                transform: `translateY(${(1 - e) * 22}px)`,
              }}
            >
              <Txt size={29} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={6} lineHeight={40}>
                {f.k}
              </Txt>
              <Txt size={38} color={T.bright} weight={600} font="serif" letterSpacing={2} lineHeight={52}>
                {f.v}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.62, 4.92]} out={[6.0, 6.28]} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <EndCard theme={T} t={t} start={6.36} p={p} />
      </Chapter>
    </Stage>
  );
};
