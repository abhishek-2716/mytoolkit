# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.x.x   | ✅ Yes    |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please send a responsible disclosure report to:

📧 `security@toolnest.io` _(placeholder — update before going public)_

### What to Include

- Type of vulnerability (XSS, injection, auth bypass, etc.)
- Location (URL, file path, component)
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgement:** Within 48 hours
- **Initial Assessment:** Within 5 business days
- **Resolution Target:** Within 30 days for critical issues

We appreciate responsible disclosure and will credit reporters in the changelog (unless you prefer anonymity).

## Security Best Practices in This Project

- All user input is validated server-side with Zod
- Uploaded files are validated for type, size, and content
- Authentication uses JWT with short expiry + refresh tokens
- Passwords are hashed with bcrypt
- SQL injection is prevented via Prisma parameterized queries
- XSS is prevented via proper output escaping
- CSRF protection is applied to state-changing endpoints
- Rate limiting is enforced on all public APIs
- Secrets are never committed to the repository
- Environment variables are never exposed to the client bundle
