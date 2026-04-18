const Router = require("express");
const router = new Router();
const OpenAI = require("openai");

router.post("/search", async (req, res) => {
  try {
    const { message, types = [], brands = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const typesList = types.map((t) => `${t.id}: ${t.name}`).join(", ");
    const brandsList = brands.map((b) => `${b.id}: ${b.name}`).join(", ");

    const systemPrompt = `You are a shopping assistant for an electronics store.
The user will describe what product they are looking for.
Your job is to extract search filters from their description and return a JSON object.

Available product types: ${typesList || "none"}
Available brands: ${brandsList || "none"}

Return ONLY a JSON object with any of these fields that are relevant:
- "search": string - keywords for text search in product name/specs
- "minPrice": number - minimum price in USD
- "maxPrice": number - maximum price in USD
- "typeIds": array of numbers - IDs from the available types list that match
- "brandIds": array of numbers - IDs from the available brands list that match
- "minRating": number (1-5) - minimum rating
- "inStockOnly": boolean - only show in-stock items
- "onSaleOnly": boolean - only show items on sale
- "summary": string - a short friendly sentence explaining what you're searching for (in English)

Only include fields that the user actually mentioned or implied. Do not include empty arrays.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const filters = JSON.parse(response.choices[0].message.content);
    res.json(filters);
  } catch (err) {
    console.error("AI search error:", err.message);
    res.status(500).json({ error: "AI search failed" });
  }
});

module.exports = router;
