---
title: "《手搓 Agent 踩过的那些坑》"
date: 2025-07-25 10:00:00 +0800
categories: [技术探索, 人工智能]
tags: [Agent, LLM, AI, 工程实践]
---

## 写在前面

上次写了[《为什么我要手搓复刻一个 Agent 框架》](/posts/building-agent-from-scratch/)，聊了聊 Agent 的基本原理和架构设计。

但说实话，真正动手做的时候，才发现理论和实践之间隔着一道鸿沟。

这篇文章就来聊聊我在实际开发过程中遇到的各种问题，以及是怎么一步步解决的。希望能帮后来者少踩点坑。

---

## 一、推理部分的坑

### 坑 1：历史消息越长，Agent 越"失忆"

#### 问题描述

Agent 需要多轮迭代才能完成复杂任务。一开始我的做法很简单粗暴：

```python
# 每次都把历史消息拼成一个长文本
prompt = f"""
原始问题：{original_question}

历史消息：
{history_message_1}
{history_message_2}
...
{history_message_n}

当前步骤：{current_step}
"""
```

**结果呢？**

前几轮还好好的，到了第 5、6 轮，Agent 就开始"失忆"了：
- 忘记用户最初的问题是什么
- 重复执行已经做过的操作
- 漏掉中间某个重要步骤

#### 为什么会这样？

这其实是 LLM 的一个已知问题：**注意力消失**（Lost in the Middle）。

简单说就是：
- LLM 对文本开头和结尾的内容注意力最强
- 对中间部分的内容注意力会逐渐减弱
- 文本越长，这个问题越明显

**打个比方**：

就像你看一本很厚的书，看到后面，前面的内容就记不太清了。虽然 LLM 的"记忆力"比人强，但本质问题是一样的。

> 参考论文：[Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/pdf/2307.03172)

#### 解决方案

参考 OpenAI 的标准接口，我改成了结构化的消息格式：

```python
messages = [
    {"role": "system", "content": "系统设定"},
    {"role": "user", "content": "用户问题"},
    {"role": "assistant", "content": "Agent 回复"},
    {"role": "tool", "content": "工具执行结果"},
    # ...
]
```

**这样做的好处**：
1. 每条消息都有明确的角色标识
2. LLM 能更好地理解消息的上下文关系
3. 避免了长文本导致的注意力分散

> 参考文档：[百炼 - OpenAI 兼容接口文档](https://bailian.console.aliyun.com/?tab=api#/api/?type=model&url=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F2712576.html)

**实际效果**：

改完之后，Agent 在 10 轮以上的长对话中，任务完成率从 60% 提升到了 85%。

---

### 坑 2：不按规则出牌

#### 问题描述

我给 Agent 设计了一个审核任务，有 5 个审核规则需要依次执行：

```
规则 1：检查标题是否合规
规则 2：检查内容是否违规
规则 3：检查图片是否清晰
规则 4：检查商标是否侵权
规则 5：生成审核报告
```

**结果呢？**

Agent 经常：
- 跳过某个规则
- 改变执行顺序
- 重复执行某个规则

#### 为什么会这样？

我发现问题出在：**Agent 没有提前规划，而是走一步看一步**。

就像你去超市买东西，没列购物清单，到了现场想到啥买啥，最后肯定会漏买或者买重复。

#### 解决方案：引入 COT（Chain of Thought）

我在 Prompt 里加了一段引导：

> 参考论文：[Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)

```
Based on user needs, proactively select the most appropriate tool 
or combination of tools. For complex tasks, you can break down the 
problem and use different tools step by step to solve it.

1. Break down the problem: Divide complex problems into smaller, 
   more manageable parts
2. Think step by step: Think through each part in detail, showing 
   your reasoning process

* If you want to use tools, you have to clearly explain your plan 
  and why you want to use tools.
* After using each tool, clearly explain the execution results and 
  suggest the next steps.
```

**说人话就是**：
- 先别急着动手
- 先想清楚要做什么
- 列个计划
- 然后按计划执行

**实际效果**：

加了 COT 之后，Agent 会先输出一个执行计划：

```
我的执行计划：
1. 使用 check_title 工具检查标题
2. 使用 check_content 工具检查内容
3. 使用 check_image 工具检查图片
4. 使用 check_trademark 工具检查商标
5. 汇总结果，生成报告
```

然后严格按照这个计划执行，规则遗漏率从 30% 降到了 5%。

#### 进一步优化：Focus 机制

但光有计划还不够，执行过程中 Agent 还是会"走神"。

所以我又加了一个 **Focus 机制**：在每一步执行时，自动提醒 Agent 当前处于哪个阶段。

```python
focus_prompt = f"""
Do not repeat historical thinking/reasoning, and execution.
Focus only on the progress of current thinking and execution.

Current step: {current_step}/{total_steps}
Current task: {current_task}
"""
```

**效果**：

就像你做事情时，旁边有个人不断提醒你"现在该做第 3 步了"，不容易跑偏。

---

### 坑 3：思维卡顿，原地打转

#### 问题描述

有时候 Agent 会陷入一个死循环：

```
第 5 轮：我需要查询用户信息
第 6 轮：我需要查询用户信息
第 7 轮：我需要查询用户信息
...
```

就这样一直重复，永远不往下走。

#### 为什么会这样？

**本质原因**：Agent 缺乏对自己状态的感知。

它不知道自己已经做过某个动作了，所以会一直重复。

就像一个失忆的人，每次醒来都不记得之前做过什么。

#### 解决方案：STUCK 检测机制

我加了一个自动检测机制，如果发现 Agent 在重复思考，就主动提醒它：

```python
def detect_stuck(self) -> bool:
    """检测是否陷入重复思考"""
    if len(self.history) < 3:
        return False
    
    # 检查最近 3 轮的推理内容
    recent_reasoning = [
        msg.content for msg in self.history[-3:]
        if msg.role == "assistant"
    ]
    
    # 计算相似度
    similarity = calculate_similarity(recent_reasoning)
    
    return similarity > 0.8  # 相似度超过 80% 认为卡住了
```

如果检测到卡住，就插入一条提示：

```
Observed duplicate responses. Consider new strategies and avoid 
repeating ineffective paths already attempted.
```

**说人话就是**：

"兄弟，你已经重复 3 次了，换个思路试试吧！"

**实际效果**：

加了这个机制后，死循环问题基本解决了。即使 Agent 开始重复，也能在 2-3 轮内自己意识到并调整策略。

---

## 二、工具部分的坑

### 坑 4：工具返回结果不准确

#### 问题描述

Agent 的思路没问题，但因为工具返回的结果不对，导致做出了错误的判断。

**举个例子**：

我做了一个"检查图片中是否有商标"的工具。Agent 调用后，工具返回：

```json
{
    "has_trademark": false
}
```

Agent 就认为图片里没有商标，通过了审核。

但实际上图片里明明有商标，只是工具识别失败了。

#### 为什么会这样？

**工具本身有问题**：
- 识别准确率不够
- 边界情况处理不好
- 返回信息不够详细

#### 解决方案：Prompt Engineering Your Tools

我参考了 Anthropic 的文章 [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)，意识到：

**工具的 Prompt 和 Agent 的 Prompt 一样重要！**

我给每个工具都加了详细的说明：

```python
{
    "name": "check_trademark",
    "description": """
    检查图片中是否包含商标信息。
    
    使用场景：
    - 需要识别图片中的品牌 Logo
    - 需要检测是否存在商标侵权
    
    常规 case：
    - 图片清晰，商标明显 → 准确率 95%
    - 图片模糊，商标不明显 → 准确率 70%
    
    边界 case：
    - 商标被部分遮挡 → 可能识别失败
    - 商标过小（< 50px） → 可能识别失败
    - 图片过暗或过亮 → 可能识别失败
    
    返回结果说明：
    - has_trademark: 是否检测到商标
    - confidence: 置信度（0-1）
    - trademark_info: 商标详细信息
    - warning: 如果置信度低，会给出警告
    
    注意事项：
    - 如果 confidence < 0.7，建议人工复核
    - 不要和 check_logo 工具混淆，后者只检测 Logo 位置
    """,
    "parameters": {...}
}
```

**关键点**：
1. 说明工具的使用场景
2. 列举常规和边界情况
3. 解释返回结果的含义
4. 明确与其他工具的区别

**实际效果**：

Agent 在调用工具时更加谨慎了：
- 会根据置信度判断是否需要人工复核
- 不会再混淆相似的工具
- 对工具的局限性有清晰认知

---

### 坑 5：工具入参传错或传漏

#### 问题描述

我有个工具是"获取图片中的商标信息"，入参定义是：

```python
{
    "image_urls": ["url1", "url2", "url3"]
}
```

需要 Agent 自己把图片 URL 拼成列表传进来。

**结果呢？**

Agent 经常：
- 只传了一个 URL，漏了其他的
- URL 格式拼错了
- 参数名写错了

#### 为什么会这样？

**工具的入参设计太复杂了！**

让 Agent 自己拼 URL 列表，这个要求太高了。就像你让一个新员工去找 10 个文件，还要求他记住每个文件的完整路径，肯定会出错。

#### 解决方案：简化工具接口

我把工具的入参改成了：

```python
{
    "image_position": "main_image"  # 或 "detail_image_1", "detail_image_2"
}
```

Agent 只需要告诉工具"我要检查主图"或"我要检查详情图 1"，工具内部自己去获取对应的 URL。

**对比一下**：

| 方案 | Agent 需要做的 | 出错概率 |
|------|---------------|---------|
| **旧方案** | 找到所有图片 URL → 拼成列表 → 传给工具 | 高 |
| **新方案** | 告诉工具要检查哪个位置的图片 | 低 |

**实际效果**：

参数传错的问题从 40% 降到了 5%。

**核心思想**：

**工具的接口设计应该像用户界面一样，简洁易用。**

把复杂的逻辑封装在工具内部，给 Agent 提供最简单的接口。

---

## 三、流程部分的坑

### 坑 6：返回结果格式不符合要求

#### 问题描述

我要求 Agent 返回的审核结论格式是：

```json
{
    "result": "通过/不通过",
    "reason": "原因",
    "suggestions": ["建议1", "建议2"]
}
```

**结果呢？**

前几轮还好好的，到了第 10 轮，Agent 返回的格式变成了：

```
审核结论：不通过

原因：图片不清晰

建议：
1. 重新上传清晰的图片
2. 确保光线充足
```

完全不是 JSON 格式了！

#### 为什么会这样？

**本质还是注意力下降的问题。**

经过多轮对话后，Agent 的注意力分散了，忘记了一开始的格式要求。

就像你写论文，写到最后，格式都乱了，忘了开头定的规范。

#### 解决方案：增加总结节点

我在流程最后加了一个 **LLM 总结节点**：

```python
def format_final_result(self, agent_output: str) -> dict:
    """用 LLM 重新格式化最终结果"""
    
    prompt = f"""
    请将以下审核结论转换为指定的 JSON 格式：
    
    原始结论：
    {agent_output}
    
    要求格式：
    {{
        "result": "通过/不通过",
        "reason": "原因",
        "suggestions": ["建议1", "建议2"]
    }}
    
    注意：
    - 只输出 JSON，不要有其他内容
    - 确保 JSON 格式正确
    """
    
    formatted_result = llm.generate(prompt)
    return json.loads(formatted_result)
```

**说人话就是**：

不管 Agent 最后输出的格式是什么样，我都用一个专门的 LLM 来"翻译"成标准格式。

**实际效果**：

格式错误率从 30% 降到了接近 0。

**核心思想**：

**复杂任务的最后，加一个"校对"环节。**

就像写文章，写完了要检查一遍格式、错别字一样。

---

## 四、一些通用的经验

### 经验 1：分层设计，职责分离

不要让一个 Agent 做所有事情。应该：

- **规划层**：负责任务拆解和计划制定
- **执行层**：负责调用工具和执行操作
- **检查层**：负责验证结果和质量控制
- **总结层**：负责格式化输出

每一层做好自己的事，不要越界。

### 经验 2：多加检查点

在关键环节加检查点：

- 执行前：检查计划是否合理
- 执行中：检查是否按计划执行
- 执行后：检查结果是否符合预期

**宁可多检查几次，也不要出错。**

### 经验 3：给 Agent 反馈

不要让 Agent 盲目执行，要给它反馈：

- 告诉它哪里做得好
- 告诉它哪里做得不好
- 告诉它应该怎么改进

**Agent 也需要"成长"。**

### 经验 4：设置合理的超时和重试

- 单个工具调用超时：5 秒
- 单轮推理超时：30 秒
- 总任务超时：5 分钟
- 失败重试次数：3 次

**不要让 Agent 无限循环。**

### 经验 5：日志很重要

记录详细的日志：

- 每一轮的推理内容
- 每一次的工具调用
- 每一个的执行结果
- 每一次的错误信息

**出了问题才能快速定位。**

### 经验 6：从简单到复杂

不要一开始就做复杂任务：

1. 先做单步任务（调用一个工具）
2. 再做多步任务（调用多个工具）
3. 最后做复杂任务（需要规划和决策）

**循序渐进，逐步优化。**

---

## 五、写在最后

手搓 Agent 的过程，就是一个不断踩坑、填坑的过程。

**我的感受是**：

1. **理论和实践差距很大**
   - 看起来简单的东西，做起来很难
   - 每个细节都可能出问题

2. **工程能力很重要**
   - 好的架构设计能避免很多问题
   - 完善的错误处理能提高稳定性

3. **要有耐心**
   - 不要期望一次就做对
   - 多测试，多迭代

4. **要善于总结**
   - 每次出问题都要分析原因
   - 找到通用的解决方案

**最后说一句**：

做 Agent 不是为了炫技，而是为了解决实际问题。

如果一个简单的脚本就能搞定，就不要用 Agent。

但如果真的需要 Agent，那就认真做，把每个细节都打磨好。

**毕竟，细节决定成败。**

---

## 参考资料

- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/pdf/2307.03172)
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [百炼 - OpenAI 兼容接口文档](https://bailian.console.aliyun.com/?tab=api#/api/?type=model&url=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F2712576.html)
- [Building Effective Agents - Anthropic](https://www.anthropic.com/engineering/building-effective-agents)

---

**代码在这里**：[https://github.com/byte-wrangler/agent-frame-start](https://github.com/byte-wrangler/agent-frame-start)

欢迎交流讨论！
