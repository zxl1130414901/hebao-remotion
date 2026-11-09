import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { PhotoCard } from '../components/PhotoCard';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 69 · 师徒传承版
 * 叙事：师傅在上（首字章）→ 一条金线垂落 → 徒弟在下（本人照片+业绩）→ 共荣 → 定版
 * 与旧模板差异：双人关系结构，讲「谁带出来的」，不是单人自夸。
 */
export const Mentor: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const flow = outExpo(seg(t, 1.0, 1.6));
  const dotY = 592 + flow * 108;

  return (
    <Stage theme={T} brand={p.brand} bottomtag="MENTOR　&　MENTEE">
      {/* 01 师承 */}
      <Chapter t={t} in={[0.04, 0.34]} out={[3.0, 3.28]}>
        <Txt
          size={52}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={18}
          lineHeight={72}
          style={{
            position: 'absolute',
            left: 0,
            top: 176,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          {p.slogan || '师 承'}
        </Txt>

        {/* 师傅 */}
        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 268,
            width: 820,
            height: 288,
            borderRadius: 18,
            background: rgba(T.mask, 0.46),
            border: `1px solid ${rgba(T.line, 0.26)}`,
            opacity: outExpo(seg(t, 0.2, 0.54)),
            transform: `translateY(${(1 - outExpo(seg(t, 0.2, 0.56))) * 26}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 34,
              top: 58,
              width: 172,
              height: 172,
              borderRadius: '50%',
              background: `radial-gradient(circle at 34% 28%, ${rgba(gold, 0.92)}, ${rgba(hexRgb(T.goldD), 0.92)})`,
              border: `2px solid ${rgba(T.goldA, 0.7)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: outExpo(seg(t, 0.32, 0.66)),
              transform: `scale(${lerp(0.6, 1, outBack(seg(t, 0.32, 0.72), 2))})`,
            }}
          >
            <Txt size={72} color={rgba(T.archbg, 0.92)} weight={700} font="serif" lineHeight={88}>
              {(p.mentorLine || '师傅　陈立群').replace(/^师傅[\s　]*/, '').slice(0, 1)}
            </Txt>
          </div>
          <div style={{ position: 'absolute', left: 240, top: 66 }}>
            <Txt size={22} color={rgba(T.mist, 0.85)} letterSpacing={7} lineHeight={32}>
              MENTOR　·　引 路 人
            </Txt>
            <Txt
              size={54}
              color={T.cream}
              weight={600}
              font="serif"
              letterSpacing={4}
              lineHeight={72}
              style={{ marginTop: 8 }}
            >
              {(p.mentorLine || '师傅　陈立群 · 资深总监').replace(/^师傅[\s　]*/, '')}
            </Txt>
            <Txt
              size={26}
              color={rgba(T.mist, 0.85)}
              weight={300}
              letterSpacing={2}
              lineHeight={38}
              style={{ marginTop: 14 }}
            >
              「我带过 23 个人，你是最拼的那个。」
            </Txt>
          </div>
        </div>

        {/* 传承线 */}
        <svg
          width={1080}
          height={1920}
          viewBox="0 0 1080 1920"
          style={{ position: 'absolute', inset: 0 }}
        >
          <line
            x1={540}
            y1={556}
            x2={540}
            y2={592 + 108 * flow}
            stroke={rgba(gold, 0.8)}
            strokeWidth={2.4}
            strokeDasharray="7 7"
          />
          <path
            d={`M 528 ${586 + 108 * flow} L 540 ${600 + 108 * flow} L 552 ${586 + 108 * flow}`}
            fill="none"
            stroke={rgba(gold, 0.9)}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={flow}
          />
          <circle cx={540} cy={dotY} r={5.4} fill={T.goldA} opacity={flow} />
        </svg>

        {/* 徒弟（本人） */}
        <div
          style={{
            position: 'absolute',
            left: 106,
            top: 700,
            width: 868,
            height: 560,
            borderRadius: 20,
            background: `linear-gradient(160deg, ${rgba(gold, 0.14)} 0%, ${rgba(T.mask, 0.52)} 66%)`,
            border: `1px solid ${rgba(T.line, 0.42)}`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.34)`,
            opacity: outExpo(seg(t, 1.12, 1.5)),
            transform: `translateY(${(1 - outExpo(seg(t, 1.12, 1.54))) * 34}px)`,
          }}
        >
          <div style={{ position: 'absolute', left: 46, top: 52 }}>
            <PhotoCard theme={T} src={p.photo} left={0} top={0} width={228} height={228} round />
            <div
              style={{
                position: 'absolute',
                inset: -10,
                borderRadius: '50%',
                border: `1px solid ${rgba(T.line, 0.45)}`,
              }}
            />
          </div>
          <div style={{ position: 'absolute', left: 320, top: 66, width: 500 }}>
            <Txt size={22} color={rgba(T.mist, 0.85)} letterSpacing={7} lineHeight={32}>
              MENTEE　·　接 棒 人
            </Txt>
            <Txt
              size={62}
              color={T.cream}
              weight={700}
              font="serif"
              letterSpacing={4}
              lineHeight={82}
              style={{ marginTop: 6 }}
            >
              {p.name}
            </Txt>
            <Txt size={26} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={3} lineHeight={38}>
              {p.role}
            </Txt>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 320,
              top: 300,
              width: 500,
              height: 1,
              background: `linear-gradient(90deg, ${rgba(T.line, 0.5)}, ${rgba(T.line, 0.04)})`,
            }}
          />
          <Txt
            size={28}
            color={rgba(cream, 0.82)}
            weight={300}
            letterSpacing={3}
            lineHeight={44}
            style={{ position: 'absolute', left: 320, top: 330, width: 500 }}
          >
            「师傅教我的第一句话：
            <br />
            　 先把客户的事办完，再谈业绩。」
          </Txt>
          <div
            style={{
              position: 'absolute',
              left: 46,
              bottom: 42,
              display: 'flex',
              alignItems: 'baseline',
              gap: 14,
            }}
          >
            <Txt size={24} color={rgba(T.mist, 0.85)} letterSpacing={5} lineHeight={34}>
              拜师
            </Txt>
            <Txt size={34} color={T.bright} weight={600} font="serif" letterSpacing={2} lineHeight={46}>
              第 8 个月
            </Txt>
          </div>
        </div>
      </Chapter>

      {/* 02 徒出师 */}
      <Chapter t={t} in={[3.12, 3.42]} out={[5.16, 5.44]}>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={13}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 400,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.2, 3.5)),
          }}
        >
          出 师 战 绩
        </Txt>
        <div style={{ position: 'absolute', left: 0, top: 446, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={224}
            weight={700}
            font="num"
            lineHeight={258}
            style={{
              opacity: outExpo(seg(t, 3.12, 3.44)),
              transform: `scale(${lerp(1.16, 1, outBack(seg(t, 3.12, 3.54), 1.9))})`,
              filter: `drop-shadow(0 12px 38px ${rgba(gold, 0.3)})`,
            }}
          >
            {p.premium.toFixed(p.premium % 1 !== 0 ? 1 : 0)}
          </GoldText>
          <Txt
            size={54}
            color={rgba(cream, 0.9)}
            weight={500}
            font="serif"
            letterSpacing={8}
            lineHeight={72}
            style={{ marginTop: -16, opacity: outExpo(seg(t, 3.3, 3.6)) }}
          >
            万 · 个人标保
          </Txt>
        </div>
        <Txt
          size={32}
          color={rgba(cream, 0.82)}
          font="serif"
          letterSpacing={6}
          lineHeight={46}
          style={{
            position: 'absolute',
            left: 0,
            top: 786,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.46, 3.78)),
          }}
        >
          {p.subValue || '师傅说：这成绩，能出门了'}
        </Txt>

        {[
          { k: '达成率', v: p.stats?.[1]?.v || '218%' },
          { k: '承保件数', v: `${p.stats?.[0]?.v || '42'} 件` },
          { k: '全省排名', v: p.stats?.[2]?.v || 'No.3' },
        ].map((f, i) => {
          const s0 = 3.6 + i * 0.2;
          const e = outExpo(seg(t, s0, s0 + 0.36));
          return (
            <div
              key={f.k}
              style={{
                position: 'absolute',
                left: 180,
                top: 920 + i * 130,
                width: 720,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: `1px solid ${rgba(T.line, 0.18)}`,
                paddingBottom: 20,
                opacity: e,
                transform: `translateY(${(1 - e) * 22}px)`,
              }}
            >
              <Txt size={30} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={6} lineHeight={42}>
                {f.k}
              </Txt>
              <Txt size={42} color={T.bright} weight={700} font="num" lineHeight={54}>
                {f.v}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.38, 5.74]}>
        <Sfx name="sfx_chime" at={0.60} vol={0.3} />
        <EndCard theme={T} t={t} start={5.44} p={p} />
      </Chapter>
    </Stage>
  );
};
