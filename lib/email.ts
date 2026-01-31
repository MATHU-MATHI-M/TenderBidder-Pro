import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Resend free tier only allows sending to verified email
// In development, redirect all emails to verified address
const VERIFIED_EMAIL = 'mathu9147@gmail.com'
const isDevelopment = process.env.NODE_ENV !== 'production'

function getEmailRecipient(intendedEmail: string): string {
  if (isDevelopment) {
    console.log(`🔄 DEV MODE: Redirecting email from ${intendedEmail} to ${VERIFIED_EMAIL}`)
    return VERIFIED_EMAIL
  }
  return intendedEmail
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  companyName: string
) {
  const verificationUrl =
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`

  console.log("📧 Sending verification email to:", email)
  console.log("🔗 Verification URL:", verificationUrl)

  const actualRecipient = getEmailRecipient(email)
  const devNotice = isDevelopment && actualRecipient !== email
    ? `<div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px; margin-bottom: 16px;">
         <strong>🔧 DEV MODE:</strong> This email was intended for <strong>${email}</strong>
       </div>`
    : ''

  try {
    const { data, error } = await resend.emails.send({
      from: 'TenderChain <onboarding@resend.dev>',
      to: actualRecipient,
      subject: "Verify your email - TenderChain",
      html: `
        ${devNotice}
        <h2>Welcome to TenderChain</h2>
        <p>Hello <strong>${companyName}</strong>,</p>
        <p>Please verify your email by clicking below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Verify Email</a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #6B7280; font-size: 14px;">${verificationUrl}</p>
        <p style="color: #9CA3AF; font-size: 12px; margin-top: 24px;">This link expires in 24 hours.</p>
      `,
    })

    if (error) {
      console.error("❌ Resend API error:", error)
      throw error
    }

    console.log("✅ Verification email sent via Resend:", data?.id)
  } catch (error) {
    console.error("❌ Failed to send email via Resend:", error)
    throw error
  }
}

export async function sendConfirmationEmail(
  email: string,
  companyName: string
) {
  const actualRecipient = getEmailRecipient(email)

  try {
    const { data, error } = await resend.emails.send({
      from: 'TenderChain <onboarding@resend.dev>',
      to: actualRecipient,
      subject: "Email verified - TenderChain",
      html: `
        <h2>🎉 Email Verified</h2>
        <p>Hello <strong>${companyName}</strong>,</p>
        <p>Your email has been successfully verified.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Sign in to TenderChain
        </a>
      `,
    })

    if (error) {
      console.error("❌ Resend API error:", error)
      return
    }

    console.log("✅ Confirmation email sent via Resend:", data?.id)
  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error)
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
  const actualRecipient = getEmailRecipient(to)

  try {
    const { data, error } = await resend.emails.send({
      from: 'TenderChain <onboarding@resend.dev>',
      to: actualRecipient,
      subject,
      html,
    })

    if (error) {
      console.error("❌ Resend API error:", error)
      throw error
    }

    console.log("✅ Email sent via Resend to:", to)
    return { id: data?.id }
  } catch (error) {
    console.error("❌ Failed to send email via Resend:", error)
    throw error
  }
}

