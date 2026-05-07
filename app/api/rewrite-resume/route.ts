import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT =
  "You are an expert resume strategist. Your job is to rewrite resumes to match job offers while staying truthful. Never invent companies, dates, degrees, tools, metrics, or experience. You can reframe existing experience, improve clarity, extract relevant keywords, and make the content ATS-friendly. Keep the tone professional, natural, and not full of corporate buzzwords.";

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchSummary: { type: "string" },
    missingKeywords: {
      type: "array",
      items: { type: "string" },
    },
    rewrittenSummary: { type: "string" },
    rewrittenExperienceBullets: {
      type: "array",
      items: { type: "string" },
    },
    skillsToHighlight: {
      type: "array",
      items: { type: "string" },
    },
    warnings: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "matchSummary",
    "missingKeywords",
    "rewrittenSummary",
    "rewrittenExperienceBullets",
    "skillsToHighlight",
    "warnings",
  ],
} as const;

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validationError(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return validationError("Request body must be valid JSON.");
  }

  const body = payload as { resume?: unknown; jobOffer?: unknown };
  const resume = cleanText(body.resume);
  const jobOffer = cleanText(body.jobOffer);

  if (!resume || !jobOffer) {
    return validationError("Resume and job offer are required.");
  }

  if (resume.length < 100 || jobOffer.length < 100) {
    return validationError("Resume and job offer must each be at least 100 characters.");
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured on the server." },
      { status: 500 },
    );
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      instructions: SYSTEM_PROMPT,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Current resume:\n${resume}\n\nJob offer:\n${jobOffer}\n\nReturn only truthful, ATS-friendly rewrite guidance using the requested JSON structure.`,
            },
          ],
        },
      ],
      max_output_tokens: 1800,
      text: {
        format: {
          type: "json_schema",
          name: "resume_rewrite",
          schema: responseSchema,
          strict: true,
        },
      },
    });

    const outputText = response.output_text;

    if (!outputText) {
      return NextResponse.json(
        { error: "OpenAI returned an empty response. Try again." },
        { status: 502 },
      );
    }

    return NextResponse.json(JSON.parse(outputText));
  } catch (error) {
    console.error("Resume rewrite failed", error);

    return NextResponse.json(
      { error: "Unable to rewrite the resume right now. Check the server logs." },
      { status: 500 },
    );
  }
}
