import GroqProvider from './groq.js';
import GeminiProvider from './gemini.js';
import MistralProvider from './mistral.js';

export class LLMRouter {
  constructor(config) {
    this.providers = {
      groq: new GroqProvider(config.GROQ_API_KEY),
      gemini: new GeminiProvider(config.GEMINI_API_KEY),
      mistral: new MistralProvider(config.MISTRAL_API_KEY),
    };
    
    // Primary order for fallback
    this.priorityList = ['groq', 'gemini', 'mistral'];
  }

  async review(packet) {
    const preferred = packet.settings.preferredProvider === 'auto' 
      ? this.priorityList[0] 
      : packet.settings.preferredProvider;

    // Build the execution queue (preferred first, then the rest in priority order)
    const queue = [
      preferred, 
      ...this.priorityList.filter(p => p !== preferred)
    ];

    let lastError = null;

    for (const providerKey of queue) {
      const provider = this.providers[providerKey];
      if (!provider) continue;

      try {
        console.log(`[LLMRouter] Attempting review with: ${providerKey}`);
        const result = await provider.review(packet);
        return { 
          ...result, 
          usedProvider: providerKey 
        };
      } catch (err) {
        console.warn(`[LLMRouter] ${providerKey} failed: ${err.message}`);
        lastError = err;
        // Continue to next fallback
      }
    }

    throw new Error(`All LLM providers failed. Last error: ${lastError?.message}`);
  }
}
