# 泰康养老 · 业绩贺报视频生成器

Remotion 驱动的竖屏贺报视频工程：**101 套模板 × 可配置数据 × 确定性渲染**，
1080×1920 · 8 秒 · 60fps · 自带底乐/音效/语音播报（可选）。

---

## 一、快速开始

```bash
npm install              # 首次安装
npm run studio           # 打开可视化编辑器（推荐，改数据即时预览）
npm run typecheck        # 类型检查
```

### 渲染一条视频

```bash
# 基础用法：模板 id + 输出路径
npx remotion render honor out/我的贺报.mp4 --concurrency=2 --timeout=120000

# 使用自定义数据文件渲染（先在 studio 里调好，或手写 JSON）
npx remotion render gs-impact out/十月首爆.mp4 --props=src/data/my-props.json --concurrency=2 --timeout=120000
```

> ⚠️ **必须带 `--concurrency=2`**：并发更高会触发 Chrome 内存溢出。
> ⚠️ **必须带 `--timeout=120000`**：高负载机器上浏览器连接慢，默认 25 秒不够。
> 另：`node_modules/@remotion/renderer/dist/open-browser.js` 中的 `timeout: 25000`
> 已本地补丁为 `120000`，**npm install 后需重打**：
> `sed -i 's/timeout: 25000,/timeout: 120000,/' node_modules/@remotion/renderer/dist/open-browser.js`

### 可视化编辑（改内容不改代码）

1. 运行 `npm run studio`，浏览器自动打开；
2. 左侧选任意模板，右侧 **Props 面板**直接改 JSON（标题、数字、名单……），画布实时预览；
3. 调好后点面板右上角菜单 **Export props**（或复制 JSON）存为 `my-props.json`；
4. 用上面的 `--props=` 命令渲染成片。

---

## 二、数据字段字典（HebaoProps）

完整定义见 `src/data/types.ts`（含全部字段的默认值示例）。高频字段：

| 字段 | 说明 | 示例 |
|---|---|---|
| `theme` | 主题色 | `hongjin` 红金 / `shenmo` 深墨 / `lanjin` 蓝金 / `feicui` 翡翠 |
| `brand` | 顶部品牌条 | `泰康养老 · 个险渠道` |
| `slogan` | 首屏宣言（2~4 字最佳） | `捷报频传` |
| `slogan2` | 定版主标题（4 字左右） | `再攀高峰` |
| `endsub` | 定版副语 | `荣耀属于奋斗者` |
| `name` / `role` / `pill` | 姓名 / 职务 / 荣誉标签 | `李静怡` / `高级业务经理 · 杭州三区` / `MDRT · 2026 年度会员` |
| `dlabel` | 大数字说明标签 | `十月个人承保保费` |
| `premium` | 核心数字（万元） | `286.5` |
| `delta` | 环比同比文案 | `环比 +38.2%　｜　同比 +112.6%` |
| `stats` | 三项战报 `{v 数值, k 标签, hl 金色}` | `[{v:'42',k:'承保件数'},…]` |
| `roster` | 名单 `{name, org, value, hl}`，**第 1 条即冠军** | 见默认数据 |
| `items` | 通用条目 `{k, v, d}` | 战果清单 / 明细 |
| `nodes` | 节点序列 `{label, value, note}` | 时间轴 / 阶梯 |
| `photo` / `qr` | 人物照片 / 二维码图片路径（相对 `public/`） | `assets/photos/li.jpg` |
| `voice` / `voiceStart` | 语音播报 wav（相对 `public/`）与开始秒数 | `assets/voices/zhangsan.wav` |
| `dateText` / `note` | 日期与合规小字（**数字必须带口径，合规红线**） | 见默认数据 |

低频专属字段（`rankings` / `mix` / `goalCells` / `retro` / `badges` / `bubbles` /
`versusA/B` / `radar` / `steps` / `hero` / `ribbon` 等）只被对应模板读取，
不传则模板自行兜底——见 `types.ts` 内注释。

---

## 三、模板总表（101 套 · 13 类）

| 分类 | 模板（id · 名称） |
|---|---|
| **仪式贺报** | honor 喜庆红金 · battle 战报仪式 · scroll 鎏金卷轴 · medal 勋章功勋 · silk 喜报红绸 · honorpro 红金PRO演示 |
| **巨字排版** | giant 巨字宣言 · vertical 竖排书法 · news 号外头条 · quote 金句箴言 · ticket 荣誉存根 · flash 数字快闪 |
| **数据图表** | split 今昔对比 · ring 目标冲刺 · bars 柱状战力 · gauge 仪表冲刺 · calendar 全勤日历 · radar 五维战力 · checklist 战果清单 · total 年度累计 · mosaic 像素战报 · share 占比称雄 · kpi 数据长卷 |
| **荣誉榜单** | ranking 榜单风云 · podium 领奖台 · trophy 金杯荣耀 · star 五星认证 · crown 王者加冕 · grid 九宫战绩 · cert 荣誉奖状 · dossier 荣誉档案 |
| **历程故事** | timeline 足迹时间轴 · path 冠军之路 · tenure 司龄荣光 · letter 感谢信 · polaroid 拍立得 · film 胶片时刻 · ladder 进阶阶梯 |
| **团队招募** | team 团队荣耀 · duo 双星联贺 · invite 诚邀入伙 |
| **创意场景** | rocket 冲天火箭 · elevator 业绩电梯 · subway 荣耀地铁 · firework 烟花礼赞 · domino 多米诺 · chat 捷报弹屏 · cube 战绩魔方 · coin 鎏金铸币 · led 户外大屏 · origami 纸飞机航线 |
| **创意风格** | ink 水墨丹青 · papercut 剪纸窗花 · neon 霓虹招牌 · terminal 复古终端 · blueprint 工程蓝图 · score 成绩放榜 · bankbook 存折入账 · mahjong 天胡开局 · constellation 星座加冕 · thermo 业绩温度 |
| **新人成长** | firstorder 首单破冰 · streak 连续达成 · achieve 成就解锁 · hundreddays 新人百日 · graduate 结业通关 |
| **团队协作** | relay 薪火接力 · versus 红蓝对战 · expand 增员裂变 · mentor 师徒传承 · morning 早会播报 |
| **客户服务** | claim 理赔送达 · clientvoice 客户见证 · thanks 答谢客户 · service 服务年报 · referral 转介绍图谱 |
| **经营复盘** | portfolio 产品结构 · income 收入构成 · goalbreak 目标拆解 · review 季度复盘 · kickoff 开门红动员 |
| **典藏系列**（GSAP 手法移植版：逐字砸入 / 描线 / stagger / 品牌缓动） | gs-impact 冲击巨字 · gs-curtain 双幕启幕 · gs-beacon 灯塔聚能 · gs-aurora 流金极光 · gs-medalwall 勋章墙 · gs-spotlight 追光亮相 · gs-goldframe 鎏金画框 · gs-engine 数字引擎 · gs-nameflow 星光名单（龙虎榜） · gs-monolith 丰碑铭刻 · gs-laurel 桂冠加冕 · gs-banner 锦旗贺 · gs-crystal 水晶奖杯 · gs-ascent 峰线攀登 · gs-pulse 星芒爆发 · gs-gazette 钤印官报（号外） · gs-ribbon 绶带飞扬 · gs-galaxy 星轨环绕 · gs-herald 号角启幕 · gs-capsule 时光胶囊 |

每套模板的叙事结构说明见 `src/templates/registry.tsx` 中各条目的 `note` 字段。

---

## 四、目录结构

```
hebao-remotion/
├── src/
│   ├── Root.tsx               # composition 注册（每套模板一个 id）
│   ├── theme.ts               # 4 套主题色 + 字体（Noto Sans/Serif SC + Oswald）
│   ├── data/
│   │   ├── types.ts           # 数据契约 + 默认数据（改默认内容就在这）
│   │   └── …
│   ├── lib/                   # anim（缓动/插值/rgba）、useT、curve 等
│   ├── anim/                  # GSAP 移植层：easings 品牌缓动、stagger
│   ├── components/            # 共享组件：Stage/GoldText/EndCard/NumRoll/
│   │                          #   SplitReveal(逐字)/DrawLine(描线)/Sfx/textures(质感)
│   └── templates/             # 81 套经典模板 + gs/ 20 套典藏系列
├── public/assets/
│   ├── sfx/                   # 6 个合成音效（纯代码生成，可换）
│   ├── bgm/                   # 底乐（gen_bgm.js 生成）
│   └── voices/                # 语音播报 wav（外部 TTS 预生成，可选）
├── tools/
│   ├── gen_sfx.js             # 音效合成器（仪式感音色：stamp/gong/chime/pop/whoosh/shimmer）
│   ├── gen_bgm.js / gen_beds.js # 底乐合成
│   └── TTS使用说明.md          # VoxCPM 本地语音预生成流程
└── out/                       # 渲染成片
```

---

## 五、常见定制

| 想做什么 | 怎么做 |
|---|---|
| 改文案 / 数字 / 名单 | `npm run studio` 里改 Props（推荐）；或改 `src/data/types.ts` 的 `DEFAULT_PROPS` |
| 换人物照片 / 二维码 | 图片放 `public/assets/photos|qr/`，props 里 `photo` / `qr` 填相对路径（不传用内置占位） |
| 换主题色 | props `theme` 四选一；改色值在 `src/theme.ts` |
| 换语音播报 | 按 `tools/TTS使用说明.md` 预生成 wav 放 `public/assets/voices/`，props 传 `voice` |
| 换音效音色 | 改 `tools/gen_sfx.js` 参数 → `node tools/gen_sfx.js` 重新生成 wav |
| 换底乐 | `tools/gen_bgm.js` 或直接替换 `public/assets/bgm/` 下音频 |
| 定版逐字动画开关 | EndCard 现全库默认开启 `splitTitle` / `drawLine`；某套想关掉，在该模板的 `<EndCard>` 上传 `splitTitle={false}` |
| 新增一套模板 | 复制 `src/templates/` 里结构最接近的一套 → 改内容与版式 → 在 `registry.tsx` 注册 → 在 `Root.tsx` 加 composition |
| 调全局动画手感 | 典藏系列改 `src/anim/easings.ts` 的 `EASE` 品牌词表（一处改、全库生效） |
| 调字号 | 典藏系列正文主力 40~48px、小注 ≥34px、大数字 100px+（1080 宽竖屏的最低可读基准）；改单套直接改该模板 `Txt size` |

> **字号红线（2026-11 复核）**：1080×1920 竖屏上，中文小于 34px 在手机上不可读。
> 典藏系列曾因正文 28~34px 被打回，已整体放大约 40%；新增/改版式时勿低于该基准。

---

## 六、渲染纪律（重要）

1. **`--concurrency=2`** —— 更高并发在 16G 内存机器上会 OOM；
2. **`--timeout=120000`** —— 配合 open-browser 补丁，避免高负载下浏览器连接超时；
3. 渲染时**不要关掉弹出的无头 Chrome 窗口**（那是渲染进程，不是你的浏览器）;
4. 单支成片约 2~4 分钟（8 秒 × 60fps = 482 帧）。

## 七、合规红线

- 所有数字必须带**口径与时间范围**（props `note` 字段已内置默认：数据口径 · 2026 年 10 月 · 个险渠道新单保费 · 仅用于内部表彰）；
- 成片仅用于**内部表彰**场景，对外传播前需经合规审核。
