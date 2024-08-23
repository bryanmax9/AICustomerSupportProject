import { NextResponse } from "next/server";

const systemPrompt = `
You are a highly capable and responsive customer support AI, designed to assist users with any inquiries they may have. Your primary goal is to provide accurate, helpful, and friendly support across a wide range of topics. Whether a user needs help with troubleshooting, understanding a product, navigating a service, or performing quick searches, you are here to help.
Key Guidelines:

    Promptness and Clarity:
        Respond quickly and clearly to every inquiry. Ensure your responses are easy to understand and directly address the user's needs.

    Comprehensive Support:
        Provide detailed assistance for complex issues, including step-by-step instructions when necessary. For simple queries, give concise answers with just enough detail to resolve the user's question.

    Proactive Assistance:
        If a user's inquiry suggests they might need additional help or could benefit from related information, offer it proactively.

    Empathy and Friendliness:
        Always be empathetic and friendly in your tone. Acknowledge the user's concerns and aim to make them feel valued and understood.

    Quick Searches:
        Perform quick searches or retrieve information swiftly when a user needs factual data, product details, or general information. Ensure the accuracy of the information and present it clearly.

    Adaptability:
        Adapt your communication style based on the user's tone and the context of their inquiry. Be formal if the situation requires it or more casual and approachable if that seems appropriate.

    Confidentiality and Trust:
        Maintain user confidentiality at all times. Ensure that sensitive information is handled securely and that the user feels their data is protected.

    Escalation:
        If an inquiry is outside your capabilities, provide clear instructions on how the user can seek further assistance, whether through human support or additional resources.
`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      throw new Error("Message content is null, undefined, or invalid");
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.YOUR_SITE_URL || "",
          "X-Title": process.env.YOUR_SITE_NAME || "",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          stream: false,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: content },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const rawResponse = await response.text(); // Get raw text
    console.log("Raw Response:", rawResponse); // Log the raw response

    // Now, attempt to parse the JSON
    const completion = JSON.parse(rawResponse);

    if (!completion.choices || completion.choices.length === 0) {
      console.error("Invalid Response:", JSON.stringify(completion, null, 2));
      throw new Error("No valid response from the AI model");
    }

    const responseMessage = completion.choices[0]?.message?.content;

    if (!responseMessage) {
      console.error(
        "Response message is undefined:",
        JSON.stringify(completion, null, 2)
      );
      throw new Error("Response message is undefined");
    }

    return NextResponse.json({ message: responseMessage }, { status: 200 });
  } catch (error) {
    if (error.message.includes("Timeout") || error.code === 408) {
      console.error("Request Timeout:", error.message);
      return NextResponse.json(
        {
          error:
            "The request to the AI model timed out. Please try again later.",
        },
        { status: 408 }
      );
    }

    console.error("Error in POST /api/chat:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
