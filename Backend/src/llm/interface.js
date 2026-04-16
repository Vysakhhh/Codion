/**
 * LLM Provider Interface Contract
 * 
 * Every AI provider (Groq, Gemini, Mistral) must implement a review() method
 * that takes a ReviewPacket and returns a ReviewResult.
 */
export class ILLMProvider {
  /**
   * @param {Object} packet - ReviewPacket
   * @returns {Promise<Object>} - ReviewResult
   */
  async review(packet) {
    throw new Error('Method "review()" must be implemented.');
  }
}
