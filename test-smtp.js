const nodemailer = require('nodemailer');
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

console.log('🔧 Testing Gmail SMTP Configuration...\n');
console.log('📧 SMTP Settings:');
console.log('   Host:', process.env.SMTP_HOST);
console.log('   Port:', process.env.SMTP_PORT);
console.log('   User:', process.env.SMTP_USER);
console.log('   Password:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
console.log('');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // SSL for port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    logger: true,
    debug: true,
});

async function testEmail() {
    try {
        console.log('🔌 Testing SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!\n');

        console.log('📨 Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: '✅ Test Email from TenderChain',
            html: `
        <h2>🎉 Email Configuration Successful!</h2>
        <p>Your Gmail SMTP is working correctly.</p>
        <p>You can now receive verification emails.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
        });

        console.log('✅ Test email sent successfully!');
        console.log('📬 Message ID:', info.messageId);
        console.log('\n✅ Check your inbox at:', process.env.SMTP_USER);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n💡 Troubleshooting:');
        console.error('   1. Verify your Gmail App Password is correct');
        console.error('   2. Check if "Less secure app access" is enabled (if using regular password)');
        console.error('   3. Check your firewall/antivirus settings');
        console.error('   4. Try using port 465 with secure: true');
        process.exit(1);
    }
}

testEmail();
