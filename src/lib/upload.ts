const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function validateUpload(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed.';
  }
  if (file.size > MAX_SIZE) {
    return 'File must be under 5MB.';
  }
  return null;
}

export function generateKey(filename: string): string {
  const ext = filename.split('.').pop() ?? 'jpg';
  const id = crypto.randomUUID();
  return `events/${id}.${ext}`;
}
