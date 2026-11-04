const SNIPPET_LENGTH = 200

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

function makeSnippet(text: string) {
  const clean = text.trim().replace(/\s+/g, " ")
  if (clean.length <= SNIPPET_LENGTH) return clean
  return clean.slice(0, SNIPPET_LENGTH).replace(/\s+\S*$/, "") + "…"
}

interface ReplyEmailParams {
  to: string
  name: string
  question: string
  response: string
  questionId: string
  late?: boolean
}

export async function sendReplyEmail({ to, name, question, response, questionId, late }: ReplyEmailParams) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY is not set")

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "")
  const link = `${siteUrl}/ask-me-anything#${questionId}`
  const snippet = makeSnippet(response)
  const questionSnippet = makeSnippet(question)

  const intro = late
    ? "Lily replied to the question you asked on Ask Me Anything a while back, and you may have missed it."
    : "Lily has replied to your question on Ask Me Anything."

  const text = [
    `Hi ${name},`,
    "",
    intro,
    "",
    `Your question: "${questionSnippet}"`,
    "",
    `Her reply: "${snippet}"`,
    "",
    `Read the full response: ${link}`,
  ].join("\n")

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 520px; line-height: 1.5;">
      <p>Hi ${escapeHtml(name)},</p>
      <p>${intro}</p>
      <p style="color: #666;">Your question: &ldquo;${escapeHtml(questionSnippet)}&rdquo;</p>
      <blockquote style="margin: 16px 0; padding-left: 12px; border-left: 3px solid #ddd;">
        ${escapeHtml(snippet)}
      </blockquote>
      <p><a href="${link}">Read the full response</a></p>
    </div>`

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.AMA_EMAIL_FROM || "Lily's Lab <onboarding@resend.dev>",
      to,
      reply_to: process.env.AMA_EMAIL_REPLY_TO || undefined,
      subject: "Lily replied to your question",
      text,
      html,
    }),
  })

  if (!res.ok) {
    throw new Error(`Resend error ${res.status}: ${await res.text()}`)
  }
}
