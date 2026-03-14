#!/bin/bash
set -e

# Test script: send a contact form email via Brevo transactional API
# Usage: BREVO_API_KEY=xkeysib-... bash scripts/test-contact-email.sh

# Load API key from environment or .dev.vars
if [ -z "$BREVO_API_KEY" ]; then
  if [ -f .dev.vars ]; then
    BREVO_API_KEY=$(grep '^BREVO_API_KEY=' .dev.vars | cut -d= -f2-)
  fi
fi

if [ -z "$BREVO_API_KEY" ] || [ "$BREVO_API_KEY" = "YOUR_BREVO_API_KEY" ]; then
  echo "Error: BREVO_API_KEY is not set or is a placeholder."
  echo "Usage: BREVO_API_KEY=xkeysib-... bash scripts/test-contact-email.sh"
  exit 1
fi

SENDER_EMAIL="mtrale@fahausa.org"
SENDER_NAME="FAHA"
TO_EMAIL="mtrale@fahausa.org"

# Mock contact form data
CONTACT_NAME="Test User"
CONTACT_EMAIL="testuser@example.com"
CONTACT_SUBJECT="Website Inquiry"
CONTACT_MESSAGE="Hello, I am interested in learning more about the Finnish American Home Association. Could you send me information about upcoming events and membership? Thank you!"

# Build the HTML body (matches the contact form format)
BODY_HTML="<p><strong>Name:</strong> ${CONTACT_NAME}</p><p><strong>Email:</strong> <a href=\"mailto:${CONTACT_EMAIL}\">${CONTACT_EMAIL}</a></p><p><strong>Subject:</strong> ${CONTACT_SUBJECT}</p><p><strong>Message:</strong></p><p>${CONTACT_MESSAGE}</p>"

# Build the full transactional email HTML (inline template)
YEAR=$(date +%Y)
LOGO_URL="https://mcusercontent.com/36a8ff8dbf13061f9d722226f/images/f783e687-7e65-8df6-c6ac-f52ffec4f174.png"
TITLE="New Contact Form Submission"

HTML_CONTENT=$(cat <<HTMLEOF
<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${TITLE}</title>
  <style type="text/css">
    body, #bodyTable { margin:0; padding:0; width:100%; background-color:#F2F2F2; }
    img { border:0; height:auto; outline:none; text-decoration:none; }
    table { border-collapse:collapse; }
    a { color:#147FB0; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F2F2F2;">
  <center>
    <table id="bodyTable" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background-color:#F2F2F2;">
      <tr>
        <td align="center" valign="top" style="padding:20px 10px;">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;background-color:#ffffff;">
            <tr>
              <td align="center" style="padding:24px 20px 16px;">
                <img src="${LOGO_URL}" alt="FAHA" width="150" style="display:block;border:0;height:auto;max-width:150px;" />
              </td>
            </tr>
            <tr>
              <td style="padding:0 20px 8px;">
                <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:22px;font-weight:bold;color:#333333;line-height:1.3;text-align:center;">
                  ${TITLE}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px 24px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#333333;">
                ${BODY_HTML}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:1px solid #DDDDDD;font-size:0;line-height:0;">&nbsp;</td></tr></table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px 20px;font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:1.4;color:#999999;text-align:center;">
                &copy; ${YEAR} Finnish American Home Association<br>
                197 W Verano Ave, Sonoma, CA 95476
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
HTMLEOF
)

# Build JSON payload
JSON_PAYLOAD=$(cat <<EOF
{
  "sender": {
    "name": "${SENDER_NAME}",
    "email": "${SENDER_EMAIL}"
  },
  "to": [
    {
      "email": "${TO_EMAIL}",
      "name": "FAHA Admin"
    }
  ],
  "replyTo": {
    "email": "${CONTACT_EMAIL}",
    "name": "${CONTACT_NAME}"
  },
  "subject": "[FAHA Contact] ${CONTACT_SUBJECT}",
  "htmlContent": $(echo "$HTML_CONTENT" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),
  "tags": ["contact-form"]
}
EOF
)

echo "==> Sending test contact email..."
echo "    From: ${SENDER_EMAIL}"
echo "    To:   ${TO_EMAIL}"
echo "    Subject: [FAHA Contact] ${CONTACT_SUBJECT}"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "https://api.brevo.com/v3/smtp/email" \
  -H "api-key: ${BREVO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
  echo "==> Success! Email sent."
  echo "    Response: ${BODY}"
else
  echo "==> Failed with HTTP ${HTTP_CODE}"
  echo "    Response: ${BODY}"
  exit 1
fi
