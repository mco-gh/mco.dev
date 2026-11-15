// Everything static/bookshelf needs from npm, bundled into one browser module
// so the page never loads code from a third-party CDN.
export { default as Anthropic } from '@anthropic-ai/sdk';
export { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
export { z } from 'zod';
