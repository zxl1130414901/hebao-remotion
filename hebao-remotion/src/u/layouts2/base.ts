import type { Skin } from '../skins';
import type { UniversalProps } from '../types';

/* 新版式族（u66–u115）共用签名：与旧五版式完全一致，Root 直接注册 */
export type LP = { p: UniversalProps; s: Skin; accent: number; arr: number };

/** 版心（贺报统一 88–992），中轴 540 */
export const MX = 88;
export const MW = 904;
export const CX = 540;
