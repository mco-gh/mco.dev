// Talks to Claude straight from the browser with the visitor's own API key.
// There is no server in between: the key and the photo go only to Anthropic.

import { Anthropic, betaZodOutputFormat } from '../vendor/anthropic.js';
import { ScanError } from './errors.js';

export const MODEL = 'claude-opus-5-5';
export const EFFORT = 'high';

/**
 * Build the function the scan pipeline uses to question the model.
 * @param {string} apiKey the visitor's Anthropic API key
 */
export function createAsk(apiKey) {
  // dangerouslyAllowBrowser: the SDK refuses to run in a page by default, because a
  // key shipped with a site is exposed to every visitor. Here the key is the
  // visitor's own, typed in by them, so the usual objection does not apply.
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  /**
   * Ask about one or more images and get back an object matching `schema`.
   * @param {object} request
   * @param {string} request.system
   * @param {{jpeg: string, caption?: string}[]} request.images base64 JPEGs
   * @param {string} request.prompt
   * @param {import('zod').ZodType} request.schema
   * @param {string} [request.effort]
   */
  return async function ask({ system, images, prompt, schema, effort = EFFORT }) {
    const content = [];
    for (const image of images) {
      if (image.caption) content.push({ type: 'text', text: image.caption });
      content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image.jpeg } });
    }
    content.push({ type: 'text', text: prompt });

    let response;
    try {
      response = await client.beta.messages.parse({
        model: MODEL,
        max_tokens: 16000,
        system,
        messages: [{ role: 'user', content }],
        output_config: { effort, format: betaZodOutputFormat(schema) },
        // If the model declines a request for policy reasons, let the API retry it
        // on its default fallback model instead of failing the scan.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
      });
    } catch (error) {
      if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
        throw new ScanError('Anthropic did not accept that API key. Check it under “Your API key” and try again.');
      }
      if (error instanceof Anthropic.RateLimitError) {
        throw new ScanError('Your Anthropic account hit its rate limit. Wait a minute and scan again.');
      }
      if (error instanceof Anthropic.BadRequestError && /credit balance/i.test(error.message)) {
        throw new ScanError('The Anthropic account for this key has no credit. Add credits under Billing in the Claude Console, then scan again.');
      }
      if (error instanceof Anthropic.BadRequestError) {
        throw new ScanError(`Anthropic rejected the request: ${error.message}`);
      }
      if (error instanceof Anthropic.APIConnectionError) {
        throw new ScanError('Could not reach Anthropic. Check your internet connection and try again.');
      }
      if (error instanceof Anthropic.APIError) {
        throw new ScanError(`Anthropic returned an error (${error.status}). Try again in a moment.`);
      }
      throw error;
    }

    if (response.stop_reason === 'refusal') throw new ScanError('The model declined to analyse this image.');
    if (response.stop_reason === 'max_tokens') {
      throw new ScanError('The model ran out of room describing this shelf. Try a photo with fewer books in it.');
    }
    if (!response.parsed_output) throw new ScanError('The model returned a reply that could not be read.');
    return { output: response.parsed_output, usage: response.usage };
  };
}
