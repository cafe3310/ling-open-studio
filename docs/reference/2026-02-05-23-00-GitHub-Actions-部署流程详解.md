# GitHub Actions 自动化部署文档

## 1. 概述
本项目采用 GitHub Actions 实现持续集成与持续部署 (CI/CD)。每当代码推送到 `main` 分支时，流水线会自动触发，执行构建、组装产物，并将最终的可执行包推送到 Hugging Face Spaces。

文件路径：`.github/workflows/deploy-hf.yml`

## 2. 流水线流程详解

### 2.1 触发条件 (Trigger)
- **Push to main**: 当代码推送到主分支时触发。
- **Workflow Dispatch**: 支持在 GitHub Actions 界面手动点击按钮触发。

### 2.2 核心步骤 (Steps)

#### A. 环境初始化
1. **Checkout**: 拉取最新代码。
2. **Setup Tools**: 安装 `pnpm` (v10) 和 `Node.js` (v20)。

#### B. 依赖与构建
1. **配置 pnpm (关键)**:
   ```bash
   echo "node-linker=hoisted" >> .npmrc
   ```
   **作用**: 强制 pnpm 使用扁平化依赖结构，而非符号链接。这是为了确保后续 `standalone` 产物可以被正确复制，且在 Docker 容器中不会出现路径断裂。
   
2. **Install & Build**:
   执行 `pnpm install` 和 `pnpm build`。此时 Next.js 会根据 `next.config.ts` 中的 `output: 'standalone'` 生成精简版的服务器文件。

#### C. 产物组装 (Artifact Preparation)
脚本会在 Runner 中创建一个临时的 `deploy_package` 目录，完全模拟我们在本地验证过的结构：
1. `Dockerfile` (从根目录 `Dockerfile.hf` 复制)
2. `public/` (静态资源)
3. `.next/static/` (浏览器端 JS/CSS)
4. `server.js` 及 `node_modules` (从 `.next/standalone` 提取)

#### D. 部署 (Push to Hugging Face)
1. 进入 `deploy_package` 目录。
2. 初始化一个新的 Git 仓库。
3. **强制添加**所有文件 (包括通常被忽略的构建产物)。
4. 使用提供的 Secrets，将该目录的内容**强制推送 (Force Push)** 到 Hugging Face Space 的仓库。

## 3. 配置指南

要启用此流水线，你需要在 GitHub 仓库中配置以下 Secrets：

| Secret Name | 描述 | 获取方式 |
| :--- | :--- | :--- |
| `HF_TOKEN` | Hugging Face 访问令牌 | HF Settings -> Access Tokens (需 Write 权限) |
| `HF_SPACE_NAME` | 目标 Space ID | 格式如 `username/space-name` |

### 配置路径
GitHub Repo -> Settings -> Secrets and variables -> Actions -> New repository secret

## 4. 故障排查

- **Permission denied (publickey)**: 检查 `HF_TOKEN` 是否正确，且拥有 Write 权限。
- **File not found (Dockerfile)**: 确保根目录下存在 `Dockerfile.hf`。
- **Docker build failed (on HF)**: 
    - 如果 HF Space 显示构建失败，请先在本地按照《部署手册-本地构建与产物组装.md》进行验证。
    - 检查 `.npmrc` 是否正确设置了 `node-linker=hoisted`。
