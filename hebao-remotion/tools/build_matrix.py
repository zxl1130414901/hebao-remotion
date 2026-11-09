# -*- coding: utf-8 -*-
"""从 src/u/templates.ts 生成 65 套模板总表 → skill references/matrix.md"""
import json
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TS = os.path.join(ROOT, 'src', 'u', 'templates.ts')
OUT = os.path.join(os.path.expanduser('~'), '.workbuddy', 'skills', 'hebao-universal', 'references', 'matrix.md')

META = {
    'aurora': ('极光玻璃', 'AURORA GLASS', '深空渐变 + 玻璃拟态 + 漂浮光带。冷调、未来、国际化，适合科技/发布会/年度盛典。', '科技 SaaS'),
    'chrome': ('液态铬', 'LIQUID CHROME', '黑场 + 旋转铬池 + 镜面高光。强反差、高级灰，适合汽车/硬件/奢侈品/金融。', '金融资本'),
    'neon': ('霓虹赛博', 'NEON CIRCUIT', '品红×青的霓虹光、透视网格地面、扫描线。年轻、街头、游戏电竞。', '电竞游戏'),
    'noir': ('高定黑白', 'HAUTE NOIR', '米白纸感 + 极细黑线 + 衬线大字 + 一抹朱红。时装编辑部气质，适合高端品牌/地产。', '顶奢地产'),
    'acid': ('酸性粗野', 'ACID BRUTAL', '荧光黄绿 + 纯黑大字 + 蓝橙撞色 + 跑马灯。最抓眼，适合社交传播/潮流/电商大促。', '电商大促'),
    'deco': ('装饰艺术', 'ART DECO', '黑金 + 放射日冕 + 对称双线框 + 折扇。殿堂感，适合颁奖礼/年度人物/高客单。', '文化艺术'),
    'kinetic': ('动能大字', 'KINETIC TYPE', '炭黑 + 橙红 + 速度线 + 幽灵描边字。运动感最强，适合战报/冲刺/物流。', '物流履约'),
    'stadium': ('转播竞技', 'STADIUM LIVE', '深海军蓝 + 三束场馆灯 + 草皮弧线 + 转播色条。适合赛事/团队 PK/赛季总结。', '体育赛事'),
    'holo': ('全息镭射', 'HOLO FOIL', '紫粉青渐变 + 镭射箔字 + 地平线网格 + 悬浮球。最「未来感」，适合医疗科技/潮牌/美妆。', '医疗科技'),
    'ink': ('新中式水墨', 'MODERN INK', '宣纸底 + 墨晕 + 远山 + 朱砂印章。东方但不老气，适合国潮/文化/教育。', '教育书院'),
    'riso': ('复古孔版', 'RISO PRINT', '米色纸 + 半调网点 + 套色错位圆盘 + 套准十字。独立杂志感，适合文创/制造/青年文化。', '精密制造'),
    'cinema': ('电影片头', 'CINEMA TITLE', '纯黑 + 放映光束 + 浮尘 + 遮幅黑边。最庄重，适合年度大片式总结/创始人致敬。', '能源重工'),
    'glass': ('玻璃拟态', 'FROSTED GLASS', '通透浅色底 + 悬浮彩色光斑 + 磨砂玻璃方片 + 细网格。最「清透高级」，适合美妆/消费品/生活方式品牌。', '美妆零售'),
}

LAYS = [
    ('hero', '巨字宣言', '标题即主视觉，适合团队大奖、品牌宣言'),
    ('portrait', '人物致敬', '徽记 + 姓名 + 奖项，适合个人荣誉'),
    ('metric', '数字主视觉', '一个大数字压屏，适合业绩/规模/增长'),
    ('list', '荣耀榜单', '5 条排名 + 条形对比，适合区域/团队 PK'),
    ('story', '历程叙事', '横向三节点 + 金句，适合周年/里程碑'),
]

text = open(TS, encoding='utf-8').read()
fams = re.findall(r"skin: '(\w+)',\s*items: \[(.*?)\]", text, re.S)
en_block = re.search(r'const EN: Record<string, string\[\]> = \{(.*?)\n\};', text, re.S).group(1)
ens = {}
for k, v in re.findall(r"(\w+): \[(.*?)\]", en_block, re.S):
    ens[k] = [g1 or g2 for g1, g2 in re.findall(r"'([^']*)'|\"([^\"]*)\"", v)]

# 每套模板的独立演示剧情（content/demo.json）→ 总表里直接标出，避免"65 套同一份文案"的误解
CONTENT = json.load(open(os.path.join(ROOT, 'content', 'demo.json'), encoding='utf-8'))
SCENE = {
    tid: f"{c.get('title', '')} · {c.get('honoree', '')}"
    for tid, c in CONTENT.items()
    if tid.startswith('u')
}

lines = ['# 模板总表（115 套 = 13 视觉 × 5 基础结构 + 25 新骨架 × 2）', '',
         '> 编号规则：每 5 个一组皮肤，组内固定为 巨字 → 人物 → 数字 → 榜单 → 历程。',
         '> 115 套各自带一套独立演示剧情（`content/demo.json`，改文案只改这个文件）：同皮肤下五个结构讲五个不同故事，',
         '> 品牌、受贺对象、核心数字、金句全部不重复，可直接看出各模板的叙事差异。', '']
n = 0
for skin, body in fams:
    names = re.findall(r"'([^']*)'", body)
    cn, en, desc, industry = META[skin]
    lines += [f'## {cn} · {en}', '', desc, '', f'默认演示行业：**{industry}**', '',
              '| ID | 模板 | 英文代号 | 结构 | 演示剧情 | 最适合 |', '|---|---|---|---|---|---|']
    for i, nm in enumerate(names):
        n += 1
        _, lcn, luse = LAYS[i]
        lines.append(
            f'| u{n:02d} | {nm} | {ens[skin][i] if i < len(ens[skin]) else ""} | {lcn} | '
            f'{SCENE.get(f"u{n:02d}", "")} | {luse} |')
    lines.append('')

lines += ['## 按场景速查', '', '| 需求 | 直接选 |', '|---|---|',
          '| 个人获奖（最稳） | u27 金线·徽章 / u17 黑白·特写 / u57 电影·登场 |',
          '| 团队年度大奖 | u26 金线·殿堂 / u06 铬·镜面 / u31 动能·极速 |',
          '| 业绩数字战报 | u43 全息·幻彩数 / u03 极光·深空 / u38 竞技·战报 |',
          '| 区域排行榜 | u39 竞技·联赛榜 / u24 酸性·街头榜 / u64 玻璃·浮榜 |',
          '| 周年 / 历程 | u55 孔版·小志 / u50 水墨·山水 / u05 极光·极昼 |',
          '| 面向年轻人的传播 | u21 酸性·爆破 / u11 霓虹·电路 / u51 孔版·海报 |',
          '| 高端 / 克制 | u16 黑白·高定 / u26 金线·殿堂 / u56 电影·片头 |',
          '| 清透 / 轻盈（美妆·消费） | u61 玻璃·清透 / u62 玻璃·光斑 / u63 玻璃·透数 |',
          '| 国潮 / 东方 | u46 水墨·东方 / u47 水墨·立传 / u49 水墨·群英谱 |']

os.makedirs(os.path.dirname(OUT), exist_ok=True)
# ── 第二批：25 个新骨架 ──
LAYS2 = [
    ('medal', '勋章加冕', '中央圆章 + 缎带，奖项压在章面'), ('cert', '证书文书', '双线框文书 + 衬线 + 火漆印'),
    ('vaxis', '竖轴题字', '全竖排题字 + 朱印，右侧起笔'), ('countdown', '倒计巨数', '数字乱序翻滚后定格'),
    ('quote', '金句海报', '巨型引号 + 金句当主视觉'), ('collage', '拼贴海报', '斜贴卡片 + 胶带，杂志拼贴'),
    ('diag', '对角斜切', '画面斜劈两半，徽章骑缝'), ('film', '胶片条', '竖向胶片 + 齿孔，帧内容滚动'),
    ('bcast', '新闻字幕条', '全宽色条自左推入，转播感'), ('chart', '数据图表', '环形进度 + 数据横杆'),
    ('ticket', '票根券面', '大票券 + 撕票线 + 副券'), ('marquee', '灯箱招牌', '灯泡跑马边框 + 霓虹闪烁'),
    ('press', '报纸头版', '报头 + 三栏正文 + 引文版次'), ('light', '舞台追光', '光锥从顶打下，人立光中'),
    ('ascent', '登顶轨迹', '上升轨迹线 + 里程碑旗'), ('tower', '数字塔', '核心数字逐位堆成塔'),
    ('rings', '双环进度', '双环弧线包裹核心数字'), ('ticker', '弹幕流', '多条信息流穿屏'),
    ('podium', '领奖台', '三级台阶升起，前三名站位'), ('stamp', '巨印盖章', '文书铺底，红印砸下'),
    ('tear', '撕纸揭幕', '锯齿封页撕开露出贺报'), ('lights', '点灯楼群', '窗格逐个点亮成灯海'),
    ('stars', '星图连线', '星点连线，主星是里程碑'), ('bento', '门格拼版', '六张圆角卡片大小错落'),
    ('wave', '声浪频谱', '底部声浪柱律动，数字站上最高柱'),
]
CN2 = dict((k, c) for k, c, _ in LAYS2)
new_rows = re.findall(r"\['(\w+)', '(\w+)', '([^']*)', '([^']*)'\]", text)
if new_rows:
    lines += ['', '## 第二批 25 个新骨架（u66–u115）', '',
              '> 这一批换的是版式而不是皮肤：25 种结构互不重复，每种用两次（换皮肤 + 镜像构图 + 换行业故事）。', '',
              '| ID | 模板 | 英文代号 | 结构 | 演示剧情 | 皮肤 |', '|---|---|---|---|---|---|']
    for idx, (kind, skin, nm, en) in enumerate(new_rows):
        tid = f'u{66 + idx}'
        lines.append(f"| `{tid}` | {nm} | {en} | {CN2.get(kind, kind)} | {SCENE.get(tid, '')} | {META[skin][0]} |")

open(OUT, 'w', encoding='utf-8').write('\n'.join(lines))
print('rows', n, '->', OUT)
