# -*- coding: utf-8 -*-
"""把 65 张关键帧拼成一张总览墙（00-总览.jpg）。
用法：python tools/contact_sheet.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, '..', '贺报-通用版-200')
PREV = os.path.join(OUT, 'previews')

COLS, ROWS = 20, 10
TW, TH = 140, 249          # 单张缩略图
GAP, PAD, LABEL = 11, 40, 22
BG = (10, 10, 14)
INK = (232, 232, 238)
DIM = (140, 140, 152)

W = PAD * 2 + COLS * TW + (COLS - 1) * GAP
H = PAD * 2 + 84 + ROWS * (TH + LABEL) + (ROWS - 1) * GAP

sheet = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(sheet)


def font(size, bold=False):
    for name in (['msyhbd.ttc', 'msyh.ttc', 'simhei.ttf'] if bold else ['msyh.ttc', 'simhei.ttf', 'arial.ttf']):
        for base in ('C:/Windows/Fonts/', ''):
            try:
                return ImageFont.truetype(base + name, size)
            except OSError:
                continue
    return ImageFont.load_default()


f_title = font(38, True)
f_sub = font(16)
f_id = font(12, True)
f_name = font(16)

d.text((PAD, PAD - 8), '贺报宇宙 · 200 套通用模板总览', font=f_title, fill=INK)
d.text((PAD + 2, PAD + 44), '13 套视觉体系 × 73 种叙事结构（u01–u65 五基础 / u66–u115 二十五骨架 / u116–u200 四十三骨架）｜ 每套一套独立剧情 ｜ 1080×1920 · 8s · 60fps',
       font=f_sub, fill=DIM)

top = PAD + 84
for i in range(200):
    tid = f'u{i + 1:02d}' if i < 65 else f'u{i + 1}'
    path = os.path.join(PREV, f'{tid}.jpg')
    if not os.path.exists(path):
        continue
    r, c = divmod(i, COLS)
    x = PAD + c * (TW + GAP)
    y = top + r * (TH + LABEL + GAP)
    im = Image.open(path).convert('RGB')
    scale = max(TW / im.width, TH / im.height)
    im = im.resize((int(im.width * scale) + 1, int(im.height * scale) + 1), Image.LANCZOS)
    left = (im.width - TW) // 2
    top_c = (im.height - TH) // 2
    sheet.paste(im.crop((left, top_c, left + TW, top_c + TH)), (x, y))
    d.text((x + 2, y + TH + 5), tid.upper(), font=f_id, fill=(227, 195, 135))
    

sheet.save(os.path.join(OUT, '00-总览.jpg'), quality=88, subsampling=1)
print('saved', W, 'x', H)
