import React from 'react';
import { Composition, Folder } from 'remotion';
/* 字体内嵌：思源宋体（=Source Han Serif，OFL 免费商用）做标题衬线，
   思源黑体兜底正文——全库渲染不再依赖本机安装了什么字体 */
import '@fontsource/noto-serif-sc/700.css';
import '@fontsource/noto-serif-sc/900.css';
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/500.css';
import '@fontsource/noto-sans-sc/700.css';
import '@fontsource/oswald/400.css';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/700.css';
import { TEMPLATES, CAT_ORDER } from './templates/registry';
import { DEFAULT_PROPS } from './data/types';
import type { Category, HebaoProps } from './data/types';
import { CategoryProvider } from './lib/category';

/** 全站统一规格：1080×1920 竖屏 · 60fps · 482 帧（0..481 = 8.033s）
 *  时间轴全部以秒为基准（t = frame / fps），升帧率不影响任何节奏 */
export const FPS = 60;
export const DURATION = 482;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** 把分类注入到模板内（Stage 据此选底乐与质感档位），模板本身不用改一行 */
const withCategory = (cat: Category, Comp: React.FC<HebaoProps>): React.FC<HebaoProps> => {
  const Host: React.FC<HebaoProps> = (props) => (
    <CategoryProvider value={cat}>
      <Comp {...props} />
    </CategoryProvider>
  );
  return Host;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {CAT_ORDER.map((cat) => {
        const list = TEMPLATES.filter((x) => x.cat === cat);
        if (!list.length) return null;
        return (
          <Folder key={cat} name={cat}>
            {list.map((tpl) => (
              <Composition
                key={tpl.id}
                id={tpl.id}
                component={withCategory(cat, tpl.component)}
                durationInFrames={DURATION}
                fps={FPS}
                width={WIDTH}
                height={HEIGHT}
                defaultProps={DEFAULT_PROPS}
              />
            ))}
          </Folder>
        );
      })}
    </>
  );
};
