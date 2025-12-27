---
title: "《Spring 框架知识个人笔记》"
date: 2022-10-15 15:00:00 +0800
categories: [Java框架, Spring]
tags: [Spring, SpringBoot, IOC, AOP, SpringMVC, 事务管理]
---

## 一、IOC（控制反转）

### 1. 介绍

**IoC**（Inverse of Control：控制反转）是一种**设计思想**。

**核心概念**：
- 将原本在程序中手动创建对象的控制权，交由 Spring 框架来管理
- 对象之间的相互依赖关系交给 IoC 容器来管理
- 由 IoC 容器完成对象的注入
- 而且是一个**单例**的注入

---

### 2. 解决问题

✅ 解决对象之间的**耦合度过高**的问题

---

### 3. 功能

#### （1）依赖注入功能

**IoC 容器的本质**：
- IoC 容器是 Spring 用来实现 IoC 的载体
- IoC 容器实际上就是个 **Map（key, value）**
- Map 中存放的是各种对象

---

## 二、AOP（面向切面编程）

### 1. 介绍

**AOP**（Aspect-Oriented Programming：面向切面编程）

**核心思想**：
- 能够将那些**与业务无关**，却为业务模块所**共同调用的逻辑或责任**封装起来
- 例如：事务处理、日志管理、权限控制等

**优点**：
- ✅ 减少系统的重复代码
- ✅ 降低模块间的耦合度
- ✅ 有利于未来的可拓展性和可维护性

---

### 2. Spring AOP 支持的代理类型

Spring AOP 同时支持 **CGLIB**、**JDK 动态代理**

#### 选择规则

| 情况 | 使用的代理方式 |
|------|--------------|
| **目标类实现了接口** | JDK 动态代理 |
| **目标类没有实现接口** | CGLIB（通过继承目标类得到一个子类，覆盖其中的方法） |

---

### 3. Spring AOP 和 AspectJ AOP 有什么区别

| 特性 | Spring AOP | AspectJ AOP |
|------|-----------|-------------|
| **增强时机** | 运行时增强 | 编译时增强 |
| **实现方式** | 基于代理（Proxying） | 基于字节码操作（Bytecode Manipulation） |
| **性能** | 切面较少时，两者性能差异不大 | 切面太多时，AspectJ 性能更好 |

> 💡 **建议**：当切面太多的话，最好选择 AspectJ

---

## 三、Spring Bean

### 1. Spring Bean 的作用域

| 作用域 | 说明 |
|--------|------|
| **singleton** | 唯一 bean 实例<br>⭐️ Spring 中的 bean 默认都是单例的 |
| **prototype** | 每次请求都会创建一个新的 bean 实例 |
| **request** | 每一次 HTTP 请求都会产生一个新的 bean<br>该 bean 仅在当前 HTTP request 内有效 |
| **session** | 每一次 HTTP 请求都会产生一个新的 bean<br>该 bean 仅在当前 HTTP session 内有效 |

---

### 2. Spring 中的单例 bean 的线程安全问题

#### 问题分析

**何时会有线程安全问题？**
- 当多个线程操作同一个对象的时候
- 对这个对象的**成员变量**的写操作会存在线程安全问题

**实际情况**：
- 一般情况下，我们常用的 **Controller**、**Service**、**Dao** 这些 Bean 是**无状态**的
- 无状态的 Bean 不能保存数据，因此是**线程安全**的

---

#### 解决方案

##### 方案 1：配置为 prototype 模式

```java
@Scope("prototype")
@Service
public class UserService {
    // ...
}
```

**特点**：
- ✅ 每一个线程都创建一个 prototype 实例
- ❌ 会产生很多的实例，消耗较多的内存空间

---

##### 方案 2：使用 ThreadLocal 变量

```java
@Service
public class UserService {
    private ThreadLocal<User> currentUser = new ThreadLocal<>();
    
    // ...
}
```

**特点**：
- ✅ 为每一条线程设置变量副本
- ✅ 不会消耗过多内存

---

### 3. @Component 和 @Bean 的区别是什么？

| 特性 | @Component | @Bean |
|------|-----------|-------|
| **作用对象** | 作用于**类** | 作用于**方法** |
| **扫描方式** | 通过类路径扫描来自动侦测以及自动装配到 Spring 容器中<br>（使用 `@ComponentScan` 注解定义要扫描的路径） | 在标有该注解的方法中定义产生这个 bean<br>`@Bean` 告诉了 Spring 这是某个类的实例，当需要用它的时候还给我 |
| **自定义性** | 较弱 | 较强 |
| **使用场景** | 自己编写的类 | 第三方库中的类需要装配到 Spring 容器时 |

> 💡 **总结**：`@Bean` 注解比 `@Component` 注解的自定义性更强，而且很多地方我们只能通过 `@Bean` 注解来注册 bean。

---

### 4. Spring Bean 的生命周期

Spring Bean 的生命周期分为**四个主要阶段**以及多个扩展点。

---

#### 四个主要阶段

```
┌──────────────┐
│ 1. 实例化     │  Instantiation
│ Instantiation│
└──────┬───────┘
       ↓
┌──────────────┐
│ 2. 属性赋值   │  Populate
│ Populate     │
└──────┬───────┘
       ↓
┌──────────────┐
│ 3. 初始化     │  Initialization
│ Initialization│
└──────┬───────┘
       ↓
┌──────────────┐
│ 4. 销毁      │  Destruction
│ Destruction  │
└──────────────┘
```

---

#### 主要逻辑

主要逻辑都在 `doCreate()` 方法中，逻辑很清晰，就是顺序调用以下三个方法：

1. `createBeanInstance()` → 实例化
2. `populateBean()` → 属性赋值
3. `initializeBean()` → 初始化

---

#### Bean 的完整生命流程

1. **Bean 容器**找到配置文件中 Spring Bean 的定义

2. **Bean 容器**利用 Java Reflection API 创建一个 Bean 的实例

3. 如果涉及到一些属性值，利用 `set()` 方法设置一些属性值

4. 如果 Bean 实现了 **BeanNameAware** 接口
   - 调用 `setBeanName()` 方法，传入 Bean 的名字

5. 如果 Bean 实现了 **BeanClassLoaderAware** 接口
   - 调用 `setBeanClassLoader()` 方法，传入 ClassLoader 对象的实例

6. 如果还实现了其他 **`*.Aware`** 接口
   - 就调用相应的方法

7. 如果有和加载这个 Bean 的 Spring 容器相关的 **BeanPostProcessor** 对象
   - 执行 `postProcessBeforeInitialization()` 方法

8. 如果 Bean 实现了 **InitializingBean** 接口
   - 执行 `afterPropertiesSet()` 方法

9. 如果 Bean 在配置文件中的定义包含 **init-method** 属性
   - 执行指定的方法

10. 如果有和加载这个 Bean 的 Spring 容器相关的 **BeanPostProcessor** 对象
    - 执行 `postProcessAfterInitialization()` 方法

11. 当要销毁 Bean 的时候，如果 Bean 实现了 **DisposableBean** 接口
    - 执行 `destroy()` 方法

12. 当要销毁 Bean 的时候，如果 Bean 在配置文件中的定义包含 **destroy-method** 属性
    - 执行指定的方法

---

### 5. Spring Bean 的循环依赖问题，以及解决方式

#### 问题定义

**Bean 的循环依赖**：
- Spring bean 的创建过程中，会遇到对象与对象之间的依赖
- 比如 A 类中有一个属性 B 类
- 那么 Spring 在创建 A 对象的时候发现了需要一个 B 对象
- 这个时候 Spring 就会暂时停止对 A 的创建，会先去创建 B 对象
- 等 B 对象创建完之后，将 B 对象注入到 A 对象中，再接着创建 A 对象剩下的工作

**问题场景**：
- 假如 A 类中需要一个 B 对象，B 类需要一个 A 对象
- 就会产生死循环，这就是**循环依赖问题**

---

#### 解决方案

Spring 是通过**递归**的方式获取目标 bean 及其所依赖的 bean 的。

##### Spring 实例化 Bean 的两个步骤

1. **Bean 对象实例化**（还只是个半成品）
2. **Bean 对象属性实例化**（完全体）

---

##### 解决思路

以 A、B bean 的创建为例：

**步骤 1**：
- Spring 实例化一个 A 的对象
- 这时候其实还只是 A 的半成品
- **存入 IOC 容器**

**步骤 2**：
- 然后实例化 A 的属性
- 发现依赖 B 对象
- Spring 实例化 B 对象（半成品）
- **存入 IOC 容器**

**步骤 3**：
- 然后实例化 B 的属性
- 发现依赖 A 对象
- 这时候**查找 IOC 容器**，发现存在 A 对象
- 直接注入 B 的属性 → A 对象
  - 虽然只是半成品，但是属性的赋值只是简单的引用
  - 所以不关注 A 对象是否是一个完整的对象

**步骤 4**：
- 然后这时候 A 对象就可以注入自己的属性 → B 对象
- 解决循环依赖的问题

---

## 四、Spring 框架中用到了哪些设计模式？

| 设计模式 | 应用场景 |
|---------|---------|
| **工厂设计模式** | Spring 使用工厂模式通过 BeanFactory、ApplicationContext 创建 bean 对象 |
| **代理设计模式** | Spring AOP 功能的实现 |
| **单例设计模式** | Spring 中的 Bean 默认都是单例的 |
| **模板方法模式** | Spring 中 `jdbcTemplate`、`hibernateTemplate` 等以 Template 结尾的对数据库操作的类 |
| **包装器设计模式** | 项目需要连接多个数据库，不同的客户在每次访问中根据需要会去访问不同的数据库<br>这种模式让我们可以根据客户的需求能够动态切换不同的数据源 |
| **观察者模式** | Spring 事件驱动模型就是观察者模式很经典的一个应用 |
| **适配器模式** | Spring AOP 的增强或通知（Advice）使用到了适配器模式<br>Spring MVC 中也是用到了适配器模式适配 Controller |

---

## 五、Spring 事务

### Spring 管理事务的方式有几种？

#### 1. 编程式事务

在代码中硬编码（❌ 不推荐使用）

---

#### 2. 声明式事务（✅ 推荐使用）

- **基于 XML 的声明式事务**
- **基于注解的声明式事务**

---

### Spring 事务中的隔离级别有哪几种？

`TransactionDefinition` 接口中定义了五个表示隔离级别的常量：

| 隔离级别 | 说明 | 脏读 | 不可重复读 | 幻读 |
|---------|------|------|-----------|------|
| **ISOLATION_DEFAULT** | 使用后端数据库默认的隔离级别<br>• MySQL 默认：REPEATABLE_READ<br>• Oracle 默认：READ_COMMITTED | - | - | - |
| **ISOLATION_READ_UNCOMMITTED**<br>（读未提交） | 最低的隔离级别<br>允许读取尚未提交的数据变更 | ✅ 可能 | ✅ 可能 | ✅ 可能 |
| **ISOLATION_READ_COMMITTED**<br>（读已提交） | 允许读取并发事务已经提交的数据<br>可以阻止脏读 | ❌ 不会 | ✅ 可能 | ✅ 可能 |
| **ISOLATION_REPEATABLE_READ**<br>（可重复读） | 对同一字段的多次读取结果都是一致的<br>除非数据是被本身事务自己所修改<br>可以阻止脏读和不可重复读 | ❌ 不会 | ❌ 不会 | ✅ 可能 |
| **ISOLATION_SERIALIZABLE**<br>（可串行化） | 最高的隔离级别<br>完全服从 ACID 的隔离级别<br>所有的事务依次逐个执行<br>可以防止脏读、不可重复读以及幻读<br>⚠️ 严重影响程序的性能，通常不会用到 | ❌ 不会 | ❌ 不会 | ❌ 不会 |

---

### Spring 事务中哪几种事务传播行为？

#### 支持当前事务的情况

| 传播行为 | 说明 |
|---------|------|
| **PROPAGATION_REQUIRED** | 如果当前存在事务，则加入该事务<br>如果当前没有事务，则创建一个新的事务 |
| **PROPAGATION_SUPPORTS** | 如果当前存在事务，则加入该事务<br>如果当前没有事务，则以非事务的方式继续运行 |
| **PROPAGATION_MANDATORY** | 如果当前存在事务，则加入该事务<br>如果当前没有事务，则抛出异常<br>（mandatory：强制性） |

---

#### 不支持当前事务的情况

| 传播行为 | 说明 |
|---------|------|
| **PROPAGATION_REQUIRES_NEW** | 创建一个新的事务<br>如果当前存在事务，则把当前事务挂起 |
| **PROPAGATION_NOT_SUPPORTED** | 以非事务方式运行<br>如果当前存在事务，则把当前事务挂起 |
| **PROPAGATION_NEVER** | 以非事务方式运行<br>如果当前存在事务，则抛出异常 |

---

#### 其他情况

| 传播行为 | 说明 |
|---------|------|
| **PROPAGATION_NESTED** | 如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行<br>如果当前没有事务，则该取值等价于 PROPAGATION_REQUIRED |

---

## 六、Spring MVC

### 1. MVC 设计模式

以早期 JavaWeb 开发模式举例：

| 层次 | 技术 | 职责 |
|------|------|------|
| **Model 模型**<br>（JavaBean） | Entity、Service、Dao | **承载数据**，并对用户提交请求进行计算<br>• 数据承载 Bean：实体类，专门承载业务数据（如 Student、User 等）<br>• 业务处理 Bean：Service 或 Dao 对象，专门用于处理用户提交的请求 |
| **View 视图**<br>（JSP） | JSP | 为用户提供使用界面，与用户直接进行交互 |
| **Controller 控制器**<br>（Servlet） | Servlet | 用于将用户请求转发给相应的 Model 进行处理<br>并将处理 Model 的计算结果向用户提供相应响应 |

---

### 2. 基于 MVC 开发模式下的 Spring MVC 模式

| 层次 | 组成 |
|------|------|
| **Model 模型** | • 数据承载 Bean（entity）<br>• 业务处理 Bean（service、dao 层） |
| **View 视图** | 返回的 ModelAndView 类，返回的视图 |
| **Controller 控制器** | 正常的控制层（Controller 层） |

---

### 3. Spring MVC 简单工作原理

```
┌─────────┐
│  Client │ 客户端
└────┬────┘
     │ 1. 发送请求
     ↓
┌─────────────────────┐
│ DispatcherServlet   │ 前端控制器
└────┬────────────┬───┘
     │            │
     │ 2. 查找   │ 5. 返回
     │  Handler   │   结果
     ↓            ↓
┌──────────────┐ ┌────────────┐
│ HandlerMapping│ │ViewResolver│
│ 处理器映射器   │ │视图解析器   │
└──────┬───────┘ └─────┬──────┘
       │                │
       │ 3. 执行        │ 4. 解析
       ↓                ↓
┌───────────────┐ ┌────────────┐
│HandlerAdapter │ │   View     │
│ 处理器适配器   │ │   视图     │
└───────────────┘ └────────────┘
```

---

### 4. Spring MVC 工作流程

#### 流程说明（重要⭐️）

**第 0 步：项目启动**
- 在第一条请求到来之前，也就是 Spring 项目启动之后
- Spring 会先根据配置文件，扫描相应包下的 java 文件
- 把所有带有 Spring bean 注解的文件都挑选出来
- 通过**反射机制 + 单例模式**实例化这些 spring bean
- 存到 **IOC 容器**中供其他 spring bean 依赖注入使用

---

**第 1 步：请求到达**
- 客户端发送一条请求
- Tomcat 的 socket 监听到了这条请求
- 解析 URL，交给 Tomcat 下部署的相应项目
- 其实就是交给了相应项目的 Spring MVC 的 **DispatcherServlet**
  - Tomcat 只能与 servlet 交互

---

**第 2 步：查找处理器**
- **DispatcherServlet** 根据请求信息调用 **HandlerMapping**（处理映射器）
- 找到对应的 handler（也就是 controller）

---

**第 3 步：处理请求**
- 通过找到的 Controller，交由 **HandlerAdapter**（处理适配器）处理
- 适配器会根据不同的 Controller 中方法的逻辑去处理请求

---

**第 4 步：返回数据**
- 处理器处理完业务后，返回数据
- 数据可以是视图类型的 **ModelAndView** 对象
- 也可以是 **JSON 格式**的数据

---

**第 5 步：视图解析（如果需要）**
- 如果是视图类型的话
- 还需要 **ViewResolver**（视图解析器）处理一下
- 最后将结果返回给 DispatcherServlet 返回给请求者

---

## 七、Spring Boot

### 1. Spring Boot 的启动流程

Spring Boot 的启动流程主要包括以下几个步骤：

#### 步骤 1：SpringApplication 实例化

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

---

#### 步骤 2：准备环境

- 加载配置文件（application.properties/yml）
- 初始化系统属性
- 准备应用程序上下文环境

---

#### 步骤 3：创建应用上下文

根据应用类型创建对应的 ApplicationContext：
- Web 应用：创建 AnnotationConfigServletWebServerApplicationContext
- 非 Web 应用：创建 AnnotationConfigApplicationContext

---

#### 步骤 4：准备上下文

- 设置环境变量
- 执行 ApplicationContextInitializer
- 打印 Banner

---

#### 步骤 5：刷新上下文

- 扫描并加载所有的 Bean 定义
- 实例化单例 Bean
- 初始化 Bean
- 执行自动配置

---

#### 步骤 6：启动完成

- 执行 CommandLineRunner 和 ApplicationRunner
- 发布 ApplicationReadyEvent 事件
- 应用启动完成，准备接收请求

---

### 2. Spring Boot 自动装配原理

Spring Boot 的自动装配是通过 `@EnableAutoConfiguration` 注解实现的。

---

#### 核心注解

```java
@SpringBootApplication
    ├── @SpringBootConfiguration
    ├── @EnableAutoConfiguration  // 核心
    └── @ComponentScan
```

---

#### @EnableAutoConfiguration 的工作原理

##### 步骤 1：导入 AutoConfigurationImportSelector

```java
@EnableAutoConfiguration
    └── @Import(AutoConfigurationImportSelector.class)
```

---

##### 步骤 2：加载自动配置类

`AutoConfigurationImportSelector` 会：

1. 读取 `META-INF/spring.factories` 文件
2. 获取所有的自动配置类（xxxAutoConfiguration）
3. 根据条件注解（@ConditionalOnXxx）判断是否需要加载

---

##### 步骤 3：条件装配

常见的条件注解：

| 条件注解 | 说明 |
|---------|------|
| `@ConditionalOnClass` | 当类路径下有指定的类时才会装配 |
| `@ConditionalOnMissingClass` | 当类路径下没有指定的类时才会装配 |
| `@ConditionalOnBean` | 当容器中有指定的 Bean 时才会装配 |
| `@ConditionalOnMissingBean` | 当容器中没有指定的 Bean 时才会装配 |
| `@ConditionalOnProperty` | 当配置文件中有指定的属性时才会装配 |

---

##### 步骤 4：属性绑定

通过 `@EnableConfigurationProperties` 和 `@ConfigurationProperties` 注解：
- 将配置文件中的属性绑定到 Java 对象上

---

#### 自动装配流程图

```
1. 启动应用
    ↓
2. 加载 @SpringBootApplication
    ↓
3. 触发 @EnableAutoConfiguration
    ↓
4. AutoConfigurationImportSelector 扫描
    ↓
5. 读取 META-INF/spring.factories
    ↓
6. 加载所有 xxxAutoConfiguration 类
    ↓
7. 根据 @ConditionalOnXxx 判断是否装配
    ↓
8. 装配符合条件的 Bean
    ↓
9. 绑定配置属性
    ↓
10. 应用启动完成
```

---

#### 示例：DataSource 自动配置

```java
@Configuration
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public DataSource dataSource(DataSourceProperties properties) {
        // 创建 DataSource
    }
}
```

**工作流程**：
1. 判断类路径下是否有 DataSource 类
2. 如果有，且容器中没有 DataSource Bean
3. 则根据 application.properties 中的配置创建 DataSource
4. 将 DataSource 注册到容器中

---

#### 核心优势

Spring Boot 自动装配的核心优势：

- ✅ **约定大于配置**：提供合理的默认配置
- ✅ **开箱即用**：添加依赖即可使用
- ✅ **灵活可配**：可以通过配置文件覆盖默认配置
- ✅ **条件装配**：根据实际情况智能装配

---

> 📚 **参考资料**：本文内容基于个人学习笔记整理
