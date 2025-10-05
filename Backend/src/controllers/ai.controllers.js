import { generateContent } from '../services/gemini.js';

export async function getReviewController(req, res) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required!" });
    }

    const result = await generateContent(code);
    res.status(200).json(result);

  } catch (err) {
    console.error("Error in getReviewController:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
