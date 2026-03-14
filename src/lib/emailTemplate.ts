export interface NewsletterSection {
  imageUrl: string;
  header: string;
  subheader: string;
  body: string;
}

export interface NewsletterData {
  title: string; // e.g. "February 2026 Newsletter"
  sections: NewsletterSection[];
}

const LOGO_URL = 'https://mcusercontent.com/36a8ff8dbf13061f9d722226f/images/f783e687-7e65-8df6-c6ac-f52ffec4f174.png';
const FOOTER_IMAGE_URL = 'https://mcusercontent.com/36a8ff8dbf13061f9d722226f/images/3f82535d-6946-55f7-d8e7-1649f8debfab.jpg';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildToc(sections: NewsletterSection[]): string {
  if (sections.length === 0) return '';
  const items = sections
    .filter(s => s.header)
    .map(s => {
      const anchor = slugify(s.header);
      return `<a href="#${anchor}" style="color:#ffffff;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.4);">${escapeHtml(s.header)}</a>`;
    })
    .join('<br>\n');
  return `
                <tr>
                  <td style="padding:12px 24px 0;font-family:Helvetica,Arial,sans-serif;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                      <tr>
                        <td style="border-top:1px solid rgba(255,255,255,0.3);font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 24px 4px;font-family:Helvetica,Arial,sans-serif;color:rgba(255,255,255,0.7);font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.08em;">
                    In This Issue
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 24px 0;font-family:Helvetica,Arial,sans-serif;color:#ffffff;font-size:14px;font-weight:bold;line-height:1.7;">
${items}
                  </td>
                </tr>`;
}

function renderSection(section: NewsletterSection, isLast: boolean): string {
  const body = section.body;
  const anchor = slugify(section.header);
  return `
<!-- SECTION -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
  <tr>
    <td align="center" style="padding:0 20px;">
      <a id="${anchor}" style="display:block;height:0;overflow:hidden;"></a>
      <img src="${escapeHtml(section.imageUrl)}" alt="" width="560" style="width:100%;max-width:560px;height:auto;display:block;border:0;" />
    </td>
  </tr>
  <tr>
    <td style="padding:16px 20px 0;">
      <h2 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:bold;color:#000000;line-height:1.3;">${escapeHtml(section.header)}</h2>
    </td>
  </tr>
  <tr>
    <td style="padding:6px 20px 0;">
      <h3 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;color:#000000;line-height:1.4;">${escapeHtml(section.subheader)}</h3>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 20px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#333333;">
      ${body}
    </td>
  </tr>
</table>
${isLast ? '' : `
<!-- DIVIDER -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
  <tr>
    <td style="padding:24px 20px;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td style="border-top:2px solid #9E9999;font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
</table>`}`;
}

export function buildNewsletterHtml(data: NewsletterData): string {
  const year = new Date().getFullYear();
  const sectionsHtml = data.sections.map((s, i) => renderSection(s, i === data.sections.length - 1)).join('\n');

  return `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(data.title)} - FAHA</title>
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
      .mobilePad { padding-left: 16px !important; padding-right: 16px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F2F2F2;">
  <center>
    <table id="bodyTable" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background-color:#F2F2F2;">
      <tr>
        <td align="center" valign="top" style="padding:20px 10px;">

          <!-- CONTAINER -->
          <table class="templateContainer" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;background-color:#ffffff;">

            <!-- LOGO -->
            <tr>
              <td align="center" style="padding:24px 20px 16px;">
                <img src="${LOGO_URL}" alt="FAHA" width="150" style="display:block;border:0;height:auto;max-width:150px;" />
              </td>
            </tr>

            <!-- TITLE HEADER + TOC -->
            <tr>
              <td style="padding:0 20px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background-color:#147FB0;border-radius:4px;">
                  <tr>
                    <td style="padding:20px 24px 4px;font-family:Helvetica,Arial,sans-serif;color:#ffffff;font-size:18px;font-weight:bold;line-height:1.4;">
                      ${escapeHtml(data.title)}
                    </td>
                  </tr>
${buildToc(data.sections)}
                  <tr>
                    <td style="padding:0 0 16px;font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CONTENT SECTIONS -->
            <tr>
              <td>
${sectionsHtml}
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:24px 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="border-top:2px solid #9E9999;font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color:#F2F2F2;padding:20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td align="center" style="padding-bottom:16px;">
                      <img src="${FOOTER_IMAGE_URL}" alt="FAHA" width="200" style="display:block;border:0;height:auto;max-width:200px;" />
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:1.4;color:#606060;text-align:center;">
                      <em>Copyright &copy; ${year} Finnish American Home Association. All rights reserved.</em><br><br>
                      You are receiving this email because you provided us your email during an event or membership application.<br><br>
                      <strong>Finnish American Home Association</strong><br>
                      197 W Verano Ave, Sonoma, CA 95476<br><br>
                      <a href="*|UNSUB|*" style="color:#606060;">unsubscribe</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="*|UPDATE_PROFILE|*" style="color:#606060;">update preferences</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
          <!-- /CONTAINER -->

        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}

export function getDefaultTitle(): string {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getFullYear()} Newsletter`;
}
