---
title: "LeetCode 刷题常见技巧"
date: 2022-09-25 10:00:00 +0800
categories: [算法, LeetCode]
tags: [算法, 数据结构, 刷题技巧]
---

## 写在前面

最近在 LeetCode 上刷了不少题，慢慢摸索出了一些套路。整理了一份思维导图，把常见的算法技巧都归纳了一下。这篇文章就是对这个思维导图的详细展开，每个技巧我都会简单说说，后面会持续补充更多的例题和心得。

## 算法技巧大纲

```
算法大纲
├── 链表技巧
│   ├── 虚拟头节点（需要返回新链表的时候用）
│   ├── 链表分解
│   └── 快慢指针
│
├── 数组
│   ├── 快慢指针
│   │   ├── 滑动窗口（长短子串问题）
│   │   └── 原地修改类型题目
│   ├── 左右指针
│   │   ├── 二分查找
│   │   ├── N数之和
│   │   ├── 反转数组
│   │   └── 回文判断
│   ├── 前缀和数组（快速计算一个索引区间的和或者积）
│   └── 差分数组（频繁对某个区间加减某个数）
│
├── 队列
│   ├── 先进先出（FIFO）
│   └── 单调队列
│
├── 栈
│   ├── 后进先出（LIFO）
│   └── 单调栈
│
├── 二叉树
│   ├── 深度遍历（三种）：前中后序遍历
│   ├── 广度遍历（三种）：队列辅助、队列+计算深度、队列+路径长度
│   ├── 技巧1（遍历方式）：遍历一遍得到答案
│   └── 技巧2（递归方式）：分解子问题得到答案
│
├── 二叉搜索树
│   └── 二叉搜索树
│
└── 图
    ├── 二分图判断
    ├── 并查集
    └── 环检测与拓扑排序
```

---

## 一、链表技巧

链表题目虽然不难，但细节特别多，一不小心就会出错。掌握几个常用技巧能让代码简洁很多。

### 1.1 虚拟头节点

这个技巧真的太好用了！特别是在需要返回新链表的题目中。

**核心思想**：在原链表前面加一个虚拟节点，这样就不用单独处理头节点的特殊情况了。

**适用场景**：
- 删除链表节点
- 合并链表
- 需要返回新链表头的题目

> 📝 **例题区域**：
> 
> [21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/description/)

---

### 1.2 链表分解

有些链表题目需要把链表分成几部分，然后再合并。

**核心思想**：使用多个虚拟头节点，分别维护不同的子链表。

**适用场景**：
- 按条件分隔链表
- 奇偶链表
- 重排链表

> 📝 **例题区域**：
>
> [86. 分隔链表](https://leetcode.cn/problems/partition-list/description/)
> 
> [82. 删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/description/)

---

### 1.3 快慢指针

快慢指针是链表题的经典技巧，两个指针以不同速度遍历链表。

**经典应用**：
- 判断链表是否有环
- 找链表的中点
- 找链表倒数第 k 个节点

> 📝 **例题区域**：
> 
> [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/)
> 
> [876. 链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/description/)
> 
> [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/description/)
> 
> [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/description/)
> 
> [160. 相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/description/)
> 
> [83. 删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/description/)
> 
> [23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/description/)



---

## 二、数组技巧

数组是最基础的数据结构，但也有很多巧妙的解法。

### 2.1 快慢指针

快慢指针不仅在链表中有用，在数组中也很常见。

#### （1）滑动窗口（长短子串问题）

滑动窗口是处理子串、子数组问题的利器。

**核心思想**：用两个指针维护一个窗口，右指针扩大窗口，左指针缩小窗口。

**适用场景**：
- 最长无重复字符子串
- 最小覆盖子串
- 字符串排列

> 📝 **例题区域**：
> 
> [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/description/)
> 
> [567. 字符串排列](https://leetcode.cn/problems/permutation-in-string/description/)
> 
> [438. 找所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/description/)

---

#### （2）原地修改类型题目

在数组中原地修改，不使用额外空间。

**常见题目**：
- 移除元素
- 移动零
- 删除排序数组中的重复项

> 📝 **例题区域**：
> 
> [26. 删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/description/)
> 
> [27. 移除元素](https://leetcode.cn/problems/remove-element/description/)
> 
> [283. 移动零](https://leetcode.cn/problems/move-zeroes/description/)

---

### 2.2 左右指针

左右指针从数组两端向中间移动，常用于有序数组。

#### （1）二分查找

二分查找是最经典的左右指针应用。

**核心思想**：每次排除一半的搜索空间。

> 📝 **例题区域**：
> 
> [704. 二分查找](https://leetcode.cn/problems/binary-search/description/)
> 
> [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/)
> 
> [875. 爱吃香蕉的珂珂](https://leetcode.cn/problems/koko-eating-bananas/description/)
> 
> [1011. 在 D 天内送达包裹的能力](https://leetcode.cn/problems/capacity-to-ship-packages-within-d-days/description/)
> 
> [410. 分割数组的最大值](https://leetcode.cn/problems/split-array-largest-sum/description/)

---

#### （2）N数之和

两数之和、三数之和、四数之和等问题。

**核心思想**：排序 + 双指针，避免重复。

> 📝 **例题区域**：
> 
> [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/description/)

---

#### （3）反转数组

用左右指针交换元素，实现数组反转。

> 📝 **例题区域**：
> 
> [344. 反转字符串](https://leetcode.cn/problems/reverse-string/description/)

---

#### （4）回文判断

判断字符串或数组是否为回文。

> 📝 **例题区域**：
> 
> [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/description/)
> 
> [125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/description/)

---

### 2.3 前缀和数组

前缀和是一个非常实用的技巧，可以快速计算子数组的和。

**核心思想**：`preSum[i]` 表示前 i 个元素的和，那么 `[i, j]` 区间的和就是 `preSum[j+1] - preSum[i]`。

**适用场景**：
- 快速计算区间和
- 需要频繁查询子数组和的问题
- 和为 K 的子数组

> 📝 **例题区域**：
> 
> [303. 区域和检索 - 数组不可变](https://leetcode.cn/problems/range-sum-query-immutable/description/)
> 
> [724. 寻找数组的中心下标](https://leetcode.cn/problems/find-pivot-index/description/)
> 
> [525. 连续数组](https://leetcode.cn/problems/contiguous-array/description/)
> 
> [523. 连续的子数组和](https://leetcode.cn/problems/continuous-subarray-sum/description/)

---

### 2.4 差分数组

差分数组是前缀和的逆运算，主要用于频繁对某个区间加减某个数的场景。

**核心思想**：对区间 `[i, j]` 加上 k，只需要 `diff[i] += k, diff[j+1] -= k`。

**适用场景**：
- 区间加法
- 航班预订统计
- 拼车问题

> 📝 **例题区域**：
> 
> [1109. 航班预订统计](https://leetcode.cn/problems/corporate-flight-bookings/description/)
> 
> [1094. 拼车](https://leetcode.cn/problems/car-pooling/description/)

---

## 三、队列技巧

队列的特点是先进先出（FIFO），在某些场景下特别好用。

### 3.1 先进先出（FIFO）

队列的基本特性是先进先出，最先入队的元素最先出队。

**核心思想**：按照时间顺序处理元素，先到先服务。

**适用场景**：
- 层序遍历（BFS）
- 任务调度
- 消息队列
- 缓存淘汰（FIFO策略）

> 📝 **例题区域**：
> 
> [933. 最近的请求次数](https://leetcode.cn/problems/number-of-recent-calls/description/)
> 
> [2073. 买票需要的时间](https://leetcode.cn/problems/time-needed-to-buy-tickets/description/)

---

### 3.2 单调队列

单调队列维护一个单调递增或递减的队列，常用于滑动窗口最值问题。

**核心思想**：队列中保持单调性，队头始终是当前窗口的最值。

**经典题目**：
- 滑动窗口最大值
- 滑动窗口中位数

> 📝 **例题区域**：
> 
> [239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/description/)
> 
> [LCR 184. 设计自助结算系统](https://leetcode.cn/problems/dui-lie-de-zui-da-zhi-lcof/description/)
> 
> [862. 和至少为 K 的最短子数组](https://leetcode.cn/problems/shortest-subarray-with-sum-at-least-k/description/)

---

## 四、栈技巧

栈的特点是后进先出（LIFO），很多问题都可以用栈来解决。

### 4.1 后进先出（LIFO）

栈的基本特性是后进先出，最后入栈的元素最先出栈。

**核心思想**：处理具有嵌套结构或需要回溯的问题。

**适用场景**：
- 括号匹配
- 表达式求值
- 函数调用栈
- 深度优先遍历（DFS）
- 撤销操作

> 📝 **例题区域**：
> 
> [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/description/)
> 
> [71. 简化路径](https://leetcode.cn/problems/simplify-path/description/)
> 
> [143. 重排链表](https://leetcode.cn/problems/reorder-list/description/)
> 
> [150. 逆波兰表达式求值](https://leetcode.cn/problems/evaluate-reverse-polish-notation/description/)
> 
> [388. 文件的最长绝对路径](https://leetcode.cn/problems/longest-absolute-file-path/description/)
> 
> [155. 最小栈](https://leetcode.cn/problems/min-stack/description/)
> 
> [895. 最大频率栈](https://leetcode.cn/problems/maximum-frequency-stack/submissions/)

---

### 4.2 单调栈

单调栈和单调队列类似，维护一个单调的栈。

**核心思想**：栈中保持单调性，用于找下一个更大/更小的元素。

**适用场景**：
- 下一个更大元素
- 柱状图中最大的矩形
- 接雨水
- 每日温度

> 📝 **例题区域**：
> 
> [496. 下一个更大元素 I](https://leetcode.cn/problems/next-greater-element-i/description/)
> 
> [503. 下一个更大元素 II](https://leetcode.cn/problems/next-greater-element-ii/description/)
> 
> [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/description/)

---

## 五、二叉树技巧

二叉树是面试的重点，掌握遍历方式是基础。

### 5.1 深度遍历（三种）

深度优先遍历有三种方式，根据访问根节点的顺序不同而命名。

**三种遍历方式**：
- **前序遍历**：根 → 左 → 右
- **中序遍历**：左 → 根 → 右
- **后序遍历**：左 → 右 → 根

**实现方式**：
- 递归实现（简单直观）
- 迭代实现（用栈模拟）

> 📝 **例题区域**：
> 
> [226. 翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/description/)
> 
> [116. 填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/description/)
> 
> [257. 二叉树的所有路径](https://leetcode.cn/problems/binary-tree-paths/description/)
> 
> [129. 求根节点到叶节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers/description/)
> 
> [988. 从叶结点开始的最小字符串](https://leetcode.cn/problems/smallest-string-starting-from-leaf/description/)
> 
> [1022. 从根到叶的二进制数之和](https://leetcode.cn/problems/sum-of-root-to-leaf-binary-numbers/description/)
> 
> [114. 二叉树展开为链表](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/description/)
> 
> [654. 最大二叉树](https://leetcode.cn/problems/maximum-binary-tree/description/)
> 
> [652. 寻找重复的子树](https://leetcode.cn/problems/find-duplicate-subtrees/description/)
> 
> [894. 所有可能的真二叉树](https://leetcode.cn/problems/all-possible-full-binary-trees/description/)

---

### 5.2 广度遍历（三种）

广度优先遍历也叫层序遍历，一层一层地遍历。

**实现方式**：队列辅助、队列+计算深度、队列+路径长度

**常见变体**：
- 从上到下打印
- 锯齿形层序遍历
- 每层的平均值

> 📝 **例题区域**：
> 
> [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/description/)

---

### 5.3 思维方式一：遍历一遍得到答案

遍历一遍得到答案，适合需要访问所有节点的问题。

**核心思想**：通过一次完整的遍历，在遍历过程中收集信息或执行操作。

**适用场景**：
- 计算树的最大深度
- 判断是否为平衡二叉树
- 路径总和
- 统计节点数量

> 📝 **例题区域**：
> 
> 

---

### 5.4 思维方式二：分解子问题得到答案

分解子问题得到答案，利用递归的思想。

**核心思想**：将问题分解为左右子树的子问题，通过子问题的解构建原问题的解。

**适用场景**：
- 翻转二叉树
- 合并二叉树
- 对称二叉树
- 构造二叉树

> 📝 **例题区域**：
> 
> 

---

## 六、二叉搜索树

二叉搜索树（BST）有个重要性质：中序遍历是有序的。

### 6.1 二叉搜索树

**BST 的性质**：
- 左子树所有节点的值 < 根节点的值
- 右子树所有节点的值 > 根节点的值
- 左右子树也都是 BST

**常见操作**：
- 查找：利用 BST 性质，时间复杂度 O(log n)
- 插入：找到合适位置插入
- 删除：需要考虑三种情况

**经典题目**：
- 验证二叉搜索树
- BST 中第 K 小的元素
- 二叉搜索树的最近公共祖先

> 📝 **例题区域**：
> 
> [1038. 从二叉搜索树到更大和树](https://leetcode.cn/problems/binary-search-tree-to-greater-sum-tree/description/)
> 
> [230. 二叉搜索树中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/description/)
> 
> [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/description/)

---

## 七、图技巧

图的题目通常比较复杂，但掌握几个基本算法就能应对大部分题目。

### 7.1 二分图判断

二分图是指可以将图中的节点分成两个集合，使得所有边都连接不同集合的节点。

**判断方法**：染色法

**核心思想**：
- 用两种颜色给节点染色
- 相邻节点必须是不同颜色
- 如果出现冲突，则不是二分图

> 📝 **例题区域**：
> 
> [785. 判断二分图](https://leetcode.cn/problems/is-graph-bipartite/description/)
> 
> [886. 可能的二分法](https://leetcode.cn/problems/possible-bipartition/description/)

---

### 7.2 并查集

并查集用于处理不相交集合的合并和查询问题。

**核心操作**：
- `find(x)`：查找 x 的根节点（路径压缩优化）
- `union(x, y)`：合并 x 和 y 所在的集合（按秩合并优化）

**适用场景**：
- 判断图中是否有环
- 朋友圈问题
- 岛屿数量
- 冗余连接

> 📝 **例题区域**：
> 
> [990. 等式方程的可满足性](https://leetcode.cn/problems/satisfiability-of-equality-equations/description/)
> 
> [547. 省份数量](https://leetcode.cn/problems/number-of-provinces/description/)
> 
> [1361. 验证二叉树](https://leetcode.cn/problems/validate-binary-tree-nodes/description/)

---

### 7.3 环检测与拓扑排序

#### （1）环检测

判断图中是否有环。

**方法**：
- **有向图**：DFS + 记录访问状态（白灰黑三色标记法）
- **无向图**：DFS + 记录父节点 或 并查集

> 📝 **例题区域**：
> 
> [207. 课程表](https://leetcode.cn/problems/course-schedule/description/)
> 
> [210. 课程表 II](https://leetcode.cn/problems/course-schedule-ii/description/)

---

#### （2）拓扑排序

对有向无环图（DAG）进行拓扑排序。

**核心思想**：
- 找入度为 0 的节点
- 删除该节点及其出边
- 重复上述步骤

**实现方式**：
- BFS（Kahn 算法）
- DFS（后序遍历的逆序）

**应用场景**：
- 课程表问题
- 任务调度

> 📝 **例题区域**：
> 
> 

---

## 写在最后

这些技巧都是我在刷题过程中慢慢总结出来的，每个技巧都会在后续补充更多的例题和详细解析。刷题不是目的，掌握这些思维方式才是关键。

希望这份总结能帮到正在刷题的你！如果有什么问题或者更好的技巧，欢迎交流～

---

> 📝 **持续更新中...**
