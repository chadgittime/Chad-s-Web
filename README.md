# 郭悦洋作品集 — Project Context for AI Agents

> **工作目录**：本 `README.md` 所在文件夹（`作品集/`）  
> **入口文件**：`index.html`，双击在浏览器中打开即可浏览全部作品  
> **最后更新**：2026-08-07（本轮修改：三部分 Letter Cascade banner 与 P2 日历布局）

本文档面向后续接手本项目的任何 AI agent。请**完整阅读后再动手修改**，不要假设任何未写明的上下文。

---

## 版权与用途

本作品集中所有作品（视频、海报、推送、长图）均来自作者 2025-2026 年间在北京朝阳融媒体中心的公开工作产出。所有作品均为公开政务新媒体内容，不涉及保密信息。**作品集唯一且仅作真实个人求职用途**。

---

## 文件结构

```
作品集/
├── index.html              ← 主页面（入口）
├── p1-video/
│   ├── index.html          ← P1 · 视频作品集（14 段电影时间轴）
│   ├── 01.jpg … 14.jpg     ← 封面缩略图（14 张）
│   ├── 01.mp4 … 14.mp4     ← 预览视频（14 段，自动播放 5 秒静音，约 2-5 MB）
│   └── full/
│       └── 01.mp4 … 14.mp4 ← 完整视频（14 段，点击弹窗播放，约 6-130 MB）
├── p2-poster/
│   ├── index.html          ← P2 · 海报作品集（11 个项目 18 张作品）
│   ├── *.png / *.jpg / *.gif / *.webp  ← 海报素材（约 110 个文件）
│   └── 2025xxxx_统筹_xxx/  ← 各项目子文件夹（共 11 个）
├── p3-push/
│   ├── index.html          ← P3 · 推送内容供给判断
│   ├── 报审汇总.xlsx        ← 原始数据（网页渲染用的数据内嵌在 HTML 中）
│   └── *.png / *.svg       ← 图表素材
└── README.md               ← 本文件
```

---

## ⚠️ 关键理解：主页面 ≠ 全部内容（必读）

**`index.html` 只包含：**
- 第一屏 Hero（Yueyang Guo ↔ Portfolio 形变，固定在首屏中间，滚动后自然消失）
- 三个 `iframe` 标签；各子页面内部各自渲染 Letter Cascade 板块横幅
- 板块之间的红色分隔线

**`index.html` 不包含：**
- P1 / P2 / P3 板块的任何内容、样式、JS

**结论：修改内容或视觉风格时，必须去对应的子文件夹改对应的 HTML**。

### 修改路由表

| 你要改什么 | 应该改哪个文件 | 搜什么 |
|------------|----------------|--------|
| Hero 形变文字（词语、速度） | `index.html` | `WORDS`、`INTERVAL` |
| Hero 字体 | `index.html` | `.morph { font-family` |
| Hero 背景 | `index.html` | `.hero { background` |
| 板块横幅文字/翻页动效 | 对应 P1 / P2 / P3 子页面 | `data-letter-cascade`、`data-cascade-text` |
| 板块分隔线 | `index.html` | `.folio-section { border-top` |
| P1 视频内容/配色/布局 | `p1-video/index.html` | `:root`、`WORKS` 数组 |
| P1 媒体文件 | `p1-video/*.jpg`、`p1-video/*.mp4` | 直接替换，保持编号 |
| P1 滚动判定范围 | `p1-video/index.html` | `filmViewport.addEventListener` |
| P2 海报内容/布局 | `p2-poster/index.html` | `projects` 数组 |
| P3 推送数据 | `p3-push/index.html` | `RAW_DATA` |
| P3 主页面滚动/高度同步 | `index.html` + `p3-push/index.html` | `p3Frame`、`is-embedded-flat`、`portfolio:p3-height` |
| iframe 路径 | `index.html` | `iframe src` |

### 风格统一时改什么

| 统一项 | `index.html` | `p1-video` | `p2-poster` | `p3-push` |
|--------|:-----------:|:----------:|:-----------:|:---------:|
| 背景色 | `.hero` / `.folio-section` | `:root --paper` | `:root --paper` | `:root` |
| 正文字体 | `body` | `body` | `--sans` | `:root` |
| 红色主色 | `:root --red` | `:root --signal` | `:root --red` | `:root --red` |

---

## 技术架构

- **纯静态**：零框架，双击 `index.html` 即可浏览
- **iframe 嵌入**：三个板块独立 CSS/JS，互不冲突
- **相对路径**：所有媒体文件通过 `./` 引用，无需网络（仅 Google Fonts CDN 是外部依赖）
- **P1 原是 React 项目**，已移植为纯 HTML；`npm install` 无效

---

## 主页面 `index.html`

### 屏幕结构

```
第一屏：Hero（100vh）
  └─ "Yueyang Guo" ↔ "Portfolio" 形变
     文字在首屏内居中，滚动后自然消失
     position: absolute，属于 .hero 子元素

第二屏：P1 · 我制作的视频 + 红色分隔线
  └─ iframe → p1-video/index.html

第三屏：P2 · 我制作的海报 + 红色分隔线
  └─ iframe → p2-poster/index.html

第四屏：P3 · 我制作的推送 + 红色分隔线
  └─ iframe → p3-push/index.html
```

### 板块分隔线

每个 `.folio-section` 有 `border-top: 2px solid var(--red)`（`#e4002b`），三条红线间距一致。

### 板块横幅

主页面不再叠加 `.section-banner`。P1 / P2 / P3 各自在正常文档流中使用 Letter Cascade banner：进入视口自动播放一次，悬停、键盘聚焦或回车/空格可重播；系统启用“减少动态效果”时保持静态文字。动效为纯 HTML/CSS/JS，不依赖 React 或 Framer Motion。

### Hero 形变文字（Text Morph）

- 字体：`ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace`
- 配置：`WORDS = ["Yueyang Guo", "Portfolio"]`，`INTERVAL = 1300`，`MORPH_DURATION = 680`
- **没有滚动联动**：文字只在首屏内居中显示，滚动后自然消失。之前曾有一个"滚动后飞到左上角"的效果，已被彻底删除（整个 Part 2 JS 已移除）
- **不再用 Bauhaus 93**

### Hero 背景

白色底色 + Signal Editorial 工程网格（细横竖线），无装饰性角标文字。

---

## P1 `p1-video/index.html`

### 滚动机制（重要）

**已从页面级滚动改为容器内独立滚动**：`filmViewport` 有 `overflow-y: auto` + 内部 780vh 透明柱子。只有在这个区域滚轮才会驱动时间线平移。主页面、P2、P3 的滚动不会触发 P1 时间线。

轨道容器 `track-shell` 是 `position: sticky; top: 0`，始终粘在视口顶部不随滚动位移。

### 已删除的内容

- Closing 区域（"十四次记录 / 从头再看"）——HTML/CSS/JS 三处已全部删除
- `.site-header` 的 `border-top` 和 `border-bottom`——分隔线改由主页面统一处理

### 媒体文件路径

- 封面：`./01.jpg` … `./14.jpg`
- 预览：`./01.mp4` … `./14.mp4`
- 完整版：`./full/01.mp4` … `./full/14.mp4`

---

## P2 `p2-poster/index.html`

11 个项目共 18 张海报。左侧日期导航 + 右侧图片展示 + 档案索引卡。

顶部为两行结构：第一行是“我制作的海报” Letter Cascade banner；第二行是日期/海报日历，独占一行并从左到右 100% 通铺。下方作品舞台和档案索引卡保持原布局。

图片路径由 JS 函数 `getAssetPath(project, file)` 动态生成，格式 `./${projectFolder}/${filename}`。子文件夹名格式：`日期_统筹_项目标题`。

---

## P3 `p3-push/index.html`

498 条推送数据可视化。原 9 个顶部导航锚点已取消，改为“我制作的推送” Letter Cascade banner；正文保留滚动驱动动画、日历热力图和 KPI 面板。数据内嵌在 HTML 的 `<script>` 中，不依赖 `.xlsx`。

- 单独打开 `p3-push/index.html`：保留原来的 sticky 滚动叙事。
- 从主 `index.html` 浏览：P3 自动进入 `is-embedded-flat` 模式，取消 sticky 折叠并将全部内容平铺；子页通过 `postMessage` 上报高度，主页面据此扩展 `#p3-push`，因此只有主页面一条滚动轴。

---

## 禁止事项

- **不要**只改 `index.html` 就以为能改子板块样式
- **不要**合并三个板块的 CSS
- **不要**用 `npm` / React / 构建工具
- **不要**硬编码绝对路径
- **不要**自行重建历史目录结构（`视频/`、`海报/`、`推送/`、`最终呈现/`）
- **不要**重新给 P1 加窗口级滚动监听（`window.addEventListener("scroll")`）
- **不要**复活已删除的 P1 closing 区域

---

## 测试方法

1. 双击 `index.html` 在浏览器打开
2. 验证：①第一屏形变正常 ②P1/P2/P3 分别显示“我制作的视频/海报/推送”翻页横幅 ③P2 日期日历在横幅下一行全宽通铺 ④P1 时间线滚动仅在卡片区生效 ⑤P3 无顶部导航、无内部滚动条且内容不折叠 ⑥控制台零报错
