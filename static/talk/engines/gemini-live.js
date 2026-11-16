// Google Gemini Live Translate: streaming speech-to-speech translation that
// detects the spoken language and replies in the target language, imitating
// the speaker's voice. One WebSocket per direction.
// Docs: https://ai.google.dev/gemini-api/docs/live-api/live-translate
const MODEL = 'models/gemini-3.5-live-translate-preview';
const ENDPOINT = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';
const OUTPUT_RATE = 24000;
const MAX_RETRIES = 4;

const ID = 'gemini-live';
const codeFor = (language) => language?.engineCodes?.[ID] ?? language?.code;

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

function fromBase64(b64) {
  const s = atob(b64);
  const bytes = new Uint8Array(s.length & ~1);
  for (let i = 0; i < bytes.length; i++) bytes[i] = s.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}

export default {
  id: ID,
  name: 'Gemini Live Translate',
  keyUrl: 'https://aistudio.google.com/apikey',
  inputRate: 16000,

  supports: (language) => Boolean(codeFor(language)),

  open({ apiKey, target, onAudio, onCaption, onState }) {
    let ws = null;
    let live = false;
    let closed = false;
    let retries = 0;
    let retryTimer = 0;

    const fail = (reason) => {
      if (closed) return;
      closed = true;
      onState('error', reason);
    };

    const connect = () => {
      live = false;
      onState(retries ? 'reconnecting' : 'connecting');
      // Browsers can't set headers on a WebSocket, so the key goes in the URL
      // as the API documents. It is the user's own key, used from their browser.
      ws = new WebSocket(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`);
      ws.binaryType = 'arraybuffer';

      ws.onopen = () => ws.send(JSON.stringify({
        setup: {
          model: MODEL,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          generationConfig: {
            responseModalities: ['AUDIO'],
            translationConfig: {
              targetLanguageCode: codeFor(target),
              // If the speaker switches to the listener's language, pass it through.
              echoTargetLanguage: true,
            },
          },
        },
      }));

      ws.onmessage = (event) => {
        let msg;
        try {
          msg = JSON.parse(typeof event.data === 'string' ? event.data : new TextDecoder().decode(event.data));
        } catch { return; }
        if (msg.setupComplete) {
          live = true;
          retries = 0;
          onState('live');
          return;
        }
        const content = msg.serverContent;
        if (!content) return;
        for (const part of content.modelTurn?.parts ?? []) {
          if (part.inlineData?.data) onAudio(fromBase64(part.inlineData.data), OUTPUT_RATE);
        }
        if (content.outputTranscription?.text) onCaption(content.outputTranscription.text);
      };

      ws.onclose = (event) => {
        if (closed) return;
        const wasLive = live;
        live = false;
        const reason = event.reason || `connection closed (${event.code})`;
        // Never got as far as a working session: bad key, no access to the
        // model, or no network. Retrying won't help.
        if (!wasLive && retries === 0) return fail(/api key|permission|unauth/i.test(reason) ? 'badkey' : reason);
        // Sessions have a time limit and networks blip; pick up where we left off.
        if (retries >= MAX_RETRIES) return fail(reason);
        retries += 1;
        retryTimer = setTimeout(connect, wasLive ? 0 : 500 * 2 ** retries);
      };
    };

    connect();

    return {
      sendAudio(buffer) {
        if (!live || ws.readyState !== WebSocket.OPEN) return;
        ws.send(JSON.stringify({
          realtimeInput: { audio: { data: toBase64(buffer), mimeType: 'audio/pcm;rate=16000' } },
        }));
      },
      close() {
        closed = true;
        clearTimeout(retryTimer);
        try { ws?.close(); } catch {}
      },
    };
  },
};
