import { GoogleGenAI } from "@google/genai";
import { ILLMProvider } from "./interface.js";
import { PromptComposer } from "../review/promptComposer.js";

export default class GeminiProvider extends ILLMProvider {
  constructor(apiKey) {
    super();
    this.client = new GoogleGenAI({ apiKey });
  }

  async review(packet) {
    const systemPrompt = PromptComposer.getSystemPrompt();
    const userPrompt = PromptComposer.getUserPrompt(packet);

    try {
      const result = await this.client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemPrompt}\n\n${userPrompt}`,
        config: {
          temperature: 0.1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      });

      return JSON.parse(result.text);
    } catch (error) {
      console.error('Gemini Execution Failed:', error.message);
      throw error;
    }
  }
}
