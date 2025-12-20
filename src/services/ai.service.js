class AIClient {
  constructor() {
    this.genAI = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      const { GoogleGenAI } = await import("@google/genai");
      this.genAI = new GoogleGenAI({ apiKey: "AIzaSyCl8M1NB2W8Cnn9mzxvTHyZngyI7ARURik" });
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize AI client:", error);
      throw new Error(`AI client initialization failed: ${error.message}`);
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Generate text response from AI
   * @param {string} prompt - The prompt to send to AI
   * @param {Object} options - Additional options
   * @param {number} options.maxTokens - Maximum tokens for response
   * @param {number} options.temperature - Temperature for response creativity (0-1)
   * @returns {Promise<string>} AI response text
   */
  async generateText(prompt, options = {}) {
    await this.ensureInitialized();

    try {
      const response = await this.genAI.models.generateContent({
        model: options.model || "gemini-2.5-flash",
        contents: prompt,
        generationConfig: {
          maxOutputTokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
        },
      });

      return response.text;
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  /**
   * Generate streaming text response from AI
   * @param {string} prompt - The prompt to send to AI
   * @param {Object} options - Additional options
   * @param {Function} onChunk - Callback function for each chunk
   * @returns {Promise<string>} Complete AI response text
   */
  async generateTextStream(prompt, options = {}, onChunk = null) {
    await this.ensureInitialized();

    try {
      const response = await this.genAI.models.generateContentStream({
        model: options.model || "gemini-2.5-flash",
        contents: prompt,
        generationConfig: {
          maxOutputTokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
        },
      });

      let fullResponse = "";
      for await (const chunk of response) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        if (onChunk && typeof onChunk === "function") {
          onChunk(chunkText);
        }
      }

      return fullResponse;
    } catch (error) {
      console.error("Error generating streaming AI response:", error);
      throw new Error(`AI streaming generation failed: ${error.message}`);
    }
  }

  /**
   * Chat with AI maintaining conversation context
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Additional options
   * @returns {Promise<string>} AI response text
   */
  async chat(messages, options = {}) {
    await this.ensureInitialized();

    try {
      // Convert messages format to Gemini format
      const contents = messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const response = await this.genAI.models.generateContent({
        model: options.model || "gemini-2.5-flash",
        contents: contents,
        generationConfig: {
          maxOutputTokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
        },
      });

      return response.text;
    } catch (error) {
      console.error("Error in AI chat:", error);
      throw new Error(`AI chat failed: ${error.message}`);
    }
  }

  /**
   * Simple prompt method for quick AI queries
   * @param {string} prompt - The prompt to send to AI
   * @param {Object} options - Additional options
   * @returns {Promise<string>} AI response text
   */
  async prompt(prompt, options = {}) {
    return await this.generateText(prompt, options);
  }

  /**
   * Count tokens in text
   * @param {string} text - Text to count tokens for
   * @returns {Promise<number>} Token count
   */
  async countTokens(text) {
    await this.ensureInitialized();

    try {
      const response = await this.genAI.models.countTokens({
        model: "gemini-2.5-flash",
        contents: text,
      });
      return response.totalTokens;
    } catch (error) {
      console.error("Error counting tokens:", error);
      throw new Error(`Token counting failed: ${error.message}`);
    }
  }
}

// Create singleton instance
const aiClient = new AIClient();

module.exports = {
  AIClient,
  aiClient,
};
