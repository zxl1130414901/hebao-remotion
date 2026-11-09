import React, { createContext, useContext } from 'react';
import type { Category } from '../data/types';

/**
 * 模板分类上下文。
 * 意义：Stage 需要「知道自己在哪一类模板里」才能选对底乐与质感强度，
 * 但每个模板都手传一遍 category 既不优雅也容易漏。
 * 这里由 Root 在生成 Composition 时统一注入，Stage 自取。
 */
const Ctx = createContext<Category | null>(null);

export const CategoryProvider = Ctx.Provider;

export const useCategory = (): Category | null => useContext(Ctx);

/** 分类 → 底乐。事件音效（钟声/whoosh/tick）不在底乐里，留给模板自己设计 */
const BED_BY_CAT: Record<string, string> = {
  仪式贺报: 'assets/bed_ceremony.wav',
  荣誉榜单: 'assets/bed_ceremony.wav',
  历程故事: 'assets/bed_ceremony.wav',
  巨字排版: 'assets/bed_data.wav',
  数据图表: 'assets/bed_data.wav',
  团队招募: 'assets/bed_data.wav',
  创意场景: 'assets/bed_creative.wav',
  创意风格: 'assets/bed_creative.wav',
};

export const bedForCategory = (cat: Category | null): string =>
  (cat && BED_BY_CAT[cat]) || 'assets/bed_ceremony.wav';
