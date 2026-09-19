---
title: Agent Skills 从入门到实战
description: Agent Skills 的含义、标准、格式、应用等，旨在从零开始学习 Skills 并实战应用
category: AI
tags:
  - Skills
  - 技能
published: 2026-05-25
accent: "indigo"
---

## Agent Skills 是什么

### 定义

Agent Skills 是 2025 年 Anthropic 率先发布的 AI 能力扩展标准。

**核心定义：**
- Agent Skills 是一组指令、脚本和资源的集合，可以让 AI Agent 动态加载以提升特定任务的执行效果
- Agent Skills 是一套标准化的能力封装，它将复杂的、需要多步推理和工具调用的任务，打包成一个可以直接使用的"技能包"
- Skills 是**模块化的能力包，包含指令、脚本和资源**，是**可直接复用的工具模板**
- **完成特定任务的标准化、可复用流程**，核心关键词是"**明确输入、固定步骤、可预期输出**"，它不是单一的"能力"，而是一套"**能直接用、能重复用、还能不断优化的具体方法**"

**核心原理：**把复杂的任务，拆解成一个个简单可执行的小步骤，每个步骤都明确"需要准备什么（输入）"和"能得到什么（输出）"，再用标准化的逻辑，让这些步骤无缝衔接、可重复使用。

从本质上来说，Skill 的核心就是"拆解+标准化"：拆解是为了降低执行难度，让普通人也能上手；标准化是为了保证结果一致，实现重复复用。

**一个 Skill 就是一个文件夹**，里面包含：
- **SKILL.md**：主要的指令文件（必需）
- **scripts/**：可执行的脚本代码（可选）
- **references/**：参考文档（可选）
- **assets/**：静态资源文件（可选）

**Skills 特性：**
- 可移植性，任何支持 Agent Skills 标准的 Agent 都可以使用
- 版本控制，文件形式存储，可通过 Git 进行追踪
- 可执行性，可包含 Agent 执行的脚本和代码
- 渐进式加载，按需加载资源，保持上下文使用效率

### 快速入门

**为什么需要 Skills：**

Skill 的价值，本质上是解决"效率低、结果乱、难复制"的问题，具体体现在三个方面：

- **提升效率，减少重复劳动**：例如新媒体运营推文，传统步骤是找素材、写标题、排版、检查错别字，抽取成 **推文专项 Skill**，固定每个步骤的具体方法，大大提升工作效率
- **保证一致性，降低出错率**：例如客服，不同的客服人员处理问题时的方法各有差异，如果定制一套 **客户投诉处理 Skill**，明确步骤，按流程执行，就能保证所有客户得到一致的服务，也能减少出错的风险
- **降低学习成本，实现快速复制**：例如客户接待，新员工通常需要花 1~2 周才能上手，如果定制一套 **客户接待 Skill**，明确流程，只需 1~2 天即可

## 技术详解

### 语法格式

**基本结构：**

```markdown
---
name: my-skill-name
description: 描述这个 Skill 做什么以及什么时候使用它
---

# My Skill Name

## 指令 详细的步骤说明...

## 约束条件

## 示例 具体的使用案例...

## 失败处理
```

**元数据字段说明：**

| 字段 | 必选 | 说明 |
|---|---|---|
| `name` | ✅ | 最多 64 字符，仅小写字母、数字、连字符。Skill 的唯一标识符，必须与父目录名匹配 |
| `description` | ✅ | 最多 1024 字符，描述 Skill 功能和使用时机，Agent 用此判断相关性 |
| `license` | ❌ | 许可证名称或引用 |
| `compatibility` | ❌ | 最多 500 字符，环境要求说明 |
| `metadata` | ❌ | 任意键值对的额外元数据 |
| `disable-model-invocation` | ❌ | true/false，设为 true 时仅通过 `/skill-name` 手动调用 |

**description 编写最佳实践：**

核心：能做什么，什么时候使用。

```yaml
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

**编写原则：**

1. **用第三人称**：因为 description 会被注入到系统提示中
2. **具体且包含触发词**：包含所有可能的关键词
3. **包含 WHAT 和 WHEN**：说明 Skill 做什么以及何时使用

### 加载机制

**渐进式披露：**

Skills 使用三级加载系统：

1. **启动时**：加载所有 Skill 的元数据
2. **Skill 被激活时**（描述匹配时）：加载指令，即正文内容
3. **资源引用时**：加载 `scripts/`、`references/`、`assets/` 中的文件

脚本本身不进入上下文，直接执行，只返回结果。

### 最佳实践

**Skills 的标准结构：**

- 任务目标
- 输入要求
- 执行步骤
- 输出结果
- 注意事项

**Skills 的设计原则：**

- 单一性原则
- 可执行原则
- 可复用原则
- 简洁性原则

少于 500 行

**Skills 的核心质量标准：**

- 边界极度清晰
- 输入输出结构化
- 步骤明确可执行
- 失败策略完备
- 职责绝对单一

**自由度层次：**

- **高**：多种有效方法，依赖上下文，如代码审查
- **中**：有首选模式，允许变化，如报告生成
- **低**：操作脆弱，需要一致性，如数据库迁移

**Skills 构建与迭代的最佳流程：**

1. 需求调研
2. 初步搭建
3. 小范围测试
4. 优化迭代
5. 全面推广
6. 定期复盘

Skills 的功能不是一次到位的，需要在应用的过程中不断迭代、完善。

## 避坑指南

### 避坑雷点

Skills 常见问题与注意事项：

- **避免 Windows 路径问题**
- **避免提供过多选项**
- **避免包含时效性信息**
- **避免术语前后不一致**
- **避免模糊的 Skill 名称**

### 问题案例

*（本节为自动补充，原文档未提供具体案例）*

> 💡 **提示**：在编写 Skill 时，建议使用真实场景测试，记录遇到的问题并持续迭代优化。参考 [[#最佳实践]] 中的构建与迭代流程。

## 集成扩展

### Agent 集成

#### Claude Code

### 实用推荐

- **superpowers**：一套完整的 AI 编程技能框架和软件开发方法论。它包含十几个可组合的编程技能，比如头脑风暴、编写计划、执行计划、TDD 测试驱动开发、系统性调试、代码审查等（[Github](https://github.com/obra/superpowers)）

- **vue-skills**：Vue.js 最佳实践 Skills，尤雨溪团队成员维护；让 AI 按照 Vue 生态的最佳实践来写代码，包括 Vue 3 组合式 API、Vite 构建配置、Vitest 单元测试、Pinia 状态管理、UnoCSS 样式方案等，做 Vue 项目必装（[Github](https://github.com/vuejs-ai/skills)）

- **frontend-design**：Anthropic 官方的前端设计 Skill，帮你开发独具辨识度的生产级前端界面，通过 `npx skills add anthropics/skills` 安装

- **ui-ux-pro-max**：专业前端设计 Skill，让 AI Agent 具备专业设计师的能力，生成的界面不再是千篇一律的 AI 风格，支持各种主流 AI 编程工具，强烈推荐（[Github](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)）

- **baoyu-skills**：宝玉老师自用的 Skills 集合，包括公众号文章写作、PPT 制作、封面图生成、小红书配图、漫画生成等，对内容创作者非常有帮助，直接把大佬的创作工作流复制过来用（[Github](https://github.com/JimLiu/baoyu-skills)）

- **skill-creator**：Anthropic 官方的 Skill 创建工具，教你怎么创建自定义 Skill。会引导你按照最佳实践编写 SKILL.md 文件，包括技能描述、触发条件、执行步骤等，通过 `npx skills add anthropics/skills` 安装

- **find-skills**：Vercel 出品的 Skills 发现工具，帮你快速找到和安装需要的 Skills；通过 `npx skills add vercel-labs/skills` 安装，支持交互式搜索和关键词搜索，用 `npx skills find` 命令即可启动
- PPT 制作（[Official](https://hugohe3.github.io/ppt-master/viewer.html?project=ppt169_sugar_rush_memphis)）
## 后续探讨

- 工作流和反馈循环实现
- Skills 路由实现

## 参考

- [自动抓取 GitHub 上所有 Skills 项目，按分类、更新时间、Star 数量整理](https://skillsmp.com/zh)
- [SkillHub - 专为中国用户优化的 Skills 社区](https://skillhub.cloud.tencent.com/)
- [Skill Hub 中国 - 实战 Skill 案例与可复用方案库](https://www.skill-cn.com/)
- [Skills 排行榜](https://www.skills.sh/)
- [每日 Skills 榜单](https://mcpmarket.com/daily/skills)
- [Anthropic 官方 Skills 仓库](https://github.com/anthropics/skills)
- [awesome-claude-skills - Skills 精选列表](https://github.com/ComposioHQ/awesome-claude-skills)
- [OpenAI 官方 Codex Skills 目录](https://github.com/openai/skills)
- [Agent Skills Specification](https://agentskills.io/specification)
- [Agent Skills Standard GitHub](https://github.com/agent-skills-standard)
- [Skills（技能） – Claude 中文社区](https://claudecn.com/docs/claude-code/advanced/skills/)
- [Agent Skills 是什么？和 Prompt、MCP 到底差在哪？ | JavaGuide](https://javaguide.cn/ai/agent/skills.html)
- [Agent Skills with Anthropic - DeepLearning.AI 短课程](https://www.deeplearning.ai/short-courses/agent-skills-with-anthropic/)
- [Claude Code Skills 使用指南：安装、创建与管理Claude Code Skills 是什么？怎么安装？ - 掘金](https://juejin.cn/post/7614451900677685263)
- [B 站视频讲解](https://www.bilibili.com/video/BV1T7zzBQEaA/)