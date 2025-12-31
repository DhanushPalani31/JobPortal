import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration
export const OPENAI_CONFIG = {
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
  temperature: 0.7, // Creativity level (0-1)
};

// Validate API key on startup
export const validateOpenAIKey = async () => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }
    
    // Test the API key with a minimal request
    await openai.models.list();
    console.log("✅ OpenAI API key validated successfully");
    return true;
  } catch (error) {
    console.error("❌ OpenAI API key validation failed:", error.message);
    return false;
  }
};

export default openai;