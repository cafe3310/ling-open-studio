# 2026-02-08-23-00-技术文档-Monorepo本地构建与Docker验证指南

## 1. 背景 (Background)

在项目迁移至 Monorepo 架构后，构建产物的布局发生了变化（使用了 Next.js 的 `standalone` 模式）。为了确保开发者能够在本地顺利验证生产环境镜像，并为 CI/CD 提供可靠的打包逻辑参考，特撰写此指南。

## 2. 本地生产构建 (Local Build)

在根目录下执行以下命令进行全量构建：

```bash
# 安装依赖 (建议使用 pnpm)
pnpm install

# 执行子包 @ling/studio 的构建
pnpm build
```

构建完成后，产物将存放在 `apps/studio/.next/standalone` 目录下。

## 3. Docker 验证流程 (Docker Verification)

由于 `standalone` 模式生成的依赖路径（`node_modules`）和启动脚本（`server.js`）在 Monorepo 结构下具有特定的相对层级，因此在构建 Docker 镜像前需要进行正确的“上下文组装”。

### 3.1 组装构建上下文 (Assembly)

建议创建一个临时目录（如 `docker_test`）来模拟部署环境：

```bash
# 1. 创建测试目录
mkdir -ptmp.docker_test

# 2. 复制公共资源与静态资源
# 这些文件不包含在 standalone 中，必须手动复制
cp -r apps/studio/publictmp.docker_test/public
mkdir -ptmp.docker_test/.next
cp -r apps/studio/.next/statictmp.docker_test/.next/static

# 3. 复制 standalone 核心产物 (包含 node_modules 和 server.js)
# 注意：这会保持 apps/studio/server.js 的层级
cp -R apps/studio/.next/standalone/.tmp.docker_test/

# 4. 复制 Dockerfile 和子包 package.json
cp apps/studio/Dockerfile.hftmp.docker_test/Dockerfile
cp apps/studio/package.jsontmp.docker_test/
```

### 3.2 运行 Docker 构建

```bash
cd tmp.docker_test
docker build -t studio-test .
```

### 3.3 启动并验证

```bash
# 映射 7860 端口并传入必要的环境变量 (可选)
docker run -p 7860:7860 studio-test
```

访问 `http://localhost:7860` 确认 UI 是否正常加载。

## 4. 关键架构细节 (Key Architectural Details)

### 4.1 为什么 server.js 在子目录？
在 Monorepo 中，Next.js 为了保证相对路径（如寻找 `../../node_modules`）的正确性，会将 `server.js` 生成在 `apps/studio/server.js` 位置。

### 4.2 Dockerfile 启动指令
`Dockerfile.hf` 已针对此结构进行了优化：
```dockerfile
# 启动命令必须指向子包路径
CMD ["node", "apps/studio/server.js"]
```

### 4.3 静态资源映射
Next.js 独立服务器默认会在 `server.js` 所在目录的同级寻找 `public` 和 `.next/static`。
本项目的 `Dockerfile` 显式地将它们映射到了正确位置：
- `docker_test/public` -> `/app/apps/studio/public`
- `docker_test/.next/static` -> `/app/apps/studio/.next/static`

## 5. 与 CI/CD 的关联

本指南所述的组装逻辑已同步集成至 `.github/workflows/deploy-hf.yml` 中。GitHub Actions 会自动执行这些步骤，并将组装好的 `deploy_package` 推送到 Hugging Face Spaces。
