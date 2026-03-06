import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage } from 'mimetext';

export default {
  async fetch(request, env) {
    // CORS
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGINS.split(',').map(s => s.trim());
    const corsOrigin = allowed.includes('*') || allowed.includes(origin) ? origin : '';

    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const { subject, body } = await request.json();

      if (!subject || !body) {
        return new Response(JSON.stringify({ error: 'subject and body are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const msg = createMimeMessage();
      msg.setSender({ name: env.SENDER_NAME, addr: env.SENDER_ADDRESS });
      msg.setRecipient(env.RECIPIENT_ADDRESS);
      msg.setSubject(subject);
      msg.addMessage({ contentType: 'text/html', data: body });

      const message = new EmailMessage(env.SENDER_ADDRESS, env.RECIPIENT_ADDRESS, msg.asRaw());
      await env.SEB.send(message);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};
