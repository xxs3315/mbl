# 数据库配置说明

本项目支持两种数据库配置：H2（嵌入式）和PostgreSQL（生产级），通过Spring Profile进行切换。

## 配置方式

### 1. H2数据库（默认）

H2是一个轻量级的嵌入式数据库，适合开发和测试环境。

**启动方式：**
```bash
# 使用默认配置（H2）
mvn spring-boot:run

# 或显式指定H2 profile
mvn spring-boot:run "-Dspring-boot.run.profiles=h2"
```

**配置特点：**
- 数据存储在 `./data/h2db.mv.db` 文件中
- 支持H2控制台：http://localhost:8080/h2-console
- 无需额外安装数据库
- 适合开发和测试

### 2. PostgreSQL数据库

PostgreSQL是一个功能强大的开源关系型数据库，适合生产环境。

**启动方式：**
```bash
# 使用PostgreSQL profile
mvn spring-boot:run "-Dspring-boot.run.profiles=postgresql"
```

**配置特点：**
- 需要先安装并启动PostgreSQL服务
- 默认连接：localhost:5432/mbl
- 支持连接池配置
- 适合生产环境

## PostgreSQL安装和配置

### 1. 安装PostgreSQL

**Windows:**
1. 下载PostgreSQL安装包：https://www.postgresql.org/download/windows/
2. 运行安装程序，设置密码
3. 记住端口号（默认5432）

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### 2. 创建数据库

```sql
-- 连接到PostgreSQL
psql -U postgres

-- 创建数据库
CREATE DATABASE mbl_pdf_queue;

-- 创建用户（可选）
CREATE USER mbl_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mbl_pdf_queue TO mbl_user;
```

### 3. 修改配置

编辑 `application-postgresql.properties` 文件：

```properties
# 数据库连接配置
spring.datasource.url=jdbc:postgresql://localhost:5432/mbl_pdf_queue
spring.datasource.username=postgres
spring.datasource.password=your_password

# 连接池配置
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

## 代码架构

### 接口设计

项目采用接口分离的设计模式：

1. **QueueService** - 队列服务接口
   - `H2QueueService` - H2实现
   - `PostgreSQLQueueService` - PostgreSQL实现

2. **QueueProcessor** - 队列处理器接口
   - `H2QueueProcessor` - H2实现
   - `PostgreSQLQueueProcessor` - PostgreSQL实现

3. **QueueController** - 统一的REST API控制器

### Profile配置

- `@Profile("h2")` - H2数据库相关组件
- `@Profile("postgresql")` - PostgreSQL数据库相关组件

## API端点

所有数据库配置都使用相同的API端点：

- `POST /api/queue/add` - 添加任务
- `GET /api/queue/stats` - 获取队列统计
- `GET /api/queue/pending` - 获取待处理任务
- `GET /api/queue/processing` - 获取处理中任务
- `GET /api/queue/completed` - 获取已完成任务
- `POST /api/queue/processor/start` - 启动处理器
- `POST /api/queue/processor/stop` - 停止处理器

## 演示页面

访问 http://localhost:8080/persistent-queue-demo.html 查看队列管理界面。

## 数据迁移

如果需要从H2迁移到PostgreSQL：

1. 启动H2配置，导出数据
2. 启动PostgreSQL配置，导入数据
3. 或者直接使用新的PostgreSQL数据库

## 性能对比

| 特性 | H2 | PostgreSQL |
|------|----|------------|
| 安装复杂度 | 简单 | 中等 |
| 性能 | 中等 | 高 |
| 并发支持 | 中等 | 优秀 |
| 数据持久性 | 文件 | 专业级 |
| 适用场景 | 开发/测试 | 生产环境 |

## 故障排除

### H2常见问题

1. **数据库文件锁定**
   - 确保没有其他进程访问数据库文件
   - 重启应用

2. **H2控制台无法访问**
   - 检查 `spring.h2.console.enabled=true`
   - 访问 http://localhost:8080/h2-console

### PostgreSQL常见问题

1. **连接失败**
   - 检查PostgreSQL服务是否启动
   - 验证连接参数（主机、端口、用户名、密码）
   - 确认数据库是否存在

2. **权限问题**
   - 确保用户有数据库访问权限
   - 检查防火墙设置

3. **连接池问题**
   - 调整连接池大小
   - 检查连接超时设置
