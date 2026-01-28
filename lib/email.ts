import nodemailer from 'nodemailer'

const USE_MOCK_EMAIL = process.env.USE_MOCK_EMAIL === 'true'

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(
  email: string,
  token: string,
  companyName: string
) {
  const verificationUrl =
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`

  console.log("📧 Sending verification email to:", email)
  console.log("🔗 Verification URL:", verificationUrl)

  if (USE_MOCK_EMAIL) {
    console.log("⚠️ Mock Email Mode: Skipping SMTP call")
    return
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM, // Fallback
      to: email,
      subject: "Verify your email - TenderChain",
      html: `
        <h2>Welcome to TenderChain</h2>
        <p>Hello <strong>${companyName}</strong>,</p>
        <p>Please verify your email by clicking below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    })

    console.log("✅ Verification email sent via SMTP:", info.messageId)
  } catch (error) {
    console.error("❌ Failed to send SMTP email:", error)
    // Don't throw here if you want to fail gracefully in UI, 
    // but throwing helps debug connectivity.
    throw error
  }
}

export async function sendConfirmationEmail(
  email: string,
  companyName: string
) {
  if (USE_MOCK_EMAIL) {
    console.log(`⚠️ Mock Email Mode: Sending confirmation to ${email}`)
    return
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM,
      to: email,
      subject: "Email verified - TenderChain",
      html: `
        <h2>🎉 Email Verified</h2>
        <p>Hello <strong>${companyName}</strong>,</p>
        <p>Your email has been successfully verified.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin">
          Sign in
        </a>
      `,
    })
    console.log("✅ Confirmation email sent via SMTP")
  } catch (error) {
    console.error("❌ Failed to send SMTP email:", error)
  }
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (USE_MOCK_EMAIL) {
    console.log(`⚠️ Mock Email Mode: Sending generic email to ${to}`)
    console.log(`Subject: ${subject}`)
    return { id: 'mock-id' }
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })

    console.log("✅ Email sent via SMTP to:", to)
    return info
  } catch (error) {
    console.error("❌ Failed to send SMTP email:", error)
    throw error
  }
}
