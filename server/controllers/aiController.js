import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const parseInventoryPrompt =
  async (req, res) => {
    try {
      const { prompt } = req.body;

      const completion =
        await openai.chat.completions.create({
          model: "gpt-4.1-mini",

          messages: [
            {
              role: "system",
              content: `
You are an inventory assistant.

Extract:
- product name
- category
- stock
- price

Return ONLY valid JSON.

Example:
{
  "name": "Logitech Mouse",
  "category": "Electronics",
  "stock": 20,
  "price": 50
}
              `,
            },

            {
              role: "user",
              content: prompt,
            },
          ],
        });

      const result =
        completion.choices[0].message.content;

      res.json(JSON.parse(result));
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };