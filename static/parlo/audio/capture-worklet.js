// Runs on the audio thread: downsamples whatever it hears to 16-bit mono PCM
// at the engine's sample rate and posts it in fixed-size chunks.
class PcmCapture extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const { targetRate, chunkMs } = options.processorOptions;
    this.step = sampleRate / targetRate;      // input samples per output sample
    this.chunk = new Int16Array(Math.round(targetRate * chunkMs / 1000));
    this.filled = 0;
    this.phase = 0;
    this.sum = 0;
    this.count = 0;
  }

  process(inputs) {
    const input = inputs[0]?.[0];
    if (!input) return true;
    for (let i = 0; i < input.length; i++) {
      // Averaging each group of input samples is a cheap low-pass filter,
      // which is plenty for speech.
      this.sum += input[i];
      this.count += 1;
      this.phase += 1;
      if (this.phase < this.step) continue;
      this.phase -= this.step;
      const s = Math.max(-1, Math.min(1, this.sum / this.count));
      this.chunk[this.filled++] = s < 0 ? s * 0x8000 : s * 0x7fff;
      this.sum = 0;
      this.count = 0;
      if (this.filled === this.chunk.length) {
        this.port.postMessage(this.chunk.buffer.slice(0));
        this.filled = 0;
      }
    }
    return true;
  }
}

registerProcessor('pcm-capture', PcmCapture);
