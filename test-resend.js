const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
    }
});

console.log('🔧 Testing Resend API Configuration...\n');
console.log('📧 Resend Settings:');
console.log('   API Key:', process.env.RESEND_API_KEY ? '***' + process.env.RESEND_API_KEY.slice(-8) : 'NOT SET');
console.log('   Target Email:', process.env.SMTP_USER);
console.log('');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResendEmail() {
    try {
        console.log('📨 Sending test email via Resend API...');

        const { data, error } = await resend.emails.send({
            from: 'TenderChain <onboarding@resend.dev>',
            to: process.env.SMTP_USER,
            subject: '✅ Resend API Test - TenderChain',
            html: `
        <h2>🎉 Resend API Working!</h2>
        <p>Your email configuration has been successfully updated.</p>
        <p><strong>✅ No more firewall issues!</strong></p>
        <p>Resend uses HTTPS instead of SMTP ports, so it bypasses firewall restrictions.</p>
        <hr>
        <p style="color: #6B7280; font-size: 14px;">
          <strong>Time:</strong> ${new Date().toLocaleString()}<br>
          <strong>Method:</strong> Resend API (HTTPS)<br>
          <strong>Status:</strong> Emails will now be delivered to your inbox!
        </p>
      `,
        });

        if (error) {
            console.error('❌ Resend API Error:', error);
            process.exit(1);
        }

        console.log('✅ Test email sent successfully via Resend!');
        console.log('📬 Email ID:', data?.id);
        console.log('\n✅ Check your inbox at:', process.env.SMTP_USER);
        console.log('📧 Emails should arrive within seconds!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n💡 Troubleshooting:');
        console.error('   1. Verify your RESEND_API_KEY is correct in .env.local');
        console.error('   2. Check Resend dashboard: https://resend.com/emails');
        console.error('   3. Ensure you have not exceeded free tier limits (100/day)');
        process.exit(1);
    }
}

testResendEmail();
