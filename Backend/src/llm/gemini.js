import { GoogleGenAI } from "@google/genai";
import { ILLMProvider } from "./interface.js";
import { PromptComposer } from "../review/promptComposer.js";

export default class GeminiProvider extends ILLMProvider {
  constructor(apiKey) {
    super();
    this.client = new GoogleGenAI({ apiKey });
    this.model = this.client.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async review(packet) {
    const systemPrompt = PromptComposer.getSystemPrompt();
    const userPrompt = PromptComposer.getUserPrompt(packet);

    try {
      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        generationConfig: {
          temperature: 0.1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      });

      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Gemini Execution Failed:', error.message);
      throw error;
    }
  }
}
