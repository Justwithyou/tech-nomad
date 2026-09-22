---
title: Java AI - Spring AI 系列（一）：基础篇
description: 基于 Spring AI 实现 Java 调用大模型的能力，涵盖模型配置、函数调用、MCP、上下文管理与 RAG 等核心能力
published: 2026-09-22
tags:
  - JavaAI
  - SpringAI
---

基于 SpringAI 实现了使用 Java 语言调用大模型的能力，包括基本的模型配置、模型参数设置、切面拦截、**函数调用、MCP 调用、上下文管理、记忆系统** 等。
## Spring AI

- 基础大模型
- 调用大模型
	- 模型参数设置
	- ChatClient - 高度定制
	- ChatModel - 封装
	- 业务上可能需要实现
		- 调用日志统计入库
		- Token用量统计入库
- 提示词组装
	- 角色（system、user、assistant、tool）
	- PromptTemplate - 模板，动态替换 `{placeholder}`
	- 提示词模板 `.st` 文件 
	- 提示词调优
- 结构化输出
	- 输出格式化
	- 流式输出、非流式输出
	- 查看思考过程
- 多模态
- 对话记忆（上下文管理）
	- 上下文是怎么传给大模型的，是不是可以自己组装包含上下文的提示词
	- ChatMemory
	- ChatHistory
- 工具调用（函数调用）
	- `@Tool`
	- `ToolCallBack`
	- `ToolCallbackProvider`
- MCP
- RAG
- 模型评估
- 向量数据库
- 可观测性


### 核心术语

- ChatModel：底层模型通信的核心接口，不同模型对应不同的实现
- ChatClient：高层应用构建，基于 ChatModel 封装，支持高度定制化，屏蔽了底层模型的差异
	- ChatModel.Builder：构建器
	- DefaultChatClient：默认实现
	- ChatOptions：模型参数配置对象
	- 模型参数调优：
		- `MaxTokens`：最大输出长度
		- `Temperateure：温度，控制样本输出多样性，越低越稳定，越高越充满创意
		- `Top_K/Top_P`：核采用，前者根据名次截断，后者按照累积率截断
		- 通常来说，`Temperature` 和 `Top_P` 设置一个即可，同时设置结果将变得难以预测
- Prompt：提示词抽象，包括消息列表 `List<Message>`，同时支持模型参数定制 `ChatOptions`
- Message：消息抽象
	- 消息类型：`system`、`user`、`assistant`、`tool`
	- `system`：系统提示词，大模型的人设、背景、规则、语气设定
	- `user`：用户消息，大模型需要回答或解决的问题
	- `assistant`：大模型回复的消息，用于上下文管理
	- `tool`：工具调用消息
	- 都支持通过 `params` 动态替换参数
- PromptTemplate：提示词模板，用于优雅的生成 `Prompt` 中的 `Message` 对象
	- 占位符 `{}`
	- 自定义占位符 `StTemplateRenderer`
	- 提示词外置为 `.st` 资源文件，再使用  `@Value` 注入为 `Resource` 对象
	- 编写提示词的 **CRISPE** 原则：
		- Role：角色设定
		- Task：指令或任务目标
		- Constraints：约束条件
		- Format：输出格式
- 多模态：`Multi-Modal`
	- `Media`：媒体，内部类 `Media.Format` 或 `MimeTypeUtils`
	- 需确保大模型本身支持多模态
- 结构化输出：
	- `.entity(Class<T> cls)`：约束输出格式为对象
	- `StructuredOutputConverter`：结构化输出转换器，包括 `BeanOutputConverter`、`ListOutputConverter` 等
	- `ChatModelCallAdvisor`：默认切面进行拦截增强
	- 自动反序列化：自动调用 Jackson 的 `ObjectMapper` 进行反序列化、
- Flux 流式响应：**Project Reactor**
	- `Flux<String>`：随时间不断流动的传送带，数据随着时间流程进而被传送
	- 使用 `.stream()` 开启流式输出
- `Adivsor` 拦截器：AOP 思想实现的顾问（`advisor`）机制
	- 责任链模式，按序执行
	- `Advisor`：
		- 继承 `Ordered` 接口，决定拦截器执行顺序
		- `CallAdvisor`：同步请求拦截器，核心方法 `adviseCall`
		- `StreamAdvisor`：流式请求拦截器，核心方法 `adviseStream`
		- `BaseAdvisor`：提供一个兼容同步与流式请求的实现
		- `ChatClientRequest`：请求记录，包含一个 `Map` 类型的 `context`
		- `ChatClientResponse`：响应记录，包含一个 `Map` 类型的 `context`
	- 框架内置的拦截器：
		- 聊天记忆类：
			- `MessageChatMemoryAdvisor`：自动检索历史聊天记录，并以 `Message` 对象列表的形式追加到用户提示词中
			- `PromptChatMemoryAdvisor`：将历史消息直接组装成文本，塞到 `system` 提示词中
			- `VectorStoreChatMemoryAdvisor`：将会话历史存储向量数据库，对话时自动检索最相关的记忆片段，并塞到 `system` 提示词中
		- 检索增强类：
			- `QuestionAnswerAdvisor`：结合向量数据库，将检索到的内容自动追加到用户提示词中，实现外挂大脑
			- `RetrievalAugmentationAdvisor`：更高级的模块化 RAG 流程控制组件
		- 推理增强类：
			- `ReReadingAdvisor`：基于著名的 RE2 论文实现。它会自动让大模型把你的问题“重读一遍”，能显著提升大模型处理复杂逻辑题的准确率（自行实现）
		- 内容安全类：
			- `SafeGuardAdvisor`：敏感词过滤
	- 最佳实践：
		- 单一职责：只做一件事
		- 上下文共享：如果多个 `Advisor` 之间需要传递数据，使用 `ChatClientRequest.context()`，本质上是一个跨越整个拦截链的 `Map`
		- 兼容双模式：同时支持同步和流式输出
		- 严格控制顺序：认真规划 `getOrder()` 的返回值，确保数据流的绝对正确
- 上下文管理：短期记忆、长期记忆
	- `ChatMemory`：记忆管理策略，如保存最近 10 条等
	- `MessageWindowChatMemory`：滑动（Sliding Window）窗口记忆实现，默认保留 20 条会话
	- `ChatMemoryRepository`：物理存储，会话记忆存储的接口，可扩展，默认为内存实现
	- `InMemoryChatMemoryRepository`：内存实现的记忆存储，通过 `ConcurrentHashMap` 存储会话数据
	- `MessageChatMemoryAdvisor`：拦截器
	- 集成 JDBC 会话存储：
		- `JdbcChatMemoryRepository`：官方实现，支持多个数据库适配
		- 兼容性适配
	- 记忆无限增长存在的问题：
		- 费钱
		- 超过最长上下文直接报错
		- 大模型注意力被稀释，变笨，幻觉（Hallucination）率上升，乱说，来回改
	- `MessageWindowChatMemory` 滑动窗口的实现：
		- 类型判断，固定保留 `SystemMessage`
		- 默认消息列表长度为 20 条（可设置），如果超出，则丢弃最早的消息
		- 致命缺陷：直接基于 `Message` 数量裁剪，而不是 `Token` 数量裁剪
			- 解决方案：引入 `Token` 级的精准滑窗策略（Token-based Window Strategy），通过本地分词器（Tokenizer，如 Java 开源项目 JTokkit），计算 Token 总数，然后进行裁剪
			- 最佳实践：更好的方案时使用大模型对记忆进行摘要总结，提取出诸如情景分析、用户画像，然后语义整合，最后结构化存储和语义关联
- 大模型微调（Fine-tuning）
- RAG（Retrieval-Augmented Generation，检索增强生成）（Embeddding）（Self-Querying Retriever）
	- ETL Pipeline（抽取 Extract、转换 Transform、加载 Load）
		- `DocumentReader`：抽取
		- `DocumentTransformer`：转换
		- `VectorStore`：向量化与加载
		- `Document`：领域模型，承载数据的对象
			- 双模态设计：不仅支持文本，同时也支持图片
			- `metadata` 元数据：数据溯源、精准过滤
			- `score` 分数：其实就是相似度或者匹配度，通常使用 余弦相似度或 L2 距离
	- 在线检索增强：组装成新的 Prompt 发送给大模型
	- 文档解析（Extract）：
		- `TikaDocumentReader`：暴力解析，万物皆可解析，缺点在于如果文档很多，最终结果也会非常大
		- `PagePdfDocumentReader`：精准按页解析
		- 自定义 `SeparatedMultimodalPdfReader` 解析器，分离式多模态 PDF 读取器，支持图片
		- 所有的解析都只为了产出标准的 `List<Document>`，`Document` 即为 RAG 检索和向量运算的通用对象
	- 文档切分（Transform）：将长文档切分为小文本块（Chunks），核心概念 `Chunk Size` 分块大小 和 `Overlap` 重叠度
		- 切分的常见问题：
			- 语义割裂，通过引入滑动重叠区（Overlap）来解决，表示下一块的开头包含了上一块结尾的多少个 Token，通常设置为分块大小的 10% ~ 20%
		- 按 Token 切分，分词器 Tokenizer
		- `DocumentTransformer`：家族体系
			- `TokenTextSplitter`：负责把长文本物理切分成Chunk
			- `KeywordMetadataEnricher`：利用大模型，自动阅读这个 Document 块，提取出如“Java, 并发, 锁”等核心关键字，并塞进它的 Metadata 里
			- `SummaryMetadataEnricher`：利用大模型，自动为这个几百字的 Document 块写一段一句话摘要，塞进 Metadata 里
			- 自定义 `SeparatedMultimodalPdfReader` 切分实现
			- 切分方式：详见 [[RAG INDEX]]
	- 词嵌入、向量化（Embedding）：向量（Vector），结合 `EmbeddingModel` 和 Apache Math 库，用纯代码精准计算不同文本之间的语义相似度
		- **向量（也称为欧几里得向量、几何向量），是指具有大小（magnitude）和方向的量，**它可以形象化地表示为带箭头的线段：
			- **箭头所指**：代表向量的方向
			- **线段长度**：代表向量的大小
		- Embedding（嵌入）就是将人类的自然语言，映射为高维数学空间中的一个向量
		- 向量间相似度的两大计算法则
			- **欧式距离（Euclidean Distance）** ：
				- 欧式距离是指在 n 维空间中，两个点之间的**真实直线距离**（基于几何学中的勾股定理）
				- **计算公式**：向量 A 减去 向量 B 后的模长（即对应维度差值的平方和的平方根）
				- **判定标准**：距离越小，表示两个向量越接近。
				- **缺点**：欧式距离对数值绝对大小非常敏感。如果两句话意思一样但长短不一（导致向量模长不一致），可能会导致距离变大，结果不够准确
			- **余弦相似度（Cosine Similarity）**：
				- 余弦相似度衡量的是两个非零向量之间的**角度差异**。它关注的是向量的**方向而非长度**
				- **计算公式**：向量 A 与 向量 B 的点积，除以它们模长的乘积
				- **判定标准**：值域为 `[-1, 1]`
					- **1**：表示完全相同的方向（语义极度相似）
					- **0**：表示垂直（毫无相关性）
					- **-1**：表示完全相反的方向（语义完全对立）
				- **优势**：在比较文本、关键词等自然语言场景中，**余弦相似度是最常用的方法之一**。因为文本的“方向（核心思想）”远比它们的“模长（字数多少）”更重要
		- 本地化+混搭架构
	- 向量数据库（Vector Database）：
		- `VectorStore`：
		- `SimpleVectorStore`：开箱即用的本地向量存储，数据写在内存，支持序列化为本地物理 JSON 文件
			- 注册 Bean `vectorStore`
			- 向量化
			- 入库
		- 集成 Redis 向量库
			- 需要安装带向量搜索插件的 Redis，即装载了 RedisSearch 模块的Redis(Redis Stack)，它不再仅仅是 K-V 缓存，而是拥有内存级极速检索能力的向量数据库
	- 检索召回（Retreieve）：
		- 关键参数：
			- Top-K：只取前 K 块，过多可能导致中间注意力丢失问题（Lost in the middle）
			- Threshold：0~1之间的小数，根据实际搜索结果返回
			- Metadata Filters：元数据过滤
		- `FilterExpressionBuilder`：强类型跨库过滤工具
		- `SearchRequest`：相似度查询请求
	- RAG 拦截：
		- `QuestionAnswerAdvisor`：自动检索并添加到用户提示词中
		- `RetrievalAugmentationAdvisor`：模块化引擎，可任意替换流水线上的组件
		- 组合记忆与RAG拦截：
			- `MessageChatMemoryAdvisor`：上下文记忆
			- `RetrievalAugmentationAdvisor`：检索增强
- 工具调用 Tool Calling： **工具定义的多种实现方式**
	- `@Tool` 注解：定义工具方法
	- 通过 `.tools()` 方法传入
	- 源码阅读：`ToolCallbacks.from(toolObjects)`、`DefaultChatClientUtils.toChatClientRequest`、`ChatModel.internalCall`
		- 方法级工具（MethoToolCallback）
			- `ToolCallback`：通过 `.toolCallbacks()` 方法传入
				- 方法参数：JsonSchemaGenerator.generateForMethodInput(method)，兼容 @ToolParam、@JsonPropertyDescription、@Schema
			- `ToolDefinition`
			- `ToolCallingManager`
		- 函数级工具（FunctionToolCallback）
			- 继承 `Function` 函数式接口
			- 通过 `.toolCallbacks()` 方法传入
		- Spring Bean 动态解析：使用 `@Bean` + `@Description` 组合创建 Function Bean
			- `@Description`
			- 通过 `.toolNames()` 方法传入 Bean 名称
			- `ToolCallbackResolver`
			- `SpringBeanToolCallbackResolver`
- 规划调度和编排：
	- ReAct（Reasoning And Acting）架构
	- 缺陷：
		- 无最大思考次数限制，出现幻觉或脏数据时可能出现死循环
		- 缺乏动态的记忆压缩机制（Memory Pruning）
		- 缺乏人类介入授权
		- 难以应对超复杂长线任务（引入 Plan And Execute 先计划后执行机制 或 Mutil-Agent 多智能协作机制）
	- 自我修正（Self-Correction）
- MCP（Model Context Protocol）
- 实战

### 架构设计

- Spring AI 框架中大量使用构建器 `Builder` 模式，提供了极好的封装和可扩展性
- 抽象、封装
- 基于 Spring、Spring Boot 的特性，提供开箱即用的能力

也在思考，在生产级别的 Agent 开发当中，**Java 和 Python 哪个使用更多**，以及后续的学习方向

## 参考

[Spring AI Reference](https://docs.spring.io/spring-ai/reference/)
[Spring AI Embeddings API](https://docs.spring.io/spring-ai/reference/api/embeddings.html)
[Spring AI VectorStore](https://docs.spring.io/spring-ai/reference/api/vectordbs.html)
[SpringAI入门指南 - 苏三说技术 - 博客园](https://www.cnblogs.com/12lisu/p/19914585)