# AI 算命网站 | 懂你的彷徨

> 表面是算命，本质是情绪共情 + 人生阶段解读

基于心理学与叙事疗法的 AI 解读，帮助 18~35 岁用户理清情感、事业与人生方向焦虑。

## 技术栈

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Framer Motion**
- **OpenAI API** / **Google Gemini API** (可选)

## 算命方式

- 🃏 **塔罗牌**：抽取牌面，解读当下能量与指引
- 📿 **八字**：生辰八字，五行命理解读
- ✨ **星座**：星盘运势，当下阶段解读
- 🌟 **紫薇星数**：紫薇斗数，命盘格局分析

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)

## 环境变量

复制 `.env.example` 为 `.env` 并配置：

```env
# Gemini 优先（若两者都配置）
GEMINI_API_KEY=xxx
GEMINI_MODEL=gemini-1.5-flash

# OpenAI 备选
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o-mini
```

不配置时使用内置示例回复。

## 产品流程

1. **首页** → 选择算命方式（塔罗 / 八字 / 星座 / 紫薇）
2. **输入页** → 选择场景 + 描述状态 + 按需填写出生信息
3. **结果页** → 分段展示：共情 → 运势解读 → 行动建议

## 项目结构

```
src/
├── app/
│   ├── page.tsx           # 首页
│   ├── fortune/page.tsx   # 算命输入页
│   ├── result/[sessionId] # 解读结果页
│   └── api/fortune/       # API 路由
├── lib/
│   ├── ai.ts              # AI 生成逻辑
│   ├── fortune.ts         # 场景与文案
│   └── store.ts           # 内存存储（MVP 用）
```

## 部署到 Vercel（通过 GitHub）

### 方式一：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lilithliu0323/EskimoGame)

### 方式二：通过 Vercel 控制台

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **连接 Vercel**
   - 打开 [vercel.com](https://vercel.com)，使用 GitHub 登录
   - 点击 **Add New...** → **Project**
   - 选择你的 **EskimoGame** 仓库，点击 **Import**

3. **配置项目**
   - Framework Preset 默认已识别为 Next.js，无需修改
   - 如需 AI 解读，在 **Environment Variables** 中添加：
     - `GEMINI_API_KEY` 或 `OPENAI_API_KEY`
     - `GEMINI_MODEL` / `OPENAI_MODEL`（可选）

4. **部署**
   - 点击 **Deploy**，等待构建完成
   - 部署成功后即可获得 `*.vercel.app` 域名

5. **后续更新**
   - 每次 push 到 `main` 分支，Vercel 会自动重新部署

---

注意：当前使用内存存储，服务重启后数据会丢失。生产环境需接入 Redis 或数据库。
