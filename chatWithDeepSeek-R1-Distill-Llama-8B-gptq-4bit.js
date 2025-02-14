// 引入 OpenAI API 客户端
const openai = require("openai");

const Openai= new openai({
    apiKey: "caonima", // 确保在环境变量中设置你的 API 密钥
    baseURL: 'http://127.0.0.1:12345/v1',
});
// 配置 OpenAI API

// 定义对话函数
async function chatWithOpenAI(prompt) {
    try {
        const response = await Openai.chat.completions.create({
            model: "any", // 使用的模型
            messages: [{ role: "user", content: prompt }],
        });
        console.log("回复:",response)
        console.log("AI 回复:", response.choices[0].text);
    } catch (error) {
        console.error("发生错误:", error);
    }
}

// 示例调用
chatWithOpenAI("你好,今天的天气怎么样?");