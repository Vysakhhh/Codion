import { Mistral } from '@mistralai/mistralai';
import { ILLMProvider } from './interface.js';
import { PromptComposer } from '../review/promptComposer.js';

export default class MistralProvider extends ILLMProvider {
  constructor(apiKey) {
    super();
    this.client = new Mistral({ apiKey });
    this.model = 'mistral-large-latest';
  }

  async review(packet) {
    const systemPrompt = PromptComposer.getSystemPrompt();
    const userPrompt = PromptComposer.getUserPrompt(packet);

    try {
      const response = await this.client.chat.complete({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        responseFormat: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Mistral Execution Failed:', error.message);
      throw error;
    }
  }
}
