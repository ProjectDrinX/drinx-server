export function genUID(): string {
  let r = '';
  const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i += 1) r += c.charAt(Math.floor(Math.random() * 62));
  return r;
}

export function isUID(s: string): boolean {
  return s.length === 32 && /^[A-Z0-9]{32}$/i.test(s);
}

export function isUsername(s: string): boolean {
  return s.length >= 3 && s.length <= 16 && /^[a-zA-Z0-9_]{3,16}$/i.test(s);
}

export default undefined;
