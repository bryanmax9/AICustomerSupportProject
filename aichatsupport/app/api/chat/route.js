import { NextResponse } from "next/server";
import OpenAI from "openai";

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

    const { content } = body; // Extract 'content' directly from the body

    if (!content) {
      throw new Error("Message content is null or undefined");
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: content },
      ],
      model: "gpt-4",
      stream: true,
    });

    // Process the stream manually
    async function processStream(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    }

    const stream = new ReadableStream({
      start(controller) {
        processStream(controller);
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
    // previous return
    // return NextResponse.json(
    //   {
    //     message: completion.choices[0].message.content,
    //   },
    //   { status: 200 }
    // );
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
