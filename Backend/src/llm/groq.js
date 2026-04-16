import Groq from 'groq-sdk';
import { ILLMProvider } from './interface.js';
import { PromptComposer } from '../review/promptComposer.js';

export default class GroqProvider extends ILLMProvider {
  constructor(apiKey) {
    super();
    this.client = new Groq({ apiKey });
    this.model = 'llama-3.3-70b-versatile';
  }

  async review(packet) {
    const systemPrompt = PromptComposer.getSystemPrompt();
    const userPrompt = PromptComposer.getUserPrompt(packet);

    try {
      const response = await this.client.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        model: this.model,
        temperature: 0.1,
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Groq Execution Failed:', error.message);
      throw error;
    }
  }
}
