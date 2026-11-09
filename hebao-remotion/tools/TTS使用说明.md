# 可选语音播报（TTS）使用说明

贺报视频支持可选的真人声播报。**这是可选项**：不配置时视频完全正常，
配置了就在 8 秒成片里叠加一句播报（底乐自动闪避给人声让位）。

## 一、生成播报音频（用本机 VoxCPM 工具）

本机工具：`D:\tools\yzylauncher-win-voxcpm20-260705`（VoxCPM 2.0，Electron 启动器）

1. 双击 `启动.bat` 打开工具（首次运行会下载模型到 `hf_download/`，需要耐心等待）
2. 在页面输入播报文案，建议格式（8 秒视频，文案控制在 18 字以内）：
   - `恭喜李静怡，十月个人承保保费二百八十六万。`
   - `恭贺杭州三区团队，十月目标达成率百分之二百一十八。`
3. 生成后点下载按钮，或到【工具】→【输出目录】拷贝 wav 文件

> 进阶：工具运行中会起一个本地 Gradio 服务（内部有 /generate 接口），
> 可在浏览器 F12 看到实际端口后用脚本批量生成——不保证版本稳定，批量需求建议逐条 GUI 生成。

## 二、放入工程

把生成的 wav 放到：

```
F:\workbuddy\hebao-remotion\public\assets\voices\你的文件.wav
```

## 三、渲染时启用

**方式 A · 命令行出片（推荐批量）**：写一个 props JSON，例如 `voice.json`：

```json
{
  "voice": "assets/voices/lijingyi.wav",
  "voiceStart": 0.6
}
```

然后：

```
npx remotion render honorpro out/李静怡_月度之星.mp4 --props=voice.json --crf=16 --concurrency=2
```

**方式 B · Remotion Studio（localhost:3000）**：
左侧选中模板 → Props 面板找到 `voice` 填路径、`voiceStart` 填秒数 → 实时试听。

## 四、参数说明

| 字段 | 默认 | 说明 |
|---|---|---|
| `voice` | 不填（无播报） | 音频路径，相对 `public/` 目录 |
| `voiceStart` | 0.6 秒 | 播报开始时刻，建议等开场大字落定（0.6~1.2） |

## 五、行为约定

- 不传 `voice`：任何机器渲染都不受影响（这正是做成可选项的原因——一线电脑没装 TTS 工具也能出片）
- 传了 `voice`：底乐音量自动从 0.5 降到 0.18（闪避），播报结束底乐继续
- 播报文案时长请 ≤ 7 秒，超过会被片尾截断
