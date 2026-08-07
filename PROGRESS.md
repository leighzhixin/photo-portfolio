# PROGRESS.md - 进度与踩坑记录

### 2026-07-22
- Roadside Picnic 页面换图：替换为 32 张新照片，按首字母分组排列，同字母并列一行、单字母独占一行，全部右对齐
- 新增 `series.css` 中 `.series-photo-row` / `.series-photo-row--double` / `.series-photo-row--single` 样式规则

> 每次任务结束后追加一条。格式见文末"维护说明"。
> 只记关键信息：做了什么、踩了什么坑、下次注意什么。

## 项目概况

- 摄影作品集网站，纯原生 HTML/CSS/JS
- 部署在 Vercel，仓库 62 次提交（截至 2026-07-09）
- 设计参考：cargocollective.com/zheis、sevenliang.com
- 核心页面：首页轮播、Works 系列、Blog、About、Contact

## 进度时间线
### 2026-08-08
- 重构项目知识管理：将 `CLAUDE.md` 的流程整合进 Codex 自动识别的 `AGENTS.md`，并将 `README.md` 改为唯一项目入口与按需阅读导航
- 后续文档按实际长期需求创建，不预建空文件；新会话按单一任务工作，完成后只沉淀有效的长期知识

### 2026-08-05
- 启用 Vercel Speed Insights：17 个 HTML 文件添加 `/_vercel/speed-insights/script.js` script 标签
- 全站启用 Vercel Web Analytics：17 个 HTML 文件（含模板）添加 `/_vercel/insights/script.js` script 标签
  - 纯 HTML 站点不走 Next.js 的 npm 包 + React 组件方式，直接用 Vercel 托管的 script 端点

### 2026-07-24
- Nai Nai 系列：从桌面 Grandma 重新上传 29 张照片，按 01-29 顺序排列，scroll-snap 全屏画廊保持不变

### 2026-07-23
- Nai Nai 系列页：从桌面 Grandma 文件夹上传 15 张照片，按顺序排列，统一单行布局 + lightbox 预览
- 样式对齐 roadside picnic 页：固定标题右上角、series.css 统一样式


### 2026-07-09
- 建立 AGENTS.md（偏好积累）、PROGRESS.md（进度与踩坑）、CLAUDE.md（自动加载指令）
- 三文档分工：AGENTS.md 管"该怎么做"，PROGRESS.md 管"做过什么"，CLAUDE.md 管"流程怎么走"
- CLAUDE.md 确保每次新对话自动读取规范，用户无需手动提醒
- 踩坑：`.codex/` 目录写入被沙盒限制，改用根目录 `CLAUDE.md` 作为自动加载入口

### 2026-07-09
- 建立 AGENTS.md（偏好积累）和 PROGRESS.md（本文档）
- 设立底层 agent 命令规范，每次任务后更新进度

### 2026-07-06 ~ 07
- Blog 页面移动端适配：修复导航 toggle 不工作（缺 main.js）、顶部 padding 重叠、左右边距不均
- 首页轮播换图：替换为首图文件夹 32 张，手动挑选 8 张
- 全站名称统一为 LI ZHIXIN（全大写）

### 2026-07-05
- Roadside Picnic 系列页：标题移至右上角，与侧栏 LI ZHIXIN 对齐
- 多个系列详情页布局调整：Paper Tower、Found Not Lost、Rhapsody、People、Roll

### 2026-06-25 ~ 07-01
- 初始建站：首页全屏轮播 + 白色侧栏布局
- 经历 pomme-wpcom 风格重设计后回退到原始设计
- 侧栏点击展开二级菜单（Project 子菜单）
- 图片按区块整理进子目录
- Found Not Lost 页面重设计：年份分组网格 + lightbox
- 轮播稳定性：crossfade/zoom 特性反复调试后回退到简单 fade

## 踩过的坑

### 轮播相关
- **crossfade + Ken Burns 效果导致闪烁**：用两张 img 重叠做 CSS 驱动 crossfade 才稳定；最终仍回退到简单 fade，复杂特效不如稳定优先
- **水平滚动画廊手势冲突**：wheel 事件拦截要只拦截垂直主导手势，否则侧栏滚动被卡死
- **flexbox 布局**：横向滚动画廊用 flexbox + window 级 wheel handler 才不抖
- **轮播高度**：固定高度 + object-fit contain 比 natural aspect ratio 更可控

### 移动端适配
- **Blog 页移动端导航失效**：原因是从 HTML 漏掉了 main.js 引用，sub-menu toggle 没绑定事件
- **顶部内容被导航遮挡**：移动端 top padding 要加到 80px 才够呼吸空间
- **左右边距不均**：mobile 下 margin-right 要 reset 为 0

### 设计反复
- **pomme-wpcom 风格重设计后回退**：大改前先备份，回退成本低。备份分支名 `backup-pre-pomme`
- **标题位置反复调整**：左对齐→右上角→多次微调，最终定格在右上角 40px 与 LI ZHIXIN 对齐。定位前先想清楚对齐基准
- **book spine 效果**：加书脊折痕效果后回退，装饰性元素与极简风格冲突

### 命名与内容
- **Lei Zhixin → Li Zhixin → LI ZHIXIN**：改名三次。一次性统一全站，避免遗漏
- **图片整理进子目录**：早期图片全堆在 images/ 根目录，后期按区块拆分。建站时就该规划好目录结构
### 环境与工具
- **`.codex/` 目录写入受限**：沙盒权限限制 `.codex/` 为只读，无法在此目录创建文件。改用项目根目录 `CLAUDE.md` 作为 Codex 自动加载入口，效果相同

## 维护说明

每次任务完成后，按以下格式追加到"进度时间线"：

```
### YYYY-MM-DD
- 一句话总结做了什么
- 遇到的坑（如有）
- 下次注意的点（如有）
```

规则：
1. 只记关键信息，不记流水账
2. 踩坑单独提到"踩过的坑"章节，按主题归类
3. 每条控制在一行，超过就拆分
4. 解决方案写"怎么做的"，不写"为什么"（为什么看 git log）
5. 日期倒序排列（最新在上）—— 当前文档按正序记录历史，后续新增从顶部插入

---

*最后更新：2026-08-08*
