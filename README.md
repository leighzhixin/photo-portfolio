# LI ZHIXIN — Photography Portfolio

LI ZHIXIN 的个人摄影作品网站，用于展示摄影系列、个人写作与联系信息。整体采用极简、留白充足的响应式设计，参考 [Zheis](https://cargocollective.com/zheis) 与 [Seven Liang](https://www.sevenliang.com/) 的作品呈现方式。

本文件是项目的唯一入口：开始任务时先读这里，再由 Codex 根据任务按需读取相关文档与代码。**不要一次读取全部 Markdown 或全部项目文件。**

## 项目事实

- 技术栈：原生 HTML5、CSS3、JavaScript，不使用前端框架
- 字体：Inter、Noto Sans SC
- 部署：Vercel
- 分析：Vercel Web Analytics、Vercel Speed Insights
- 设计方向：极简、摄影优先、移动端友好

## 现有页面与功能

- Home：首页全屏图片轮播与作品入口
- Works：摄影项目列表及多个系列详情页
- Blog：文章列表及文章详情页
- About：中英文个人介绍
- Contact：联系方式与联系表单
- 图片画廊与 Lightbox 查看
- 移动端侧滑导航与二级菜单
- 图片保护：禁用右键与拖拽
- 响应式桌面端与移动端布局

当前摄影系列包括 People、Paper Tower、Roadside Picnic、Found Not Lost 和 Nai Nai；博客包含 Decade 系列与 Writing 页面。

## 主要结构

```text
├── index.html                   # Home
├── works.html                  # Works 列表
├── works-*.html                # 摄影系列详情页
├── blog.html                   # Blog 列表
├── blog-*.html                 # 文章详情页
├── about.html                  # About
├── contact.html                # Contact
├── css/
│   ├── style.css               # 全站基础与页面样式
│   └── series.css              # 摄影系列页样式
├── js/
│   ├── main.js                 # 导航、首页等全站交互
│   └── lightbox.js             # 图片 Lightbox
├── images/                     # 摄影图片资源
├── templates/                  # 系列页面模板
├── vercel.json                 # Vercel 配置
├── AGENTS.md                   # Codex 工作规则与知识路由
├── PROGRESS.md                 # 重要进展、历史决策与踩坑
└── README.md                   # 项目事实与文档导航（本文件）
```

## 文档导航

当前文档：

| 文档 | 何时读取 | 记录什么 |
| --- | --- | --- |
| `AGENTS.md` | Codex 自动遵循；需要调整工作方式时读取 | 工作规则、项目底线、自动分类和上下文控制 |
| `PROGRESS.md` | 需要了解相关历史、已完成进展或踩坑时读取 | 关键进度、有效经验和历史背景 |

以下文档仅在相应知识真正出现且值得长期独立维护时创建，不能为了凑齐结构而预先创建：

- `PROJECT.md`：项目定位、受众、页面和长期产品需求
- `STYLE_GUIDE.md`：视觉、排版、布局、动画与响应式规范
- `ARCHITECTURE.md`：技术架构、目录、部署和外部服务
- `DECISIONS.md`：不会轻易改变的重要选择、放弃方案及原因
- `TODO.md`：正在进行与下一步任务
- `MEMORY.md`：稳定偏好、项目背景和跨任务共识

Codex 负责判断应该读取或更新哪个文档，用户无需指定文件名。新增任何长期文档后，应把它登记到本节。

## 内容更新入口

- 图片与轮播内容：检查 `images/` 和相关页面或 `js/main.js`
- 个人介绍：`about.html`
- 联系方式：`contact.html` 及各页面导航中的社交链接
- 全站样式：`css/style.css`
- 摄影系列布局：`css/series.css` 与对应的 `works-*.html`
- 新系列：从 `templates/` 中选择最接近的页面模板，再按现有结构接入 Works 导航

---

*最后更新：2026-08-08*
