const API_SERVER = 'us7';

function getApiKey(): string {
  const key = import.meta.env.MAILCHIMP_API_KEY;
  if (!key) throw new Error('MAILCHIMP_API_KEY is not set');
  return key;
}

function getListId(): string {
  const id = import.meta.env.MAILCHIMP_LIST_ID;
  if (!id) throw new Error('MAILCHIMP_LIST_ID is not set');
  return id;
}

function baseUrl(): string {
  return `https://${API_SERVER}.api.mailchimp.com/3.0`;
}

function headers(): HeadersInit {
  const key = getApiKey();
  return {
    Authorization: `Basic ${btoa(`anystring:${key}`)}`,
    'Content-Type': 'application/json',
  };
}

async function mc(path: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...options,
    headers: { ...headers(), ...(options.headers || {}) },
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Mailchimp API error ${res.status}: ${body.detail || body.title || JSON.stringify(body)}`);
  }
  return body;
}

export interface Campaign {
  id: string;
  web_id: number;
  type: string;
  status: string;
  send_time: string | null;
  create_time: string;
  settings: {
    subject_line: string;
    preview_text: string;
    title: string;
    from_name: string;
    reply_to: string;
  };
}

export interface CampaignListResponse {
  campaigns: Campaign[];
  total_items: number;
}

export async function listCampaigns(count = 50, offset = 0): Promise<CampaignListResponse> {
  return mc(`/campaigns?count=${count}&offset=${offset}&sort_field=create_time&sort_dir=DESC`);
}

export async function getCampaign(id: string): Promise<Campaign> {
  return mc(`/campaigns/${id}`);
}

export async function getCampaignContent(id: string): Promise<{ html: string }> {
  return mc(`/campaigns/${id}/content`);
}

export interface CreateCampaignData {
  subjectLine: string;
  previewText: string;
  title: string;
  fromName?: string;
  replyTo?: string;
}

export async function createCampaign(data: CreateCampaignData): Promise<Campaign> {
  return mc('/campaigns', {
    method: 'POST',
    body: JSON.stringify({
      type: 'regular',
      recipients: {
        list_id: getListId(),
      },
      settings: {
        subject_line: data.subjectLine,
        preview_text: data.previewText,
        title: data.title,
        from_name: data.fromName || 'Finnish American Home Association',
        reply_to: data.replyTo || 'office@fahausa.org',
      },
    }),
  });
}

export async function updateCampaign(id: string, data: Partial<CreateCampaignData>): Promise<Campaign> {
  const settings: Record<string, string> = {};
  if (data.subjectLine) settings.subject_line = data.subjectLine;
  if (data.previewText) settings.preview_text = data.previewText;
  if (data.title) settings.title = data.title;
  if (data.fromName) settings.from_name = data.fromName;
  if (data.replyTo) settings.reply_to = data.replyTo;

  return mc(`/campaigns/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ settings }),
  });
}

export async function setCampaignContent(id: string, html: string): Promise<any> {
  return mc(`/campaigns/${id}/content`, {
    method: 'PUT',
    body: JSON.stringify({ html }),
  });
}
