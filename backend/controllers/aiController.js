import openai, { OPENAI_CONFIG } from "../config/openai.js";

/**
 * Generate job description using OpenAI GPT
 * @route POST /api/ai/generate-job-description
 * @access Private (requires authentication)
 */
export const generateJobDescription = async (req, res) => {
  try {
    const { jobTitle, category, jobType, location } = req.body;

    // Validation
    if (!jobTitle || jobTitle.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Job title is required",
      });
    }

    // Construct detailed prompt for better results
    const systemPrompt = `You are an expert HR professional and job description writer with 15+ years of experience. 
Your task is to create compelling, professional job postings that attract top talent.
Write in a professional yet engaging tone. Use bullet points for clarity.`;

    const userPrompt = `Create a comprehensive job posting for the following position:

Job Title: ${jobTitle}
${category ? `Category: ${category}` : ""}
${jobType ? `Job Type: ${jobType}` : ""}
${location ? `Location: ${location}` : ""}

Please provide TWO distinct sections:

**SECTION 1: JOB DESCRIPTION**
Include:
- A compelling 2-3 sentence introduction about the role
- 6-8 key responsibilities with action verbs
- What makes this position exciting and unique
- Brief mention of team/company culture fit

Format: Professional, engaging, 250-350 words

**SECTION 2: REQUIREMENTS**
Include:
- Essential qualifications (5-7 points)
  - Education requirements
  - Years of experience needed
  - Core technical/soft skills
- Preferred qualifications (3-5 points)
  - Nice-to-have skills
  - Additional certifications
  - Bonus experiences

Format: Clear bullet points, 200-300 words

Use professional emojis sparingly (max 3-4 total) to highlight key sections.
Make it specific to the ${jobTitle} role with industry-relevant details.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: OPENAI_CONFIG.maxTokens,
      temperature: OPENAI_CONFIG.temperature,
      presence_penalty: 0.1, // Reduce repetition
      frequency_penalty: 0.1, // Encourage diversity
    });

    // Extract generated text
    const generatedText = completion.choices[0].message.content;

    // Parse the response into description and requirements
    const sections = parseJobSections(generatedText);

    // Log for monitoring (optional)
    console.log(`✅ AI generated job description for: ${jobTitle}`);
    console.log(`📊 Tokens used: ${completion.usage.total_tokens}`);

    // Return structured response
    return res.status(200).json({
      success: true,
      data: {
        description: sections.description,
        requirements: sections.requirements,
        fullText: generatedText,
      },
      metadata: {
        model: completion.model,
        tokensUsed: completion.usage.total_tokens,
        jobTitle: jobTitle,
      },
    });
  } catch (error) {
    console.error("AI Generation Error:", error);

    // Handle specific OpenAI errors
    if (error.code === "insufficient_quota") {
      return res.status(402).json({
        success: false,
        message: "OpenAI API quota exceeded. Please check your billing.",
      });
    }

    if (error.code === "invalid_api_key") {
      return res.status(401).json({
        success: false,
        message: "Invalid OpenAI API key configuration.",
      });
    }

    if (error.code === "rate_limit_exceeded") {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Please try again in a moment.",
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      message: "Failed to generate job description. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Parse AI response into structured sections
 */
const parseJobSections = (text) => {
  try {
    // Try to split by common section markers
    const markers = [
      /\*\*SECTION 2:|REQUIREMENTS?:/i,
      /## Requirements?/i,
      /Requirements?:/i,
      /\n\nRequirements?:/i,
    ];

    let description = text;
    let requirements = "";

    for (const marker of markers) {
      const parts = text.split(marker);
      if (parts.length >= 2) {
        description = parts[0].trim();
        requirements = parts.slice(1).join("").trim();
        break;
      }
    }

    // Clean up section markers if still present
    description = description
      .replace(/\*\*SECTION 1:|JOB DESCRIPTION:?/gi, "")
      .trim();
    requirements = requirements
      .replace(/\*\*SECTION 2:|REQUIREMENTS?:?/gi, "")
      .trim();

    // If splitting failed, try to intelligently divide the text
    if (!requirements && description.length > 500) {
      const midPoint = Math.floor(description.length / 2);
      const splitPoint = description.indexOf("\n\n", midPoint);
      if (splitPoint > 0) {
        requirements = description.substring(splitPoint).trim();
        description = description.substring(0, splitPoint).trim();
      }
    }

    return {
      description: description || text,
      requirements: requirements || "Requirements will be discussed during the interview process.",
    };
  } catch (error) {
    console.error("Error parsing job sections:", error);
    return {
      description: text,
      requirements: "Requirements will be discussed during the interview process.",
    };
  }
};

/**
 * Get AI generation statistics (optional - for monitoring)
 * @route GET /api/ai/stats
 * @access Private (Admin only)
 */
export const getAIStats = async (req, res) => {
  try {
    // This is a placeholder - you can implement actual tracking
    res.json({
      success: true,
      message: "AI statistics endpoint",
      data: {
        totalGenerations: 0,
        averageTokens: 0,
        costEstimate: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};