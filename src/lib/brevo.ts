function getApiKey(): string {
  const key = import.meta.env.BREVO_API_KEY;
  if (!key) throw new Error('BREVO_API_KEY is not set');
  return key;
}

function getListId(): number {
  const id = import.meta.env.BREVO_LIST_ID;
  if (!id) throw new Error('BREVO_LIST_ID is not set');
  return Number(id);
}

function getSender(): { name: string; email: string } {
  return {
    name: import.meta.env.BREVO_SENDER_NAME || 'FAHA',
    email: import.meta.env.BREVO_SENDER_EMAIL || 'mtrale@fahausa.org',
  };
}

async function brevo(path: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    ...options,
    headers: {
      'api-key': getApiKey(),
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  // 204 = success with no body (update)
  if (res.status === 204) return {};

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Brevo API error ${res.status}: ${body.message || JSON.stringify(body)}`);
  }
  return body;
}

export interface BrevoCampaign {
  id: number;
  name: string;
  subject: string;
  status: string;
  sender: { name: string; email: string };
  previewText: string;
  createdAt: string;
  modifiedAt: string;
  sentDate?: string;
}

export interface BrevoCampaignListResponse {
  campaigns: BrevoCampaign[];
  count: number;
}

export async function listCampaigns(limit = 50, offset = 0): Promise<BrevoCampaignListResponse> {
  return brevo(`/emailCampaigns?type=classic&limit=${limit}&offset=${offset}&sort=desc&excludeHtmlContent=true`);
}

export async function getCampaign(id: number): Promise<BrevoCampaign> {
  return brevo(`/emailCampaigns/${id}`);
}

export interface CreateCampaignData {
  name: string;
  subject: string;
  previewText: string;
  htmlContent: string;
}

export async function createCampaign(data: CreateCampaignData): Promise<{ id: number }> {
  return brevo('/emailCampaigns', {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      subject: data.subject,
      previewText: data.previewText,
      htmlContent: data.htmlContent,
      sender: getSender(),
      recipients: { listIds: [getListId()] },
    }),
  });
}

export async function updateCampaign(
  id: number,
  data: Partial<CreateCampaignData>,
): Promise<void> {
  const body: Record<string, any> = {};
  if (data.name) body.name = data.name;
  if (data.subject) body.subject = data.subject;
  if (data.previewText) body.previewText = data.previewText;
  if (data.htmlContent) body.htmlContent = data.htmlContent;

  await brevo(`/emailCampaigns/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// --- Contacts / Subscribers ---

export async function addContact(email: string): Promise<{ id: number }> {
  return brevo('/contacts', {
    method: 'POST',
    body: JSON.stringify({
      email,
      listIds: [getListId()],
      updateEnabled: true,
    }),
  });
}

// --- Transactional Email ---

export interface TransactionalEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: { email: string; name?: string };
  params?: Record<string, string>;
  tags?: string[];
}

export interface TransactionalEmailResponse {
  messageId: string;
}

export async function sendTransactionalEmail(
  options: TransactionalEmailOptions,
): Promise<TransactionalEmailResponse> {
  const body: Record<string, any> = {
    sender: getSender(),
    to: options.to,
    subject: options.subject,
    htmlContent: options.htmlContent,
  };

  if (options.textContent) body.textContent = options.textContent;
  if (options.replyTo) body.replyTo = options.replyTo;
  if (options.params) body.params = options.params;
  if (options.tags) body.tags = options.tags;

  return brevo('/smtp/email', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
