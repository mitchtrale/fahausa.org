/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

interface Env {
  DB: D1Database;
  R2: R2Bucket;
  ADMIN_PASSWORD: string;
  R2_PUBLIC_URL?: string;
  BREVO_API_KEY?: string;
  BREVO_LIST_ID?: string;
  BREVO_SENDER_NAME?: string;
  BREVO_SENDER_EMAIL?: string;
  MAILCHIMP_API_KEY?: string;
  MAILCHIMP_LIST_ID?: string;
}

declare namespace App {
  interface Locals extends Runtime {
    db?: import('./db/index').DB;
    env?: Env;
  }
}
