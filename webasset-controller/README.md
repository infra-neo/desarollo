# WebAsset Controller

Banking Automation Controller with SSO Authentication and Session Recording

## Features

- **SSO Authentication**: Integration with Authentik via OIDC
- **Multi-Asset Support**: BMG Consig, iCred API, and custom banking sites
- **Automated Login**: Playwright-based browser automation
- **Session Recording**: Video recording of all sessions
- **Audit Logging**: Complete audit trail with JumpServer integration
- **Secrets Management**: Integration with Infisical for credential management
- **Kiosk Mode**: Full-screen, locked-down browser sessions
- **Auto-Timeout**: Configurable session timeouts

## Environment Variables

```bash
# Server Configuration
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:pass@host:5432/webasset

# OIDC Configuration (Authentik)
OIDC_ISSUER=https://auth.example.com/application/o/webasset/
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URI=https://webasset.example.com/auth/callback

# Infisical Configuration
INFISICAL_URL=http://infisical:8080
INFISICAL_TOKEN=your-infisical-token

# Banking Sites
BMG_CONSIG_URL=https://www.bmgconsig.com.br/Index.do?method=prepare
ICRED_API_URL=https://api.icred.app/authorization-server/custom-login

# Session Configuration
SESSION_SECRET=change-me-in-production
SESSION_TIMEOUT=1800
KIOSK_MODE=true

# Audit Configuration
AUDIT_ENABLED=true
JUMPSERVER_API_URL=http://jumpserver:8080
JUMPSERVER_API_TOKEN=your-jumpserver-token
```

## API Endpoints

### Authentication

- `GET /auth/login` - Initiate SSO login
- `GET /auth/callback` - OIDC callback
- `GET /auth/logout` - Logout

### Sessions

- `POST /api/session/start` - Start a banking session
- `GET /api/session/:id/status` - Get session status
- `POST /api/session/:id/stop` - Stop a session

### Assets

- `GET /api/assets` - Get available banking assets

### Audit

- `GET /api/audit` - Get audit logs

## Development

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Docker Build

```bash
docker build -t webasset-controller:latest .
```

## Security Considerations

- All credentials are stored in Infisical
- Sessions are recorded for audit purposes
- TLS/SSL required in production
- Rate limiting enabled on all API endpoints
- CORS configured for specific origins
- Helmet.js for security headers

## Author

Ing. Benjamín Frías — DevOps & Cloud Specialist
