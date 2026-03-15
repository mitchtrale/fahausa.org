import type { APIRoute } from 'astro';
import { membershipApplications } from '../../db/schema';
import { sendTransactionalEmail } from '../../lib/brevo';
import { buildTransactionalHtml } from '../../lib/transactionalTemplate';

function json(body: Record<string, any>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const db = (locals as any).db;
  const env = (locals as any).env;
  if (!db) {
    return json({ error: 'Database not available' }, 503);
  }

  let data: any;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const required = [
    'membershipType', 'firstName', 'lastName', 'email', 'phone',
    'address', 'city', 'state', 'zip',
    'reference1Name', 'reference1Email', 'reference2Name', 'reference2Email',
    'reasonForJoining',
  ];
  const missing = required.filter(f => !data[f]?.toString().trim());
  if (missing.length > 0) {
    return json({ error: `Missing required fields: ${missing.join(', ')}` }, 400);
  }

  // Validate email format to prevent stored XSS via mailto: hrefs
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailFields = ['email', 'reference1Email', 'reference2Email'];
  for (const field of emailFields) {
    if (data[field] && !emailRegex.test(data[field])) {
      return json({ error: `Invalid email address for ${field}` }, 400);
    }
  }

  const validTypes = ['adult', 'student', 'family'];
  if (!validTypes.includes(data.membershipType)) {
    return json({ error: 'Invalid membership type' }, 400);
  }

  try {
    const result = await db.insert(membershipApplications).values({
      membershipType: data.membershipType,
      firstName: data.firstName.trim(),
      middleName: data.middleName?.trim() || null,
      lastName: data.lastName.trim(),
      maidenName: data.maidenName?.trim() || null,
      email: data.email.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      zip: data.zip.trim(),
      profession: data.profession?.trim() || null,
      ageGroup: data.ageGroup || null,
      finnishBackground: data.finnishBackground?.trim() || null,
      howHeard: data.howHeard?.trim() || null,
      reference1Name: data.reference1Name.trim(),
      reference1Email: data.reference1Email.trim(),
      reference2Name: data.reference2Name.trim(),
      reference2Email: data.reference2Email.trim(),
      reasonForJoining: data.reasonForJoining.trim(),
      volunteerInterests: Array.isArray(data.volunteerInterests)
        ? JSON.stringify(data.volunteerInterests)
        : null,
      spouseName: data.spouseName?.trim() || null,
      childrenNames: data.childrenNames?.trim() || null,
    }).returning({ id: membershipApplications.id });

    const applicationId = result[0]?.id;

    // Send notification email
    try {
      const adminUrl = `https://www.fahausa.org/admin/applications/${applicationId}`;
      const bodyHtml = [
        `<p>A new membership application has been submitted.</p>`,
        `<p><strong>Name:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>`,
        `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>`,
        `<p><strong>City:</strong> ${escapeHtml(data.city)}</p>`,
        `<p style="margin-top:16px;"><a href="${adminUrl}" style="display:inline-block;padding:10px 20px;background:#1a1a1a;color:#ffffff;text-decoration:none;font-weight:bold;">View Application</a></p>`,
      ].join('');

      const htmlContent = buildTransactionalHtml({
        title: 'New Membership Application',
        body: bodyHtml,
        preheader: `${data.firstName} ${data.lastName} — ${data.city}`,
      });

      await sendTransactionalEmail(env, {
        to: [{ email: 'mtrale@fahausa.org', name: 'FAHA' }],
        subject: `[FAHA] New Membership Application — ${data.firstName} ${data.lastName}`,
        htmlContent,
        textContent: `New membership application from ${data.firstName} ${data.lastName} (${data.email}, ${data.city}). View: ${adminUrl}`,
        tags: ['membership-application'],
      });
    } catch (emailErr) {
      console.error('Failed to send application notification email:', emailErr);
      // Don't fail the request if email fails — application is already saved
    }

    return json({ success: true, id: applicationId });
  } catch (err: any) {
    console.error('Failed to save membership application:', err);
    return json({ error: 'Failed to save application' }, 500);
  }
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
