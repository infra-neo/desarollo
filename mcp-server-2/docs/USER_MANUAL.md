# User Manual - MCP Server 2

## Introduction

Welcome to MCP Server 2, a secure platform for banking operations with remote browser sessions and comprehensive auditing.

## Table of Contents

- [Getting Started](#getting-started)
- [Login and Authentication](#login-and-authentication)
- [Dashboard Overview](#dashboard-overview)
- [Launching Banking Sessions](#launching-banking-sessions)
- [Managing Sessions](#managing-sessions)
- [Viewing Recordings](#viewing-recordings)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- Two-factor authentication app (Google Authenticator, Authy, etc.)

### First-Time Setup

1. **Receive Invitation**: You'll receive an email with your account details and login link
2. **Set Password**: Click the link to set your password
3. **Enable MFA**: Set up two-factor authentication:
   - Scan QR code with authenticator app
   - Enter 6-digit code to verify
   - Save backup codes in a secure location

## Login and Authentication

### Standard Login

1. Navigate to `https://web.yourdomain.com`
2. Click "Login with SSO"
3. Enter your credentials
4. Enter MFA code from your authenticator app
5. You'll be redirected to the dashboard

### MFA Verification
- **TOTP Code**: 6-digit code from authenticator app
- **Backup Code**: Use if phone is unavailable
- **Recovery**: Contact admin if locked out

### Session Timeout
- Sessions expire after 30 minutes of inactivity
- You'll be prompted to re-authenticate
- Active banking sessions are preserved

## Dashboard Overview

### Main Dashboard

```
┌─────────────────────────────────────────────────────┐
│  MCP Server 2          [User Menu] [Notifications]  │
├─────────────────────────────────────────────────────┤
│  Active Sessions                    [Launch New]    │
│  ┌──────────────────────────────────────────────┐  │
│  │ BMG - Session #1234        Status: Active    │  │
│  │ Started: 10:30 AM          [View] [End]      │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  Available Banking Sites                            │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │BMG │ │FACT│ │BBVA│ │SANT│ │More│              │
│  └────┘ └────┘ └────┘ └────┘ └────┘              │
│                                                     │
│  Recent Activity                                    │
│  • Session ended: FACTA - 9:45 AM                  │
│  • Session started: BMG - 10:30 AM                 │
└─────────────────────────────────────────────────────┘
```

### Navigation Menu
- **Dashboard**: Overview of active sessions
- **Banking Sites**: List of available sites
- **My Sessions**: History of all sessions
- **Recordings**: Access to session recordings
- **Profile**: Account settings and preferences

## Launching Banking Sessions

### Step 1: Select Banking Site

1. From the dashboard, click on a banking site tile (e.g., "BMG")
2. Or use the search bar to find a specific site
3. Click "Launch Session"

### Step 2: Select Credentials

```
┌─────────────────────────────────────────┐
│  Select Credentials for BMG             │
├─────────────────────────────────────────┤
│  ○ BMG Account #1 (Primary)             │
│  ○ BMG Account #2 (Treasury)            │
│  ○ BMG Account #3 (Operations)          │
│                                         │
│  [Cancel]               [Launch] ───→   │
└─────────────────────────────────────────┘
```

1. Select the credential set to use
2. Click "Launch"
3. Wait for workspace to initialize (10-20 seconds)

### Step 3: Auto-Login

The system will automatically:
1. Open the banking site in a remote browser
2. Fill in username and password
3. Submit the login form
4. Handle any initial pages
5. Redirect you to the workspace

### Step 4: Use the Session

Once connected, you'll see:
```
┌─────────────────────────────────────────────────────┐
│  [<] [>] [🔄] https://www.bancomonex.com           │
├─────────────────────────────────────────────────────┤
│                                                     │
│           [Banking Site Interface]                  │
│                                                     │
│  • User: [Logged in as your username]              │
│  • Watermark: Bottom right corner                  │
│             (User: yourname | Time: 10:30)         │
│                                                     │
│  • Session Recording: ACTIVE 🔴                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Session Features
- **Full Browser**: Complete browser functionality
- **Copy/Paste**: Enabled (clipboard sync)
- **File Upload**: Supported for documents
- **File Download**: Downloads saved to your device
- **Print**: Print directly from the browser

## Managing Sessions

### Active Sessions

View all your active sessions from the dashboard:

```
Active Sessions (2/5)  [Your limit: 5 concurrent sessions]

┌────────────────────────────────────────────────────┐
│ BMG - Session #1234                                │
│ Started: 10:30 AM    Duration: 25 min             │
│ Status: Active 🟢    Recording: Yes 🔴            │
│ [View Session] [End Session]                       │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ FACTA - Session #1235                              │
│ Started: 10:45 AM    Duration: 10 min             │
│ Status: Active 🟢    Recording: Yes 🔴            │
│ [View Session] [End Session]                       │
└────────────────────────────────────────────────────┘
```

### Ending a Session

**Option 1: From Dashboard**
1. Click "End Session" button
2. Confirm termination
3. Session closes immediately

**Option 2: From Workspace**
1. Close the browser tab
2. Click "Logout" on the banking site
3. System detects closure and cleans up

### Session Limits
- **Maximum Concurrent Sessions**: 5 per user
- **Total Active Sessions**: 25 system-wide
- **When Limit Reached**: End an existing session to start a new one

## Viewing Recordings

### Access Recordings

1. Go to "My Sessions" from the menu
2. Click on a completed session
3. Click "View Recording"

### Recording Player

```
┌─────────────────────────────────────────────────────┐
│  Session Recording: BMG #1234                       │
│  Date: 2025-01-16 10:30 AM                         │
│  Duration: 35 minutes                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│           [Recording Video Player]                  │
│                                                     │
│  ◄◄  ▶  ►►     ━━━━━━━━━━━━━━○━━  35:42 / 35:42  │
│                                                     │
│  Speed: [1x] [1.5x] [2x]      Volume: [═══════]   │
│  Quality: [HD] [SD]           [Fullscreen]         │
└─────────────────────────────────────────────────────┘
```

### Recording Features
- **Playback Control**: Play, pause, seek
- **Speed Control**: 0.5x to 2x playback
- **Quality Options**: HD or SD
- **Download**: Save recording locally (if permitted)
- **Sharing**: Generate secure link (admin only)

### Recording Metadata
Each recording includes:
- Username
- Banking site
- Start/end time
- Duration
- Actions performed
- Watermark with user info

## Best Practices

### Security
✅ **DO:**
- Always log out when finished
- Use different credentials for each account
- Report suspicious activity immediately
- Keep your MFA device secure
- Use a secure internet connection

❌ **DON'T:**
- Share your login credentials
- Leave sessions unattended
- Screenshot or record sessions locally
- Use public Wi-Fi without VPN
- Disable MFA

### Performance
✅ **DO:**
- Close unused sessions
- Use a stable internet connection
- Clear browser cache regularly
- Report slow performance

❌ **DON'T:**
- Open too many sessions at once
- Use very slow internet connections
- Keep sessions open overnight

### Compliance
✅ **DO:**
- Review session recordings periodically
- Report any anomalies
- Follow banking procedures
- Document your activities

❌ **DON'T:**
- Bypass security measures
- Share access with others
- Disable recording
- Delete audit logs

## Troubleshooting

### Cannot Login
**Problem**: Login page doesn't load or shows error

**Solutions**:
1. Clear browser cache and cookies
2. Try a different browser
3. Verify your internet connection
4. Contact admin if problem persists

### MFA Not Working
**Problem**: MFA code rejected

**Solutions**:
1. Verify time sync on your device
2. Generate a new code
3. Use a backup code
4. Contact admin for MFA reset

### Session Won't Start
**Problem**: Workspace doesn't load after clicking "Launch"

**Solutions**:
1. Check if you've reached session limit
2. Verify DNS resolution for domain
3. Check browser console for errors
4. Try a different banking site
5. Contact support

### Auto-Login Failed
**Problem**: Browser opened but login didn't complete

**Solutions**:
1. Banking site may have changed layout
2. Credentials may be incorrect
3. Site may require additional verification
4. Manual login required (one-time)
5. Report issue to admin

### Slow Performance
**Problem**: Session is laggy or unresponsive

**Solutions**:
1. Check your internet speed
2. Close other applications
3. Try lower quality settings
4. Restart your session
5. Contact support if persistent

### Recording Not Available
**Problem**: Can't access session recording

**Solutions**:
1. Wait 5-10 minutes after session ends
2. Check if you have permissions
3. Verify session was recorded
4. Contact admin

## FAQ

### How many sessions can I have?
You can have up to 5 concurrent sessions. End a session to free up a slot.

### How long are recordings kept?
Recordings are kept for 90 days by default. After that, they're automatically deleted.

### Can I use this on my phone?
Yes, the web interface works on mobile browsers, though desktop is recommended for best experience.

### What happens if I lose my MFA device?
Contact your administrator immediately. They can disable MFA temporarily while you set up a new device.

### Can I access banking sites directly?
No, all access must go through MCP Server 2 for security and compliance.

### Who can see my sessions?
Only you and authorized administrators/auditors can view your sessions and recordings.

### What if a banking site isn't listed?
Contact your administrator to request addition of new banking sites.

### Can I download files from banking sites?
Yes, files are downloaded to your local device through the remote session.

### What browsers are supported?
Chrome, Firefox, Safari, and Edge (latest versions).

### Is my data secure?
Yes. All connections are encrypted, credentials are never stored locally, and sessions are isolated.

## Support

### Contact Information
- **Email**: support@yourdomain.com
- **Phone**: +XX-XXX-XXX-XXXX
- **Hours**: Monday-Friday, 8 AM - 6 PM

### Emergency Support
- **24/7 Hotline**: +XX-XXX-XXX-XXXX
- **For**: Critical issues only

### Self-Service
- **Knowledge Base**: https://docs.yourdomain.com
- **Video Tutorials**: https://tutorials.yourdomain.com
- **Status Page**: https://status.yourdomain.com

## Glossary

- **MFA**: Multi-Factor Authentication
- **SSO**: Single Sign-On
- **Session**: Remote browser workspace
- **Recording**: Video capture of session activity
- **Workspace**: Isolated browser environment
- **Watermark**: User identification overlay
- **Credential**: Username/password pair

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-16 | Initial user manual |
