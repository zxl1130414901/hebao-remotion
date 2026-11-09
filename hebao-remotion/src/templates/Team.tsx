import { Sfx } from '../components/Sfx';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { QrBlock } from '../components/QrBlock';
import { Rule } from '../components/Rule';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 32 · 团队荣耀版
 * 叙事：队徽 + 团队名逐字 → 合影（金框四角）→ 团队大滚数 + 三项 → 成员名单 → 定版
 * 独立版式（brand 横排顶部 / 无竖排品牌），与 ranking 同族的定版自绘。
 */

const MEMBERS = ['李静怡 · 王志远 · 陈晓婷', '刘一鸣 · 赵思颖 · 周子墨', '吴 倩 · 郑凯文'];

export const Team: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const company = p.company ?? '泰康养老保险股份有限公司';
  const nameChars = Array.from('杭州三区');
  /* 定版语为本模板专属（原版 CFG 同款），不走全局 slogan2 */
  const endChars = Array.from('团队同心 · 其利断金');

  return (
    <Stage theme={T} brand={p.brand} brandLayout="top" bottomtag="TEAM　PERFORMANCE　REPORT">
      {/* 01 队徽 + 团队名 */}
      <Chapter t={t} in={[0.04, 0.4]} out={[1.36, 1.66]}>
        {(() => {
          const pb = outBack(seg(t, 0.1, 0.48), 1.7);
          const ringP = outExpo(seg(t, 0.2, 0.56));
          return (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 470,
                  top: 470,
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  border: `2px solid ${rgba(T.line, 0.6)}`,
                  background: rgba(T.line, 0.08),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: clamp01(seg(t, 0.1, 0.3)),
                  transform: `scale(${lerp(0.6, 1, pb)})`,
                }}
              >
                <Txt size={58} color={T.bright} weight={600} font="serif" lineHeight={72}>
                  队
                </Txt>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 450,
                  top: 450,
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  border: `1px dashed ${rgba(T.line, 0.4)}`,
                  opacity: ringP,
                  transform: `rotate(${t * 8}deg) scale(${lerp(1.3, 1, ringP)})`,
                }}
              />
            </>
          );
        })()}
        <div style={{ position: 'absolute', top: 688, width: 1080, textAlign: 'center' }}>
          {nameChars.map((c, i) => {
            const pr = seg(t, 0.4 + i * 0.09, 0.72 + i * 0.09);
            const e = outBack(pr, 2.1);
            return (
              <GoldText
                key={i}
                theme={T}
                size={124}
                font="serif"
                weight={700}
                lineHeight={160}
                letterSpacing={18}
                style={{
                  opacity: clamp01(pr * 2.2),
                  transform: `scale(${lerp(1.4, 1, e)}) translateY(${(1 - outExpo(pr)) * 24}px)`,
                }}
              >
                {c}
              </GoldText>
            );
          })}
        </div>
        {(() => {
          const pts = outExpo(seg(t, 0.86, 1.14));
          return (
            <>
              <Txt
                size={40}
                color={T.cream}
                weight={400}
                font="serif"
                letterSpacing={10}
                lineHeight={56}
                style={{
                  position: 'absolute',
                  top: 892,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pts,
                  transform: `translateY(${(1 - pts) * 22}px)`,
                }}
              >
                十月团队荣耀战报
              </Txt>
              <Rule theme={T} t={t} start={1.0} dur={0.28} left={460} top={990} width={160} solid opacity={0.65} />
            </>
          );
        })()}
      </Chapter>

      {/* 02 合影 */}
      <Chapter t={t} in={[1.5, 1.82]} out={[4.0, 4.3]}>
        {(() => {
          const ptl = outExpo(seg(t, 1.56, 1.82));
          const phP = outExpo(seg(t, 1.62, 2.36));
          const pcap = outExpo(seg(t, 2.6, 2.92));
          return (
            <>
              <Txt
                size={30}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={8}
                lineHeight={42}
                style={{
                  position: 'absolute',
                  top: 440,
                  width: 1080,
                  textAlign: 'center',
                  opacity: ptl,
                  transform: `translateY(${(1 - ptl) * 18}px)`,
                }}
              >
                TEAM　OF　THE　MONTH
              </Txt>
              {/* 外框 */}
              <div
                style={{
                  position: 'absolute',
                  left: 56,
                  top: 518,
                  width: 968,
                  height: 688,
                  border: `1px solid ${rgba(T.line, 0.32)}`,
                  borderRadius: 4,
                  opacity: outExpo(seg(t, 1.74, 2.5)),
                  transform: `scale(${lerp(1.02, 1, outExpo(seg(t, 1.74, 2.5)))})`,
                }}
              />
              {/* 照片框（底部揭幕） */}
              <div
                style={{
                  position: 'absolute',
                  left: 70,
                  top: 532,
                  width: 940,
                  height: 660,
                  clipPath: `inset(0 0 ${(1 - phP) * 100}% 0)`,
                  transform: `translateY(${(1 - phP) * 46}px) scale(${lerp(0.97, 1, phP)})`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    background: T.archbg,
                    border: `2px solid ${rgba(T.soft, 0.9)}`,
                  }}
                >
                  <Img
                    src={p.photo || staticFile('assets/portrait.png')}
                    style={{ position: 'absolute', left: 0, top: 0, width: 940, height: 660, objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(180deg,rgba(0,0,0,0) 55%,${rgba(T.mask, 0.55)} 100%)`,
                    }}
                  />
                </div>
                {/* 四角金饰 */}
                {[
                  { l: 14, tp: 14, borders: { borderLeft: 3, borderTop: 3 } },
                  { r: 14, tp: 14, borders: { borderRight: 3, borderTop: 3 } },
                  { l: 14, b: 14, borders: { borderLeft: 3, borderBottom: 3 } },
                  { r: 14, b: 14, borders: { borderRight: 3, borderBottom: 3 } },
                ].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      ...(c.l !== undefined ? { left: c.l } : { right: c.r }),
                      ...(c.tp !== undefined ? { top: c.tp } : { bottom: c.b }),
                      width: 26,
                      height: 26,
                      pointerEvents: 'none',
                      ...Object.fromEntries(
                        Object.entries(c.borders).map(([k, v]) => [k, `${v}px solid ${rgba(T.goldB, 0.9)}`])
                      ),
                    }}
                  />
                ))}
              </div>
              <Txt
                size={32}
                color={rgba(T.soft, 0.9)}
                weight={400}
                letterSpacing={6}
                lineHeight={45}
                style={{
                  position: 'absolute',
                  top: 1252,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pcap,
                  transform: `translateY(${(1 - pcap) * 22}px)`,
                }}
              >
                并肩作战 · 共创佳绩
              </Txt>
            </>
          );
        })()}
      </Chapter>

      {/* 03 团队数据 */}
      <Chapter t={t} in={[4.14, 4.46]} out={[5.96, 6.26]}>
        {(() => {
          const pl = outExpo(seg(t, 4.2, 4.46));
          return (
            <>
              <Txt
                size={34}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={6}
                lineHeight={48}
                style={{
                  position: 'absolute',
                  top: 452,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pl,
                  transform: `translateY(${(1 - pl) * 18}px)`,
                }}
              >
                十月团队承保保费
              </Txt>
              <div
                style={{
                  position: 'absolute',
                  top: 530,
                  width: 1080,
                  display: 'flex',
                  justifyContent: 'center',
                  opacity: outExpo(seg(t, 4.32, 4.58)),
                }}
              >
                <NumRoll theme={T} target={p.premium} t={t} start={4.26} dur={1.16} size={300} lineHeight={330} unit="万元" unitSize={56} />
              </div>
              <Rule theme={T} t={t} start={4.42} dur={0.54} left={40} top={892} width={1000} opacity={0.6} />
              <Txt
                size={28}
                color={rgba(T.soft, 0.85)}
                weight={400}
                letterSpacing={4}
                lineHeight={39}
                style={{
                  position: 'absolute',
                  top: 930,
                  width: 1080,
                  textAlign: 'center',
                  opacity: outExpo(seg(t, 4.86, 5.12)),
                  transform: `translateY(${(1 - outExpo(seg(t, 4.86, 5.12))) * 18}px)`,
                }}
              >
                {p.delta}
              </Txt>
              {p.stats.slice(0, 3).map((s, i) => {
                const pr = outExpo(seg(t, 4.8 + i * 0.1, 5.12 + i * 0.1));
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: 150 + i * 270,
                      top: 1080,
                      width: 240,
                      textAlign: 'center',
                      opacity: pr,
                      transform: `translateY(${(1 - pr) * 44}px)`,
                    }}
                  >
                    <Txt size={76} color="#fff" font="num" weight={700} lineHeight={86}>
                      {s.v}
                    </Txt>
                    <Txt
                      size={30}
                      color={rgba(T.mist, 0.88)}
                      weight={300}
                      letterSpacing={4}
                      lineHeight={42}
                      style={{ marginTop: 14 }}
                    >
                      {s.k}
                    </Txt>
                  </div>
                );
              })}
              {[400, 680].map((left) => (
                <div
                  key={left}
                  style={{
                    position: 'absolute',
                    left,
                    top: 1112,
                    width: 1,
                    height: 190,
                    background: rgba(T.line, 0.32),
                  }}
                />
              ))}
            </>
          );
        })()}
      </Chapter>

      {/* 04 成员与定版 */}
      <Chapter t={t} in={[6.1, 6.42]}>
        {(() => {
          const pm1 = outExpo(seg(t, 6.16, 6.42));
          const plg = outBack(seg(t, 6.96, 7.26), 1.6);
          const pco = outExpo(seg(t, 7.04, 7.28));
          const pt5 = outExpo(seg(t, 7.1, 7.52));
          const pq2 = outBack(seg(t, 7.3, 7.6), 1.5);
          const pc2 = outExpo(seg(t, 7.44, 7.66));
          return (
            <>
              <Txt
                size={34}
                color={rgba(T.soft, 0.9)}
                weight={400}
                letterSpacing={10}
                lineHeight={48}
                style={{
                  position: 'absolute',
                  top: 380,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pm1,
                  transform: `translateY(${(1 - pm1) * 18}px)`,
                }}
              >
                荣 耀 成 员
              </Txt>
              <Rule theme={T} t={t} start={6.26} dur={0.26} left={340} top={446} width={400} opacity={0.5} />
              {MEMBERS.map((row, i) => {
                const pr = outExpo(seg(t, 6.3 + i * 0.1, 6.6 + i * 0.1));
                return (
                  <Txt
                    key={i}
                    size={36}
                    color="#fff"
                    weight={400}
                    font="serif"
                    letterSpacing={3}
                    lineHeight={62}
                    style={{
                      position: 'absolute',
                      top: 508 + i * 62,
                      width: 1080,
                      textAlign: 'center',
                      opacity: pr,
                      transform: `translateY(${(1 - pr) * 22}px)`,
                    }}
                  >
                    {row}
                  </Txt>
                );
              })}
              <Rule
                theme={T}
                t={t}
                start={6.86}
                dur={0.24}
                left={440}
                top={856}
                width={200}
                height={2}
                solid
                opacity={0.6}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 490,
                  top: 936,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  border: `1.5px solid ${rgba(T.line, 0.75)}`,
                  background: rgba(T.line, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: clamp01(seg(t, 6.96, 7.14)),
                  transform: `scale(${lerp(0.7, 1, plg)})`,
                }}
              >
                <Txt size={46} color={T.bright} weight={600} font="serif" lineHeight={60}>
                  泰
                </Txt>
              </div>
              <Txt
                size={30}
                color={rgba(T.mist, 1)}
                weight={300}
                letterSpacing={6}
                lineHeight={42}
                style={{
                  position: 'absolute',
                  top: 1062,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pco,
                  transform: `translateY(${(1 - pco) * 16}px)`,
                }}
              >
                {company}
              </Txt>
              <div style={{ position: 'absolute', top: 1152, width: 1080, textAlign: 'center' }}>
                {endChars.map((c, i) => (
                  <GoldText
                    key={i}
                    theme={T}
                    size={68}
                    font="serif"
                    weight={700}
                    lineHeight={96}
                    letterSpacing={14}
                    style={{ opacity: pt5, transform: `translateY(${(1 - pt5) * 32}px)` }}
                  >
                    {c}
                  </GoldText>
                ))}
              </div>
              <QrBlock
                theme={T}
                left={440}
                top={1330}
                size={200}
                src={p.qr}
                style={{
                  opacity: clamp01(seg(t, 7.3, 7.46)),
                  transform: `scale(${lerp(0.86, 1, pq2)})`,
                }}
              />
              <Txt
                size={30}
                color={rgba(T.soft, 0.9)}
                weight={500}
                letterSpacing={6}
                lineHeight={42}
                style={{
                  position: 'absolute',
                  top: 1578,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pc2,
                }}
              >
                {p.qrCap}
              </Txt>
              <Txt
                size={28}
                color={rgba(T.mist, 0.8)}
                weight={300}
                letterSpacing={8}
                lineHeight={39}
                style={{
                  position: 'absolute',
                  top: 1654,
                  width: 1080,
                  textAlign: 'center',
                  opacity: outExpo(seg(t, 7.54, 7.76)),
                }}
              >
                {p.dateText}
              </Txt>
            </>
          );
        })()}
      </Chapter>
        <Sfx name="sfx_pop" at={5.16} vol={0.28} />
    </Stage>
  );
};
