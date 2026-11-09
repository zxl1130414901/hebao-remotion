import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 70 · 早会播报版
 * 叙事：播报抬头 → 名单逐行从右侧滑入（像字幕条）→ 冠军单独聚焦 → 定版
 * 与旧模板差异：信息型排版（榜单表格流），不是礼仪式居中构图；适合每日/每周群发。
 */
export const Morning: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const list = (p.roster ?? []).slice(0, 6);
  const champ = list.find((r) => r.hl) ?? list[0];

  return (
    <Stage theme={T} brand={p.brand} bottomtag="MORNING　BRIEFING">
      {/* 01 榜单 */}
      <Chapter t={t} in={[0.04, 0.3]} out={[3.16, 3.44]}>
        {/* 抬头条 */}
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 176,
            width: 900,
            display: 'flex',
            alignItems: 'flex-end',
            paddingBottom: 18,
            borderBottom: `2px solid ${rgba(T.line, 0.55)}`,
            opacity: outExpo(seg(t, 0.06, 0.36)),
          }}
        >
          <div>
            <Txt size={22} color={rgba(T.mist, 0.85)} letterSpacing={8} lineHeight={30}>
              DAILY　BRIEFING
            </Txt>
            <Txt
              size={46}
              color="#fff"
              weight={700}
              font="serif"
              letterSpacing={6}
              lineHeight={60}
              style={{ marginTop: 4 }}
            >
              {p.slogan || '今日播报'}
            </Txt>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <Txt size={26} color={rgba(T.mist, 0.85)} letterSpacing={4} lineHeight={36}>
              {p.dateText}
            </Txt>
            <Txt size={22} color={rgba(T.mist, 0.85)} letterSpacing={3} lineHeight={28}>
              早 8:30 · 全 员 到 齐
            </Txt>
          </div>
        </div>

        {/* 表头 */}
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 316,
            width: 900,
            display: 'flex',
            alignItems: 'baseline',
            paddingBottom: 12,
            borderBottom: `1px solid ${rgba(T.line, 0.18)}`,
            opacity: outExpo(seg(t, 0.2, 0.5)),
          }}
        >
          <Txt size={22} color={rgba(T.mist, 0.85)} letterSpacing={5} lineHeight={30} style={{ width: 96 }}>
            名次
          </Txt>
          <Txt size={22} color={rgba(T.mist, 0.85)} letterSpacing={5} lineHeight={30} style={{ width: 280 }}>
            姓名
          </Txt>
          <Txt size={22} color={rgba(T.mist, 0.85)} letterSpacing={5} lineHeight={30}>
            机构
          </Txt>
          <Txt
            size={22}
            color={rgba(T.mist, 0.85)}
            letterSpacing={5}
            lineHeight={30}
            style={{ marginLeft: 'auto' }}
          >
            累计标保
          </Txt>
        </div>

        {list.map((r, i) => {
          const s0 = 0.34 + i * 0.24;
          const e = outExpo(seg(t, s0, s0 + 0.36));
          return (
            <div
              key={r.name + i}
              style={{
                position: 'absolute',
                left: 90,
                top: 358 + i * 148,
                width: 900,
                height: 132,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 10,
                background: r.hl
                  ? `linear-gradient(90deg, ${rgba(gold, 0.18)}, ${rgba(gold, 0.02)})`
                  : 'transparent',
                border: r.hl ? `1px solid ${rgba(gold, 0.34)}` : 'none',
                borderBottom: r.hl ? undefined : `1px solid ${rgba(T.line, 0.12)}`,
                padding: r.hl ? '0 22px' : '0 22px',
                opacity: e,
                transform: `translateX(${(1 - e) * 120}px)`,
              }}
            >
              <Txt
                size={r.hl ? 62 : 44}
                color={r.hl ? T.goldB : rgba(T.mist, 0.34)}
                weight={700}
                font="num"
                lineHeight={76}
                style={{ width: r.hl ? 96 : 96, marginLeft: r.hl ? -22 : 0 }}
              >
                {String(i + 1).padStart(2, '0')}
              </Txt>
              <Txt
                size={r.hl ? 44 : 36}
                color={r.hl ? T.cream : rgba(cream, 0.86)}
                weight={r.hl ? 700 : 500}
                font="serif"
                letterSpacing={3}
                lineHeight={r.hl ? 58 : 48}
                style={{ width: 280 }}
              >
                {r.name}
              </Txt>
              <Txt
                size={24}
                color={rgba(T.mist, r.hl ? 0.7 : 0.5)}
                weight={300}
                letterSpacing={3}
                lineHeight={34}
              >
                {r.org}
              </Txt>
              <div style={{ marginLeft: 'auto', marginRight: r.hl ? -22 : 0 }}>
                <GoldText
                  theme={T}
                  size={r.hl ? 52 : 40}
                  weight={700}
                  font="num"
                  lineHeight={r.hl ? 66 : 52}
                >
                  {r.value}
                </GoldText>
              </div>
            </div>
          );
        })}

        <Txt
          size={23}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={4}
          lineHeight={32}
          style={{
            position: 'absolute',
            left: 90,
            top: 1268,
            width: 900,
            opacity: outExpo(seg(t, 2.0, 2.34)),
          }}
        >
          数据口径：本月累计标保 · 截至昨日 24:00
        </Txt>
      </Chapter>

      {/* 02 冠军聚焦 */}
      <Chapter t={t} in={[3.28, 3.58]} out={[5.4, 5.68]}>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 400,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.36, 3.66)),
          }}
        >
          本 期 榜 首
        </Txt>
        <Txt
          size={96}
          color={T.cream}
          weight={700}
          font="serif"
          letterSpacing={8}
          lineHeight={128}
          style={{
            position: 'absolute',
            left: 0,
            top: 448,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.3, 3.62)),
            transform: `scale(${lerp(1.1, 1, outBack(seg(t, 3.3, 3.72), 1.8))})`,
          }}
        >
          {champ?.name ?? p.name}
        </Txt>
        <div style={{ position: 'absolute', left: 0, top: 620, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={208}
            weight={700}
            font="num"
            lineHeight={242}
            style={{
              opacity: outExpo(seg(t, 3.42, 3.74)),
              transform: `scale(${lerp(1.18, 1, outBack(seg(t, 3.42, 3.86), 1.9))})`,
              filter: `drop-shadow(0 12px 38px ${rgba(gold, 0.32)})`,
            }}
          >
            {String(champ?.value ?? '').replace(/\s*万$/, '')}
          </GoldText>
          <Txt
            size={52}
            color={rgba(cream, 0.88)}
            weight={500}
            font="serif"
            letterSpacing={6}
            lineHeight={70}
            style={{ marginTop: -14 }}
          >
            万元
          </Txt>
        </div>
        <Txt
          size={32}
          color={rgba(cream, 0.8)}
          font="serif"
          letterSpacing={6}
          lineHeight={46}
          style={{
            position: 'absolute',
            left: 0,
            top: 946,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.62, 3.94)),
          }}
        >
          {p.subValue || '早会 8:30，请全队向她提问'}
        </Txt>

        <div
          style={{
            position: 'absolute',
            left: 200,
            top: 1056,
            width: 680,
            height: 1,
            background: `linear-gradient(90deg, ${rgba(T.line, 0)}, ${rgba(T.line, 0.45)}, ${rgba(T.line, 0)})`,
            opacity: outExpo(seg(t, 3.8, 4.1)),
          }}
        />
        <Txt
          size={27}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={3}
          lineHeight={40}
          style={{
            position: 'absolute',
            left: 140,
            top: 1096,
            width: 800,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.9, 4.24)),
          }}
        >
          「没有别的窍门，就是每天比昨天多打三个电话。」
        </Txt>
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.62, 5.98]}>
        <Sfx name="sfx_chime" at={3.60} vol={0.3} />
        <EndCard theme={T} t={t} start={5.68} p={p} />
      </Chapter>
    </Stage>
  );
};
