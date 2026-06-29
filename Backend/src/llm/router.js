import GroqProvider from './groq.js';
import GeminiProvider from './gemini.js';
import MistralProvider from './mistral.js';

export class LLMRouter {
  constructor(config) {
    this.providers = {};

    if (config.GEMINI_API_KEY) {
      this.providers.gemini = new GeminiProvider(config.GEMINI_API_KEY);
    } else {
      console.warn('[LLMRouter] GEMINI_API_KEY is not defined. Gemini provider is disabled.');
    }

    if (config.GROQ_API_KEY) {
      this.providers.groq = new GroqProvider(config.GROQ_API_KEY);
    } else {
      console.warn('[LLMRouter] GROQ_API_KEY is not defined. Groq provider is disabled.');
    }

    if (config.MISTRAL_API_KEY) {
      this.providers.mistral = new MistralProvider(config.MISTRAL_API_KEY);
    } else {
      console.warn('[LLMRouter] MISTRAL_API_KEY is not defined. Mistral provider is disabled.');
    }
    
    // Primary order for fallback (filtering only active providers)
    this.priorityList = ['gemini', 'groq', 'mistral'].filter(p => this.providers[p]);
  }

  async review(packet) {
    if (this.priorityList.length === 0) {
      throw new Error('No LLM providers are configured. Ensure at least one API key is set in .env.');
    }

    const preferred = packet.settings.preferredProvider === 'auto' || !this.providers[packet.settings.preferredProvider]
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
        try {
          const result = await provider.review(packet);
          return { 
            ...result, 
            usedProvider: providerKey 
          };
        } catch (innerErr) {
          const isJsonError = innerErr instanceof SyntaxError || 
                              innerErr.message?.includes('JSON') || 
                              innerErr.message?.includes('parse') ||
                              innerErr.message?.includes('Unexpected token');
          
          if (isJsonError) {
            console.warn(`[LLMRouter] JSON parsing failed on first try for ${providerKey}. Retrying once...`);
            const retryPacket = {
              ...packet,
              jsonRetrySuffix: "Your previous response was not valid JSON. Return ONLY raw JSON, nothing else. Start your response with { and end with }"
            };
            const result = await provider.review(retryPacket);
            return {
              ...result,
              usedProvider: providerKey
            };
          }
          throw innerErr;
        }
      } catch (err) {
        console.warn(`[LLMRouter] ${providerKey} failed: ${err.message}`);
        lastError = err;
        // Continue to next fallback
      }
    }

    throw new Error(`All LLM providers failed. Last error: ${lastError?.message}`);
  }
}
