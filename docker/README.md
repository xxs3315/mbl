# Docker 环境配置说明

## 环境变量文件

本项目使用环境变量文件来管理敏感信息和配置参数，以提高安全性和灵活性。

### 文件说明

- `.dev.env` - 示例环境变量文件，供参考和复制使用
- `.prod.env` - PostgreSQL 数据库生产环境变量文件

### 使用方法

#### 1. 测试环境变量文件

```bash
docker-compose -f mbl.docker-compose.dev.yml --env-file .dev.env up -d
```

#### 2. 生产环境变量文件

```bash
docker-compose -f mbl.docker-compose.dev.yml --env-file .prod.env up -d
```

### 环境变量说明

| 变量名 | 说明 | 开发环境默认值                  |
|--------|------|--------------------------|
| POSTGRES_PASSWORD | PostgreSQL 数据库密码 | test                     |
| PGADMIN_DEFAULT_EMAIL | pgAdmin 登录邮箱 | test@test.com            |
| PGADMIN_DEFAULT_PASSWORD | pgAdmin 登录密码 | test                     |
| DB_PORT | 数据库端口 | 5432                     |
| DB_NAME | 数据库名称 | mbl                      |
| DB_HOST | 数据库主机地址 | localhost                |
| DB_USERNAME | 数据库用户名 | mbl                      |
| DB_PASSWORD | 数据库密码 | mbl                      |
| API_PORT | API 服务端口 | 29080                    |
| IMAGE_UPLOAD_MAX_SIZE | 图片上传最大大小 | 50MB                     |
| PDF_OUT_DIR | PDF 输出目录 | /home/ubuntu/mbl/pdfs/   |
| IMAGE_OUT_DIR | 图片输出目录 | /home/ubuntu/mbl/images/ |
| LOG_DIR | 日志目录 | /var/log/mbl             |

### 安全建议

1. 将 `.prod.env` 文件添加到 `.gitignore` 中，避免提交到版本控制系统
2. 在生产环境中使用强密码
3. 定期轮换敏感信息
4. 为不同环境创建不同的环境变量文件