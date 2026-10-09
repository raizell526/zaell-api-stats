import fetch from 'node-fetch';

export async function deepseek(prompt) {
  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=deepseek`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const text = await res.text();
  return { model: 'deepseek-r1', response: text.trim() };
}

export async function gpt4(prompt) {
  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const text = await res.text();
  return { model: 'gpt-4o-mini', response: text.trim() };
}

export async function gemini(prompt) {
  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=gemini`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const text = await res.text();
  return { model: 'gemini-1.5-flash', response: text.trim() };
}

export default { deepseek, gpt4, gemini };
