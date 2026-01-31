# Fix Gmail SMTP - Windows Firewall Configuration

## The Issue

Resend free tier only allows sending to your own email (mathu9147@gmail.com). To send to other users, you need either:
1. **Verify a custom domain** in Resend (requires DNS setup)
2. **Fix the firewall** to allow Gmail SMTP

## Option 1: Configure Windows Firewall (Recommended)

### Step 1: Create Outbound Firewall Rules

Run these commands in **PowerShell as Administrator**:

```powershell
# Allow SMTP port 587 (STARTTLS)
New-NetFirewallRule -DisplayName "Allow SMTP Port 587" -Direction Outbound -LocalPort 587 -Protocol TCP -Action Allow

# Allow SMTP port 465 (SSL)
New-NetFirewallRule -DisplayName "Allow SMTP Port 465" -Direction Outbound -LocalPort 465 -Protocol TCP -Action Allow
```

### Step 2: Verify Rules Created

```powershell
Get-NetFirewallRule -DisplayName "Allow SMTP*"
```

### Step 3: Test SMTP Connection

After creating the firewall rules, run:
```bash
node test-smtp.js
```

If successful, you'll see:
```
✅ Test email sent successfully!
```

### Step 4: Revert to Gmail SMTP

If the firewall fix works, I'll update your code to use Gmail SMTP instead of Resend.

---

## Option 2: Keep Resend for Development (Quick Fix)

For **local development only**, we can add a check to send all emails to your verified address:

```typescript
// In email.ts - redirect all emails to your verified address in dev mode
const isDev = process.env.NODE_ENV !== 'production'
const targetEmail = isDev ? 'mathu9147@gmail.com' : email
```

This way:
- ✅ Development: All emails go to mathu9147@gmail.com (you can still test the flow)
- ✅ Production: You'll need to verify a domain or use Gmail SMTP

---

## Option 3: Verify a Domain in Resend

1. Go to https://resend.com/domains
2. Add your domain (e.g., `tenderchain.com`)
3. Add DNS records to verify ownership
4. Update `from` address to use your domain

**Cost**: Free tier still applies (100 emails/day)

---

## My Recommendation

**For Development**: Use Option 2 (redirect to your email)  
**For Production**: Use Option 1 (fix firewall + Gmail SMTP) or Option 3 (verify domain)

Which option would you like me to implement?
