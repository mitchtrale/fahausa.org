const LOGO_URL = 'https://mcusercontent.com/36a8ff8dbf13061f9d722226f/images/f783e687-7e65-8df6-c6ac-f52ffec4f174.png';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface TransactionalEmailData {
  title: string;
  body: string; // HTML content
  preheader?: string;
}

export function buildTransactionalHtml(data: TransactionalEmailData): string {
  const year = new Date().getFullYear();
  const preheader = data.preheader
    ? `<span style="display:none;font-size:1px;color:#F2F2F2;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(data.preheader)}</span>`
    : '';

  return `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(data.title)}</title>
  <style type="text/css">
    body, #bodyTable {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: #F2F2F2;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img {
      border: 0;
      height: auto;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    table { border-collapse: collapse; }
    a { color: #147FB0; }
    @media only screen and (max-width: 620px) {
      .templateContainer { width: 100% !important; max-width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F2F2F2;">
  ${preheader}
  <center>
    <table id="bodyTable" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background-color:#F2F2F2;">
      <tr>
        <td align="center" valign="top" style="padding:20px 10px;">

          <table class="templateContainer" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;background-color:#ffffff;">

            <!-- LOGO -->
            <tr>
              <td align="center" style="padding:24px 20px 16px;">
                <img src="${LOGO_URL}" alt="FAHA" width="150" style="display:block;border:0;height:auto;max-width:150px;" />
              </td>
            </tr>

            <!-- TITLE -->
            <tr>
              <td style="padding:0 20px 8px;">
                <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:22px;font-weight:bold;color:#333333;line-height:1.3;text-align:center;">
                  ${escapeHtml(data.title)}
                </h1>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:16px 20px 24px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#333333;">
                ${data.body}
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:16px 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="border-top:1px solid #DDDDDD;font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px 20px;font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:1.4;color:#999999;text-align:center;">
                &copy; ${year} Finnish American Home Association<br>
                197 W Verano Ave, Sonoma, CA 95476
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}
