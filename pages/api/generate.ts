import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY");
}

export const config = { runtime: "edge" };

// ── Per-action settings ───────────────────────────────────────────────────

interface ActionSettings {
  maxTokens: number;
  temperature: number;
}

function actionSettings(action: string): ActionSettings {
  if (action === 'regenFromUpload') return { maxTokens: 3500, temperature: 0.2 };
  if (action === 'summary' || action === 'tailor') return { maxTokens: 1200, temperature: 0.65 };
  return { maxTokens: 700, temperature: 0.7 };
}

// ── Prompt builder ────────────────────────────────────────────────────────

function buildPrompt(action: string, data: Record<string, unknown>): string {
  switch (action) {
    case "summary":
      return `You are a professional resume writer. Write an ATS-optimized professional summary paragraph of exactly 6–8 sentences (approximately 7 lines when printed). The summary MUST be based ONLY on the actual information provided below — do not invent achievements, metrics, companies, or skills that are not listed. Write it as a single flowing paragraph (no bullets, no headers). Return only the paragraph text.

Candidate Name: ${(data.personal as { fullName?: string; title?: string })?.fullName ?? ""}
Professional Title: ${(data.personal as { fullName?: string; title?: string })?.title ?? ""}
Target Role: ${(data.targetJob as { role?: string; jobDescription?: string })?.role ?? ""}
Job Context: ${((data.targetJob as { jobDescription?: string })?.jobDescription ?? "").slice(0, 300)}
Skills: ${((data.skills as string[]) ?? []).join(", ")}
Education: ${((data.education as Array<{ degree: string; field: string; institution: string }>) ?? []).map((e) => `${e.degree} in ${e.field} from ${e.institution}`).join("; ")}
Experience: ${((data.experience as Array<{ role: string; company: string }>) ?? []).map((e) => `${e.role} at ${e.company}`).join("; ")}`;

    case "enhance":
      return `Rewrite these responsibilities as 3–5 concise ATS-optimized bullet points. Start each with a strong action verb. Quantify achievements where possible. Return only bullets, one per line, each starting with "•".

Text:
${data.text}`;

    case "skills":
      return `Suggest 8 additional relevant technical skills not already in the current list. Return only a comma-separated list of skill names, nothing else.

Role: ${data.role}
Current skills: ${((data.currentSkills as string[]) ?? []).join(", ")}
Target job context: ${data.targetJob ?? ""}`;

    case "tailor":
      return `Optimize this resume for the job description. Return EXACTLY this format:

SUMMARY:
[3–4 line ATS-optimized professional summary]

SKILLS ORDER:
[comma-separated skills list, most relevant to the job listed first]

Job Description:
${((data.jobDescription as string) ?? "").slice(0, 700)}

Current Summary: ${data.summary ?? ""}
Skills: ${((data.skills as string[]) ?? []).join(", ")}`;

    case "regenFromUpload": {
      const resumeText = (data.resumeText as string ?? "").slice(0, 4000);
      const jd = (data.jobDescription as string ?? "").slice(0, 1500);
      return `You are an expert resume writer and ATS optimization specialist.

Parse the resume text below, extract ALL information, and return it as a SINGLE valid JSON object.
${jd ? `Also tailor the content to match the provided job description.` : ""}

Return ONLY the JSON object — no markdown, no explanation, no code blocks. Just raw JSON.

The JSON must match this exact structure:
{
  "personal": {
    "fullName": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "summary": "",
  "experience": [
    {
      "id": "exp-0",
      "company": "",
      "role": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "isCurrent": false,
      "responsibilities": "• Bullet 1\n• Bullet 2"
    }
  ],
  "education": [
    {
      "id": "edu-0",
      "degree": "",
      "field": "",
      "institution": "",
      "gpa": "",
      "startDate": "",
      "endDate": "",
      "currentSemester": "",
      "isCurrent": false
    }
  ],
  "projects": [
    {
      "id": "proj-0",
      "name": "",
      "description": "• Bullet 1\n• Bullet 2",
      "techStack": "",
      "githubUrl": "",
      "liveUrl": ""
    }
  ],
  "skills": [],
  "certifications": [
    {
      "id": "cert-0",
      "name": "",
      "issuer": "",
      "issueDate": "",
      "credentialUrl": "",
      "expiryDate": ""
    }
  ],
  "targetJob": {
    "jobDescription": ${JSON.stringify(jd)},
    "role": ""
  },
  "sectionOrder": ["summary", "experience", "projects", "education", "skills", "certifications"]
}

Instructions:
1. Extract every detail from the resume text
2. Format responsibilities and project descriptions as bullet points starting with "•", one per line
3. Keep dates in the original format (e.g. "Jan 2022", "2020 – 2023")
4. Skills should be a flat array of individual skill strings
${jd ? `5. Optimize the summary and reorder skills to match the job description
6. Emphasize experience and project bullets that align with the JD keywords` : ""}

RESUME TEXT:
${resumeText}
${jd ? `\nJOB DESCRIPTION:\n${jd}` : ""}`;
    }

    default:
      return (data.prompt as string) ?? "";
  }
}

// ── Edge handler ──────────────────────────────────────────────────────────

const handler = async (req: Request): Promise<Response> => {
  const body = (await req.json()) as {
    action?: string;
    data?: Record<string, unknown>;
    prompt?: string;
  };

  const action = body.action ?? "";
  const prompt = action
    ? buildPrompt(action, body.data ?? {})
    : (body.prompt ?? "");

  if (!prompt) return new Response("No prompt provided", { status: 400 });

  const { maxTokens, temperature } = actionSettings(action);

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: maxTokens,
    stream: true,
    n: 1,
    ...(action === 'regenFromUpload' ? { response_format: { type: "json_object" } } : {}),
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
