import type { FortuneInput, FortuneContent } from "./fortune";

const MOCK_RESPONSES: Record<string, FortuneContent> = {
  emotion: {
    empathy:
      "你现在的状态，很像在「放下」和「还放不下」之间来回拉扯。刚分手一个月，情绪反复很正常——今天觉得可以往前走了，明天可能又想起以前的事。很多人都会经历这种「时好时坏」的阶段，不是你不够坚强，而是这段关系对你来说确实重要。",
    narrative:
      "从你当下的能量来看，你正处在「告别期」的尾巴。不是说这段感情没有意义，而是你正在慢慢从「两个人」的模式里抽离出来，重新适应「一个人」的节奏。这个过程会有一点反复，但整体是在往「更清醒」的方向走的。接下来的 1~2 个月，你可能还会偶尔低落，但也会逐渐发现，有些事已经没那么难接受了。",
    suggestions:
      "1. 给自己一个「难过额度」：每天允许自己难过 15 分钟，时间到了就去做别的事，不强迫自己马上开心。\n2. 做一件「告别小仪式」：比如写一封信不寄出、删掉一张照片，用一个小动作帮自己划个句号。\n3. 别急着决定「要不要等」：先问自己「等下去，我还能接受最坏的结果吗？」答案会慢慢清晰。",
  },
  career: {
    empathy:
      "工作三年卡在一个「想动又不敢动」的位置，这种憋屈感很真实。一方面觉得现在的工作没啥意思，另一方面又怕跳出去更糟。你不是不够努力，而是「要什么」这件事，本来就不是一下能想清楚的——很多人到三十岁还在试错，你现在的迷茫很正常。",
    narrative:
      "从你现在的阶段来看，你正处在「积累期」和「探索期」的交接点。过去三年可能更多是在适应职场、完成任务，而接下来更适合问自己：除了薪水，我还想从工作里得到什么？是成就感、学习空间，还是生活节奏？这个问题不用一步到位，但可以先把「最不想要的」列出来，反推你更适合的方向。",
    suggestions:
      "1. 做一次「职业清单」：列出你过去三年做过的、觉得还有点意思的事，哪怕很小，看看有没有共性。\n2. 跟 2~3 个不同行业的朋友聊聊：不用问「我该不该跳」，就问他们「你工作中最爽和最烦的是什么」。\n3. 给自己一个「不换工作的理由」：如果暂时不跳，那接下来半年你想在这份工作里争取到什么？这样即使留下，也不是被动挨打。",
  },
  low: {
    empathy:
      "这种「什么都提不起劲」的感觉，很像心里有一层雾，说不清具体是什么，但就是挡在面前。很多人都有过这种阶段——不是发生了多严重的事，而是突然觉得「好像也就这样」。这种状态不代表你的人生没意义，更可能是你在经历一段「低能量期」，需要先被看见，再慢慢恢复。",
    narrative:
      "从你当下的状态来看，你正处在一种「过渡期」——可能是从某个阶段结束，还没找到下一个阶段的节奏。这种时候，大脑和身体都会进入一种「省电模式」，不是你不努力，而是内在在提醒你：需要缓一缓。低谷期往往也是「重新排列优先级」的时候，不用急着找意义，先照顾好基本的生活节奏，意义会慢慢浮现。",
    suggestions:
      "1. 只做「最小可执行」的事：每天完成一件小事就行，比如出门走 10 分钟、洗个澡、收拾一个抽屉，用「做到了」代替「没意义」。\n2. 减少「意义追问」：这几天少问自己「人生有什么意义」，多问「今天我能做一件让自己舒服一点的事吗」。\n3. 如果持续两周以上仍然很低落，建议跟信任的人聊聊，或考虑找专业支持——这不是软弱，是把自己当回事。",
  },
};

const SYSTEM_PROMPT = `你是一名温和、共情的「人生阶段解读师」，擅长用叙事疗法和心理学视角帮用户理解当下状态。你的输出必须分段，且遵循以下格式：

【共情段】
- 必须引用用户原话中的关键描述（至少 1 句）
- 用「你」和「我们」增强对话感
- 加入「很多人会这样」等正常化表述
- 禁止使用：一切都会好起来、你要相信自己、时间会治愈一切

【运势叙事段】
- 用「阶段」「能量」「节奏」等中性词，不用「命运」「注定」等绝对化词
- 给出可理解的因果感，如「因为…所以你现在…」
- 禁止预测具体事件（如结婚、发财、出事）

【建议段】
- 每条建议以动词开头，可在一周内完成
- 2~3 条即可，不要超过 4 条
- 禁止说教、强迫、过度承诺

请直接输出三段内容，用以下 JSON 格式，不要有 markdown 代码块包裹：
{"empathy":"共情段内容","narrative":"运势叙事段内容","suggestions":"建议段内容，每条用换行分隔，格式如 1. xxx\\n2. xxx"}`;

function parseAIResponse(text: string): FortuneContent {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      empathy: parsed.empathy || "",
      narrative: parsed.narrative || "",
      suggestions: parsed.suggestions || "",
    };
  } catch {
    const lines = text.split("\n\n");
    return {
      empathy: lines[0] || "",
      narrative: lines[1] || "",
      suggestions: lines[2] || "",
    };
  }
}

export async function generateFortune(input: FortuneInput): Promise<FortuneContent> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const mock = MOCK_RESPONSES[input.scene] || MOCK_RESPONSES.low;
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
    return mock;
  }

  const userPrompt = `用户输入：
- 场景：${input.scene === "emotion" ? "情感困惑" : input.scene === "career" ? "事业迷茫" : "人生低谷"}
- 描述：${input.description}
${input.extra ? `- 补充：${input.extra}` : ""}
${input.birthDate ? `- 出生日期：${input.birthDate}` : ""}`;

  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    const fallback = MOCK_RESPONSES[input.scene] || MOCK_RESPONSES.low;
    return fallback;
  }

  return parseAIResponse(content);
}
