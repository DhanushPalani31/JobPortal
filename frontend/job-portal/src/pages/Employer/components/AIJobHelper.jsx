import { useState } from "react";
import { Sparkles, Loader, Wand2, Info, Zap, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";

const AIJobHelper = ({ onGenerate, currentJobTitle, category, jobType, location }) => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generationType, setGenerationType] = useState("full");
  const [lastGenerated, setLastGenerated] = useState(null);

  /**
   * Generate job description using OpenAI
   */
  const generateWithAI = async () => {
    const jobTitle = prompt.trim() || currentJobTitle;

    // Validation
    if (!jobTitle) {
      toast.error("Please enter a job title first");
      return;
    }

    setLoading(true);

    try {
      // Call backend API
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_JOB, {
        jobTitle: jobTitle,
        category: category || undefined,
        jobType: jobType || undefined,
        location: location || undefined,
      });

      if (response.data.success) {
        const { description, requirements } = response.data.data;

        // Generate based on type
        if (generationType === "full") {
          onGenerate({ description, requirements });
        } else if (generationType === "description") {
          onGenerate({ description });
        } else if (generationType === "requirements") {
          onGenerate({ requirements });
        }

        // Track last generation
        setLastGenerated({
          jobTitle,
          timestamp: new Date(),
          tokensUsed: response.data.metadata.tokensUsed,
        });

        // Success notification
        toast.success(
          `${
            generationType === "full"
              ? "Job description generated"
              : generationType === "description"
              ? "Description generated"
              : "Requirements generated"
          } successfully!`,
          {
            icon: "🤖",
            duration: 4000,
          }
        );

        setPrompt("");
      } else {
        throw new Error(response.data.message || "Generation failed");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);

      // User-friendly error messages
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate. Please try again.";

      toast.error(errorMessage, {
        duration: 5000,
      });

      // Specific error handling
      if (error.response?.status === 402) {
        toast.error("AI service quota exceeded. Please contact support.", {
          duration: 6000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      generateWithAI();
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                AI Job Generator
              </h3>
              <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium rounded-full">
                GPT-4
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Powered by OpenAI • Generate in seconds
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          {showAdvanced ? "Hide" : "Show"} Options
        </button>
      </div>

      {/* Main Input */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                currentJobTitle
                  ? `Using: "${currentJobTitle}"`
                  : "e.g., Senior Software Engineer"
              }
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
            />
            {currentJobTitle && !prompt && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Zap className="h-4 w-4 text-purple-500" />
              </div>
            )}
          </div>

          <button
            onClick={generateWithAI}
            disabled={loading || (!prompt && !currentJobTitle)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Generating...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span className="hidden sm:inline">Generate</span>
              </>
            )}
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              What to generate:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setGenerationType("full")}
                disabled={loading}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  generationType === "full"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Full Post
              </button>
              <button
                onClick={() => setGenerationType("description")}
                disabled={loading}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  generationType === "description"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setGenerationType("requirements")}
                disabled={loading}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  generationType === "requirements"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Requirements
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="flex items-start gap-2 text-xs text-gray-600 bg-white rounded-xl p-3 border border-gray-200">
          <Info className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900 mb-1">
              🤖 Real AI-Powered Generation
            </p>
            <p>
              Uses OpenAI GPT-4 to create unique, professional job descriptions
              tailored to your specific role. Each generation is customized and
              industry-relevant.
            </p>
          </div>
        </div>

        {/* Last Generated Info */}
        {lastGenerated && !loading && (
          <div className="flex items-center justify-between text-xs text-gray-500 bg-green-50 border border-green-200 rounded-lg p-2">
            <span className="flex items-center gap-1">
              ✓ Last generated: {lastGenerated.jobTitle}
            </span>
            <span>{lastGenerated.tokensUsed} tokens used</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 border border-purple-200 rounded-lg p-3">
            <Loader className="h-4 w-4 animate-spin" />
            <span>AI is crafting your job description...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIJobHelper;