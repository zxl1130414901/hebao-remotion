# -*- coding: utf-8 -*-
"""从 src/u/templates.ts 生成 60 套模板的画廊页面。"""
import json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TS = os.path.join(ROOT, 'src', 'u', 'templates.ts')
SRC_IMG = os.path.join(ROOT, 'out', 'gallery')
SRC_IMG2 = os.path.join(ROOT, 'out', 'gallery2')  # 第二批 u66–u115 的静帧
SRC_IMG3 = os.path.join(ROOT, 'out', 'gallery3')  # 第三批 u116–u200 的静帧
OUT = os.path.join(ROOT, '..', '贺报-通用版-200')
PREV = os.path.join(OUT, 'previews')
VID = os.path.join(OUT, 'videos')
os.makedirs(PREV, exist_ok=True)
os.makedirs(VID, exist_ok=True)

text = open(TS, encoding='utf-8').read()
fams = re.findall(r"skin: '(\w+)',\s*items: \[(.*?)\]", text, re.S)
en_block = re.search(r'const EN: Record<string, string\[\]> = \{(.*?)\n\};', text, re.S).group(1)
ens = {}
for k, v in re.findall(r"(\w+): \[(.*?)\]", en_block, re.S):
    # 同时兼容 '单引号' 与 "双引号（含撇号）" 的字符串
    vals = [g1 or g2 for g1, g2 in re.findall(r"'([^']*)'|\"([^\"]*)\"", v)]
    ens[k] = vals

META = {
    'aurora': ('极光玻璃', '极光 / 玻璃拟态 / 深空', '#6EE7F9'),
    'chrome': ('液态铬', '金属反射 / 冷峻 / 高级灰', '#D7E0EA'),
    'neon': ('霓虹赛博', '霓虹 / 赛博 / HUD', '#FF2E93'),
    'noir': ('高定黑白', '时装 / 编辑 / 衬线', '#B42318'),
    'acid': ('酸性粗野', '酸性 / 街头 / 大字', '#DFFF00'),
    'deco': ('装饰艺术', '金线 / 对称 / 殿堂', '#E3C387'),
    'kinetic': ('动能大字', '速度 / 运动 / 冲击', '#FF4B12'),
    'stadium': ('转播竞技', '体育 / 转播 / 光束', '#E11D2E'),
    'holo': ('全息镭射', '镭射 / 未来 / 幻彩', '#FF9AD5'),
    'ink': ('新中式水墨', '宣纸 / 水墨 / 朱砂', '#B7332A'),
    'riso': ('复古孔版', 'Riso / 套色 / 印刷', '#FF4A3D'),
    'cinema': ('电影片头', '胶片 / 放映 / 片头', '#E7C88E'),
    'glass': ('玻璃拟态', '磨砂玻璃 / 光斑 / 清透', '#3D7BFF'),
}

LAYOUT_CN = {'hero': '巨字宣言', 'portrait': '人物致敬', 'metric': '数字主视觉', 'list': '荣耀榜单', 'story': '历程叙事'}
LAYOUTS = ['hero', 'portrait', 'metric', 'list', 'story']
LAYOUT_CN2 = {
    'medal': '勋章加冕', 'cert': '证书文书', 'vaxis': '竖轴题字', 'countdown': '倒计巨数', 'quote': '金句海报',
    'collage': '拼贴海报', 'diag': '对角斜切', 'film': '胶片条', 'bcast': '新闻字幕条', 'chart': '数据图表',
    'ticket': '票根券面', 'marquee': '灯箱招牌', 'press': '报纸头版', 'light': '舞台追光', 'ascent': '登顶轨迹',
    'tower': '数字塔', 'rings': '双环进度', 'ticker': '弹幕流', 'podium': '领奖台', 'stamp': '巨印盖章',
    'tear': '撕纸揭幕', 'lights': '点灯楼群', 'stars': '星图连线', 'bento': '门格拼版', 'wave': '声浪频谱',
}

LAYOUT_CN3 = {
    'passport': '证件页', 'blueprint': '蓝图', 'ledger': '账本', 'cassette': '磁带', 'telegram': '电报',
    'calendar': '日历', 'timeline': '横轴', 'orbit': '轨道', 'ribbon': '绶带', 'banner': '卷轴',
    'bars': '柱阵', 'radar': '雷达', 'gauge': '仪表', 'steps': '阶梯', 'scoreboard': '记分牌',
    'flip': '翻牌', 'docket': '小票', 'envelope': '信封', 'flag': '旗帜', 'arch': '拱门',
    'lantern': '灯笼', 'fan': '折扇', 'ink': '墨迹', 'mosaic': '马赛克', 'glitch': '故障',
    'neon': '灯管', 'spotlight': '追光', 'curtain': '幕布', 'split': '分屏', 'mirror': '镜像',
    'stack': '叠卡', 'carousel': '横卡', 'magnifier': '放大镜', 'wall': '相框墙', 'plaque': '铭牌',
    'trophy': '奖杯', 'laurel': '桂冠', 'crystal': '水晶', 'prism': '棱镜', 'clock': '表盘',
    'hourglass': '沙漏', 'compass': '罗盘', 'map': '路线图',
}
EN3 = {k: v for k, v in {
    'passport': 'PASSPORT', 'blueprint': 'BLUEPRINT', 'ledger': 'LEDGER', 'cassette': 'CASSETTE',
    'telegram': 'TELEGRAM', 'calendar': 'CALENDAR', 'timeline': 'TIMELINE', 'orbit': 'ORBIT',
    'ribbon': 'RIBBON', 'banner': 'SCROLL', 'bars': 'BARS', 'radar': 'RADAR', 'gauge': 'GAUGE',
    'steps': 'STEPS', 'scoreboard': 'SCOREBOARD', 'flip': 'FLIP', 'docket': 'DOCKET',
    'envelope': 'ENVELOPE', 'flag': 'FLAG', 'arch': 'ARCH', 'lantern': 'LANTERN', 'fan': 'FAN',
    'ink': 'INK', 'mosaic': 'MOSAIC', 'glitch': 'GLITCH', 'neon': 'NEON', 'spotlight': 'SPOTLIGHT',
    'curtain': 'CURTAIN', 'split': 'SPLIT', 'mirror': 'MIRROR', 'stack': 'STACK',
    'carousel': 'CAROUSEL', 'magnifier': 'LENS', 'wall': 'WALL', 'plaque': 'PLAQUE',
    'trophy': 'TROPHY', 'laurel': 'LAUREL', 'crystal': 'CRYSTAL', 'prism': 'PRISM',
    'clock': 'CLOCK', 'hourglass': 'HOURGLASS', 'compass': 'COMPASS', 'map': 'ROUTE',
}.items()}
SKIN_EN = {
    'aurora': 'AURORA', 'chrome': 'CHROME', 'neon': 'NEON', 'noir': 'NOIR', 'acid': 'ACID',
    'deco': 'DECO', 'kinetic': 'KINETIC', 'stadium': 'STADIUM', 'holo': 'HOLO', 'ink': 'INK',
    'riso': 'RISO', 'cinema': 'CINEMA', 'glass': 'GLASS',
}

# 每套模板的演示剧情：直接读 content/demo.json（文案的唯一来源）
CONTENT = json.load(open(os.path.join(ROOT, 'content', 'demo.json'), encoding='utf-8'))
SCENE = {}
for _tid, _c in CONTENT.items():
    if not _tid.startswith('u'):
        continue
    _m = _c.get('metric') or {}
    _dec = int(_m.get('decimals') or 0)
    try:
        _val = f"{float(_m.get('value', 0)):.{_dec}f}"
    except (TypeError, ValueError):
        _val = str(_m.get('value', ''))
    SCENE[_tid] = {
        'brand': _c.get('brand', ''),
        'title': _c.get('title', ''),
        'honoree': _c.get('honoree', ''),
        'award': _c.get('award', ''),
        'metric': f"{_val}{_m.get('unit', '')}",
    }

items = []
n = 0
for skin, body in fams:
    names = re.findall(r"'([^']*)'", body)
    for i, nm in enumerate(names):
        n += 1
        tid = f"u{n:02d}"
        img = os.path.join(SRC_IMG, f"{tid}.jpg")
        if os.path.exists(img):
            shutil.copyfile(img, os.path.join(PREV, f"{tid}.jpg"))
        vpath = os.path.join(VID, f"{tid}.mp4")
        sc = SCENE.get(tid, {})
        items.append({
            'id': tid, 'name': nm, 'en': ens[skin][i] if i < len(ens[skin]) else '',
            'skin': skin, 'family': META[skin][0], 'layout': LAYOUTS[i],
            'layoutCn': LAYOUT_CN[LAYOUTS[i]], 'color': META[skin][2],
            'video': os.path.exists(vpath),
            'sceneTitle': sc.get('title', ''), 'sceneHonoree': sc.get('honoree', ''),
            'sceneBrand': sc.get('brand', ''), 'sceneMetric': sc.get('metric', ''),
            'sceneAward': sc.get('award', ''),
        })

# ── 第二批 u66–u115：25 个新骨架 × 2 皮肤 ──
# SK2 与 SK3 行格式相同，正则会把两批都捞出来，必须按骨架白名单过滤，否则第二批会串到第三批
new_rows = [r for r in re.findall(r"\['(\w+)', '(\w+)', '([^']*)', '([^']*)'\]", text) if r[0] in LAYOUT_CN2]
assert len(new_rows) == 50, f'第二批行数应为 50，实际 {len(new_rows)}'
for idx, (kind, skin, nm, en) in enumerate(new_rows):
    tid = f"u{66 + idx}"
    img = os.path.join(SRC_IMG2, f"{tid}.jpg")
    if not os.path.exists(img):
        img = os.path.join(SRC_IMG, f"{tid}.jpg")
    if os.path.exists(img):
        shutil.copyfile(img, os.path.join(PREV, f"{tid}.jpg"))
    vpath = os.path.join(VID, f"{tid}.mp4")
    sc = SCENE.get(tid, {})
    items.append({
        'id': tid, 'name': nm, 'en': en, 'skin': skin,
        'family': META[skin][0], 'layout': kind,
        'layoutCn': LAYOUT_CN2.get(kind, kind), 'color': META[skin][2],
        'video': os.path.exists(vpath), 'batch': 2,
        'sceneTitle': sc.get('title', ''), 'sceneHonoree': sc.get('honoree', ''),
        'sceneBrand': sc.get('brand', ''), 'sceneMetric': sc.get('metric', ''),
        'sceneAward': sc.get('award', ''),
    })

print('templates', len(items))

# ── 第三批 u116–u200：43 个新骨架（42×2 + 1×1），皮肤分配以 templates.json 为准 ──
TPL = json.load(open(os.path.join(ROOT, 'content', 'templates.json'), encoding='utf-8'))
for row in TPL:
    tid = row['id']
    # u200 以 'u2' 开头，不能靠前缀筛批次，只能按数字比较
    if not (tid.startswith('u') and tid[1:].isdigit() and int(tid[1:]) >= 116):
        continue
    kind, skin = row['layout'], row['skin']
    img = os.path.join(SRC_IMG3, f"{tid}.jpg")
    if not os.path.exists(img):
        img = os.path.join(SRC_IMG2, f"{tid}.jpg")
    if not os.path.exists(img):
        img = os.path.join(SRC_IMG, f"{tid}.jpg")
    if os.path.exists(img):
        shutil.copyfile(img, os.path.join(PREV, f"{tid}.jpg"))
    vpath = os.path.join(VID, f"{tid}.mp4")
    sc = SCENE.get(tid, {})
    items.append({
        'id': tid, 'name': row['name'], 'en': f"{SKIN_EN.get(skin, skin.upper())} {EN3.get(kind, kind.upper())}",
        'skin': skin, 'family': META[skin][0], 'layout': kind,
        'layoutCn': LAYOUT_CN3.get(kind, kind), 'color': META[skin][2],
        'video': os.path.exists(vpath), 'batch': 3,
        'sceneTitle': sc.get('title', ''), 'sceneHonoree': sc.get('honoree', ''),
        'sceneBrand': sc.get('brand', ''), 'sceneMetric': sc.get('metric', ''),
        'sceneAward': sc.get('award', ''),
    })

print('total', len(items))

HTML = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>贺报宇宙 · __N__ 套通用贺报模板</title>
<style>
:root{--bg:#08080b;--panel:#101016;--line:rgba(255,255,255,.1);--ink:#f5f5f7;--dim:rgba(235,235,245,.62);--faint:rgba(235,235,245,.38);--accent:#e3c387}
*{box-sizing:border-box}
body{margin:0;background:radial-gradient(70% 50% at 50% 0%,#171225 0%,#08080b 62%);color:var(--ink);font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:1560px;margin:0 auto;padding:56px 44px 90px}
header{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;flex-wrap:wrap;padding-bottom:26px;border-bottom:1px solid var(--line)}
h1{margin:0;font-size:52px;letter-spacing:2px;font-weight:800;line-height:1.12}
h1 em{font-style:normal;background:linear-gradient(100deg,#fff,#e3c387 46%,#9ab6ff);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{margin-top:14px;color:var(--dim);font-size:16px;letter-spacing:.5px;line-height:1.8}
.stats{display:flex;gap:34px}
.stat b{display:block;font-family:"Oswald","Noto Sans SC";font-size:44px;font-weight:600;letter-spacing:1px}
.stat span{font-size:13px;letter-spacing:3px;color:var(--faint)}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin:30px 0 34px}
.chip{border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--dim);padding:9px 16px;border-radius:999px;font-size:13px;letter-spacing:1px;cursor:pointer;transition:.2s;display:flex;align-items:center;gap:8px}
.chip:hover{border-color:rgba(255,255,255,.3);color:#fff}
.chip.on{background:#fff;color:#0a0a0c;border-color:#fff}
.dot{width:8px;height:8px;border-radius:99px;display:inline-block}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
@media(max-width:1280px){.grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:900px){.grid{grid-template-columns:repeat(2,1fr)}.wrap{padding:30px 18px 60px}h1{font-size:34px}}
.card{position:relative;border-radius:16px;overflow:hidden;background:var(--panel);border:1px solid var(--line);cursor:pointer;transition:transform .35s cubic-bezier(.2,.7,.2,1),border-color .3s}
.card:hover{transform:translateY(-6px);border-color:rgba(255,255,255,.32)}
.thumb{position:relative;aspect-ratio:9/16;overflow:hidden;background:#000}
.thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.card:hover .thumb img{transform:scale(1.045)}
.tag{position:absolute;left:12px;top:12px;font-family:"Oswald","Noto Sans SC";font-size:11px;letter-spacing:2px;padding:5px 9px;border-radius:99px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(6px)}
.play{position:absolute;right:12px;bottom:12px;font-size:11px;letter-spacing:2px;padding:5px 9px;border-radius:99px;background:rgba(255,255,255,.9);color:#0a0a0c;font-weight:700}
.meta{padding:14px 16px 16px;display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.meta b{font-size:17px;letter-spacing:1px;font-weight:600}
.meta i{display:block;font-style:normal;font-size:10px;letter-spacing:2px;color:var(--faint);margin-top:4px;font-family:"Oswald","Noto Sans SC"}
.scene{display:block;margin-top:7px;font-size:11px;line-height:1.6;color:rgba(235,235,245,.5);letter-spacing:.3px;max-width:230px}
.kind{font-size:11px;color:var(--faint);border:1px solid var(--line);padding:4px 8px;border-radius:4px;white-space:nowrap}
.lb{position:fixed;inset:0;background:rgba(4,4,6,.92);backdrop-filter:blur(14px);display:none;z-index:50;align-items:center;justify-content:center;padding:30px}
.lb.on{display:flex}
.media img{max-height:86vh;max-width:44vw;border-radius:12px;box-shadow:0 30px 90px rgba(0,0,0,.6);display:block}
.media video{max-height:86vh;max-width:44vw;border-radius:12px;box-shadow:0 30px 90px rgba(0,0,0,.6);display:block;background:#000}
.verr{max-width:44vw;color:#ffd9a0;font-size:14px;line-height:1.9;background:rgba(255,217,160,.08);border:1px solid rgba(255,217,160,.3);border-radius:10px;padding:18px 22px}
.lbinfo{margin-left:48px;max-width:420px}
.lbinfo h2{font-size:34px;margin:0 0 6px;letter-spacing:2px}
.lbinfo .en{font-family:"Oswald";font-size:13px;letter-spacing:4px;color:var(--faint)}
.lbinfo p{color:var(--dim);font-size:14px;line-height:2}
.lbinfo code{background:rgba(255,255,255,.07);padding:3px 8px;border-radius:4px;font-size:12px;color:#ffd9a0}
.close{position:absolute;right:34px;top:26px;font-size:26px;color:var(--dim);cursor:pointer}
.topbtn{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(227,195,135,.45);background:rgba(227,195,135,.1);color:#f0d9a8;padding:11px 18px;border-radius:999px;font-size:13px;letter-spacing:1.5px;cursor:pointer;transition:.2s}
.topbtn:hover{background:#e3c387;color:#14100a;border-color:#e3c387}
.edit{position:absolute;right:11px;top:11px;z-index:2;font-size:11px;letter-spacing:2px;padding:5px 10px;border-radius:99px;background:rgba(10,10,14,.7);border:1px solid rgba(255,255,255,.28);backdrop-filter:blur(6px);color:#fff;cursor:pointer;opacity:0;transition:.22s}
.card:hover .edit{opacity:1}
.edit:hover{background:#e3c387;color:#14100a;border-color:#e3c387}
.drawer{position:fixed;inset:0;z-index:60;display:none;flex-direction:column;padding:22px 26px 26px;background:rgba(6,6,9,.9);backdrop-filter:blur(12px)}
.drawer.on{display:flex}
.dbar{display:flex;align-items:center;gap:14px;padding:0 2px 12px;color:var(--dim);font-size:13px;letter-spacing:1px}
.dbar b{color:#fff;font-size:16px;letter-spacing:1px}
.dbar .sp{flex:1}
.dbtn{color:#ffd9a0;border:1px solid rgba(255,217,160,.35);background:transparent;padding:7px 13px;border-radius:8px;cursor:pointer;font-size:12px;letter-spacing:1px;font-family:inherit}
.dbtn:hover{background:rgba(255,217,160,.14)}
.dframe{position:relative;flex:1;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#0b0b10}
.dframe iframe{width:100%;height:100%;border:0;display:block}
.dhint{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;padding:40px;color:var(--dim);font-size:14px;line-height:2}
.dhint.on{display:flex}
.dhint b{color:#fff;font-size:18px;letter-spacing:1px}
.dhint code{background:rgba(255,255,255,.08);padding:9px 16px;border-radius:8px;color:#ffd9a0;font-size:13px;letter-spacing:.5px;font-family:"Oswald","Noto Sans SC",monospace}
footer{margin-top:54px;padding-top:26px;border-top:1px solid var(--line);color:var(--faint);font-size:13px;line-height:2;letter-spacing:.5px}
</style>
</head>
<body>
<div class="wrap">
<header>
  <div>
    <h1>贺报宇宙 <em>UNIVERSE 200</em></h1>
    <div class="sub">13 套视觉体系 × 73 种叙事结构 · 200 套模板 · 任意行业通用 · 1080×1920 / 8s / 60fps<br/>科技 · 金融 · 电竞 · 地产 · 电商 · 文化 · 物流 · 体育 · 医疗 · 教育 · 制造 · 能源 · 美妆</div>
  </div>
  <div class="stats">
    <div class="stat"><b>__N__</b><span>TEMPLATES</span></div>
    <div class="stat"><b>13</b><span>VISUAL SYSTEMS</span></div>
    <div class="stat"><b>73</b><span>STRUCTURES</span></div>
    <div style="display:flex;align-items:flex-end"><div class="topbtn" onclick="openStudio('')">✎ 改文案出片</div></div>
  </div>
</header>
<div class="chips" id="chips"></div>
<div class="grid" id="grid"></div>
<footer>贺报宇宙 · 通用贺报视频系统 ｜ 模板 id 即 Remotion composition id，可 --props 覆写全部文案与数字 ｜ 数据口径与合规小字请在 footnote 中按行业替换</footer>
</div>
<div class="lb" id="lb">
  <span class="close" onclick="closeLb()">✕</span>
  <div class="media" id="lbmedia"></div>
  <div class="lbinfo">
    <h2 id="lbtitle"></h2>
    <div class="en" id="lben"></div>
    <p id="lbdesc"></p>
  </div>
</div>
<div class="drawer" id="drawer">
  <div class="dbar">
    <b id="dtitle">出片台</b>
    <span id="dsub">改文案 → 只渲这一支（约 40–90 秒），其它 199 支原样不动</span>
    <span class="sp"></span>
    <button class="dbtn" onclick="loadStudio()">重新加载</button>
    <button class="dbtn" onclick="openStudioTab()">新标签打开</button>
    <button class="dbtn" onclick="closeStudio()">关闭 ✕</button>
  </div>
  <div class="dframe">
    <iframe id="dframe" title="出片台" src="about:blank"></iframe>
    <div class="dhint" id="dhint">
      <b>出片台没在运行</b>
      <div>成片是 mp4，文字已经烧成像素，所以"改字"要重新渲这一支——需要在本机起一个小服务。</div>
      <div>① 双击交付目录里的 <code>启动出片台.bat</code>（Mac 用 <code>启动出片台.command</code>）<br/>② 或手动执行下边这行，看到「打开 http://127.0.0.1:8788」后点「重新加载」</div>
      <code id="dcmd">cd /d F:\\workbuddy\\hebao-remotion &amp;&amp; npm run make</code>
      <div style="font-size:12px;color:var(--faint)">服务起来后这里会自动连上，不用刷新；也可以直接点「重新加载」</div>
    </div>
  </div>
</div>
<script>
const DATA = __DATA__;
const META = __META__;
let cur = 'all';
const chips = document.getElementById('chips');
const grid = document.getElementById('grid');
function chip(label, key, color){
  const el = document.createElement('div');
  el.className = 'chip' + (cur===key?' on':'');
  el.innerHTML = (color?`<span class="dot" style="background:${color}"></span>`:'') + label;
  el.onclick = ()=>{cur=key;render();};
  return el;
}
function render(){
  chips.innerHTML='';
  chips.appendChild(chip(`全部 · ${DATA.length}`,'all'));
  chips.appendChild(chip(`第二批 · 50`,'b2'));
  chips.appendChild(chip(`第三批 · 85`,'b3'));
  Object.entries(META).forEach(([k,v])=>chips.appendChild(chip(v[0],k,v[2])));
  const list = DATA.filter(d=>cur==='all'|| (cur==='b2'? d.batch===2 : cur==='b3'? d.batch===3 : d.skin===cur));
  grid.innerHTML = list.map(d=>`
    <div class="card" onclick="openLb('${d.id}')">
      <div class="thumb">
        <img src="previews/${d.id}.jpg" loading="lazy" alt="${d.name}"/>
        <div class="tag" style="color:${d.color}">${d.id.toUpperCase()} · ${d.layoutCn}</div>
        <div class="edit" onclick="event.stopPropagation();openStudio('${d.id}')">✎ 改这套</div>
        ${d.video?'<div class="play">▶ 视频</div>':''}
      </div>
      <div class="meta"><div><b>${d.name}</b><i>${d.en}</i><span class="scene">${d.sceneTitle} · ${d.sceneHonoree}</span></div><div class="kind">${d.family}</div></div>
    </div>`).join('');
}
function openLb(id){
  const d = DATA.find(x=>x.id===id);
  const m = document.getElementById('lbmedia');
  if(d.video){
    m.innerHTML =
      `<video src="videos/${d.id}.mp4" controls autoplay loop playsinline></video>`+
      `<div class="verr" style="display:none">此预览环境加载不了本地视频文件。<br/>请关闭预览，到文件夹里<b>右键 gallery.html → 用 Chrome / Edge 打开</b>，即可正常播放 __VIDEOS__ 支成片。</div>`;
    const v = m.querySelector('video');
    v.onerror = () => { v.style.display='none'; m.querySelector('.verr').style.display='block'; };
  } else {
    m.innerHTML = `<img src="previews/${d.id}.jpg" alt=""/>`;
  }
  document.getElementById('lbtitle').textContent = d.name;
  document.getElementById('lben').textContent = d.en;
  document.getElementById('lbdesc').innerHTML =
    `视觉体系：${d.family}<br/>叙事结构：${d.layoutCn}<br/>Composition ID：<code>${d.id}</code><br/><br/>`+
    `演示剧情：${d.sceneBrand}<br/>${d.sceneTitle} · ${d.sceneHonoree} ｜ ${d.sceneMetric}<br/>`+
    (d.video?`▶ 成片已就绪，点开即可播放`:`成片：<code>videos/${d.id}.mp4</code>（按需渲染）`)+
    `<br/><br/><button class="dbtn" onclick="closeLb();openStudio('${d.id}')">✎ 改这套文案 · 直接出片</button>`;
  document.getElementById('lb').classList.add('on');
}
function closeLb(){
  document.getElementById('lb').classList.remove('on');
  document.getElementById('lbmedia').innerHTML = '';
}
/* ── 出片台（编辑文案 → 只渲这一支）────────────────────────── */
const STUDIO = 'http://127.0.0.1:8788';
let studioId = '';
let studioTimer = null;
let studioTries = 0;
function openStudio(id){
  studioId = id || '';
  document.getElementById('dtitle').textContent = id ? `编辑 ${id.toUpperCase()}` : '出片台';
  document.getElementById('drawer').classList.add('on');
  loadStudio();
}
function loadStudio(auto){
  const f = document.getElementById('dframe');
  const hint = document.getElementById('dhint');
  if(!auto){ hint.classList.remove('on'); studioTries = 0; }
  clearTimeout(studioTimer);
  const q = studioId ? '?id=' + studioId + (auto ? '&r=' + Date.now() : '') : (auto ? '?r=' + Date.now() : '');
  try { f.src = STUDIO + '/' + q; } catch(e){}
  studioTimer = setTimeout(()=>{
    hint.classList.add('on');
    /* 服务是后面才双击启动的：自动重试，起来就自己连上 */
    if(studioTries < 20){ studioTries++; setTimeout(()=>loadStudio(true), 2500); }
  }, auto ? 2600 : 4200);
  f.onload = ()=>{ clearTimeout(studioTimer); studioTries = 0; hint.classList.remove('on'); };
}
function openStudioTab(){
  window.open(STUDIO + '/' + (studioId ? '?id=' + studioId : ''), '_blank');
}
function closeStudio(){
  document.getElementById('drawer').classList.remove('on');
  document.getElementById('dframe').src = 'about:blank';
}
document.getElementById('lb').onclick = (e)=>{ if(e.target.id==='lb') closeLb(); };
document.onkeydown = (e)=>{ if(e.key==='Escape'){ closeLb(); closeStudio(); } };
render();
</script>
</body>
</html>
"""

html = HTML.replace('__DATA__', json.dumps(items, ensure_ascii=False)).replace(
    '__META__', json.dumps({k: v for k, v in META.items()}, ensure_ascii=False)).replace(
    '__VIDEOS__', str(len([i for i in items if i['video']]))).replace('__N__', str(len(items)))
open(os.path.join(OUT, 'gallery.html'), 'w', encoding='utf-8').write(html)
print('gallery ->', os.path.join(OUT, 'gallery.html'))
