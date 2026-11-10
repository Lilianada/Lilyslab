const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

interface CommentNotice {
  name: string
  message: string
  pageTitle: string
  link: string
}

/**
 * Emails me when someone replies to an essay or note. It goes to the same
 * address AMA replies point back to. Without that address or a Resend key,
 * it quietly does nothing; the reply is still saved.
 */
export async function sendCommentNotice({ name, message, pageTitle, link }: CommentNotice) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.AMA_EMAIL_REPLY_TO
  if (!apiKey || !to) return

  const text = [`${name} replied to "${pageTitle}":`, "", message, "", `See it on the page: ${link}`].join("\n")
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 520px; line-height: 1.5;">
      <p><strong>${escapeHtml(name)}</strong> replied to &ldquo;${escapeHtml(pageTitle)}&rdquo;:</p>
      <blockquote style="margin: 16px 0; padding-left: 12px; border-left: 3px solid #ddd; white-space: pre-line;">${escapeHtml(message)}</blockquote>
      <p><a href="${link}">See it on the page</a></p>
    </div>`

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.AMA_EMAIL_FROM || "Lily's Lab <onboarding@resend.dev>",
      to,
      subject: `New reply on "${pageTitle}"`,
      text,
      html,
    }),
  })

  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`)
}
