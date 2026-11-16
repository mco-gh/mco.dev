// Translation engines.
//
// An engine turns a stream of speech in one language into speech in another.
// It only speaks the provider's wire protocol; microphone capture and
// playback are handled by ../translator.js. To add one, export an object with
// this shape and register it below:
//
//   id, name            identifiers
//   keyUrl              where a user gets an API key
//   inputRate           sample rate (Hz) of the 16-bit mono PCM it wants
//   supports(language)  true if it can translate to/from a ../languages entry
//   open({ apiKey, target, onAudio, onCaption, onState }) -> { sendAudio, close }
//       target              a ../languages entry: the language to speak
//       sendAudio(buffer)   ArrayBuffer of Int16 PCM at inputRate
//       onAudio(pcm, rate)  Int16Array of translated speech
//       onCaption(text)     a fragment of the translated transcript
//       onState(state, detail)  'connecting' | 'live' | 'reconnecting' | 'error'
//                               ('error' is final; detail is a short reason)
import geminiLive from './gemini-live.js';

export const ENGINES = { [geminiLive.id]: geminiLive };
export const DEFAULT_ENGINE = geminiLive;
export const getEngine = (id) => ENGINES[id] ?? DEFAULT_ENGINE;
