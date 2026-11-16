// Audio plumbing around a translation engine: feeds it speech from a
// MediaStream and plays what it says back into a Web Audio node. The same
// code translates your microphone (before it is sent) or your friend's voice
// (after it arrives), depending on which stream it is given.
const workletReady = new WeakMap();

function loadWorklet(ctx) {
  if (!workletReady.has(ctx)) {
    workletReady.set(ctx, ctx.audioWorklet.addModule(new URL('./audio/capture-worklet.js', import.meta.url)));
  }
  return workletReady.get(ctx);
}

/**
 * @returns {Promise<{ output: AudioNode, stop(): void }>} `output` carries the
 * translated speech; connect it to speakers or a MediaStream destination.
 */
export async function startTranslator({ ctx, engine, apiKey, stream, target, onCaption, onState }) {
  await loadWorklet(ctx);

  const source = ctx.createMediaStreamSource(stream);
  const capture = new AudioWorkletNode(ctx, 'pcm-capture', {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    processorOptions: { targetRate: engine.inputRate, chunkMs: 100 },
  });
  // The worklet only runs while it leads somewhere, so park it on a silent output.
  const sink = ctx.createGain();
  sink.gain.value = 0;
  source.connect(capture).connect(sink).connect(ctx.destination);

  const output = ctx.createGain();
  let playhead = 0;

  const session = engine.open({
    apiKey,
    target,
    onCaption,
    onState,
    onAudio(pcm, rate) {
      const buffer = ctx.createBuffer(1, pcm.length, rate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < pcm.length; i++) data[i] = pcm[i] / 0x8000;
      const node = ctx.createBufferSource();
      node.buffer = buffer;
      node.connect(output);
      // Queue chunks back to back; a small lead absorbs network jitter.
      playhead = Math.max(playhead, ctx.currentTime + 0.06);
      node.start(playhead);
      playhead += buffer.duration;
    },
  });

  capture.port.onmessage = (event) => session.sendAudio(event.data);

  return {
    output,
    stop() {
      capture.port.onmessage = null;
      session.close();
      source.disconnect();
      capture.disconnect();
      sink.disconnect();
      output.disconnect();
    },
  };
}
