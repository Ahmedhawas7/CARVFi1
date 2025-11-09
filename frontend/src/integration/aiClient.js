import { AIClient } from "@carv/agentkit";

export const ai = new AIClient();

export async function getRewardSuggestion(userId) {
  try {
    const suggestion = await ai.query(
      `اقترح نقاط إضافية للمستخدم ${userId} حسب نشاطه`
    );
    return suggestion;
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
}
