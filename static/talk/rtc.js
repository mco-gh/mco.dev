// The link between the two browsers: one WebRTC media connection for video and
// audio, and one data channel for small JSON messages (names, languages,
// captions). PeerJS's public broker introduces the two browsers to each other;
// after that everything flows directly between them.
/* global Peer */
const PREFIX = 'talk-call-';
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';   // no look-alikes

export function newRoomCode() {
  const pick = crypto.getRandomValues(new Uint8Array(9));
  const chars = [...pick].map((n) => ALPHABET[n % ALPHABET.length]);
  return [chars.slice(0, 3), chars.slice(3, 6), chars.slice(6)].map((g) => g.join('')).join('-');
}

/**
 * Open (as host) or join a two-person call.
 * handlers: onWaiting(), onOpen(), onStream(stream), onMessage(obj), onEnded(reason)
 * Reasons: 'left' | 'lost' | 'full' | 'noroom' | 'taken' | 'network' | 'browser'
 */
export function openLink({ code, host, stream, handlers }) {
  const roomId = PREFIX + code;
  const peer = host ? new Peer(roomId) : new Peer();
  let conn = null;
  let call = null;
  let audioSender = null;
  let wantedTrack = null;
  let closed = false;

  const end = (reason) => {
    if (closed) return;
    closed = true;
    try { peer.destroy(); } catch {}
    handlers.onEnded?.(reason);
  };

  const applyTrack = () => {
    audioSender ??= call?.peerConnection?.getSenders().find((s) => s.track?.kind === 'audio') ?? null;
    if (audioSender && wantedTrack) audioSender.replaceTrack(wantedTrack).catch(() => {});
  };

  const wireConn = (c) => {
    conn = c;
    c.on('open', () => handlers.onOpen?.());
    c.on('data', (data) => {
      if (data?.t === 'full') return end('full');
      if (data?.t === 'bye') return end('left');
      handlers.onMessage?.(data);
    });
    c.on('close', () => end('left'));
  };

  const wireCall = (m) => {
    call = m;
    m.on('stream', (remote) => handlers.onStream?.(remote));
    m.on('close', () => end('left'));
    applyTrack();
    const pc = m.peerConnection;
    pc?.addEventListener('connectionstatechange', () => {
      if (pc.connectionState === 'connected') applyTrack();
      if (pc.connectionState === 'failed') end('lost');
    });
  };

  peer.on('open', () => {
    if (host) return handlers.onWaiting?.();
    wireConn(peer.connect(roomId, { reliable: true }));
    wireCall(peer.call(roomId, stream));
  });

  peer.on('connection', (c) => {
    if (!host) return c.close();
    if (conn) {
      // A call is for two. Tell the newcomer, then let them go.
      c.on('open', () => { c.send({ t: 'full' }); setTimeout(() => c.close(), 500); });
      return;
    }
    wireConn(c);
  });

  peer.on('call', (m) => {
    if (!host || call || (conn && m.peer !== conn.peer)) return m.close();
    m.answer(stream);
    wireCall(m);
  });

  // Losing the broker doesn't affect a call in progress; quietly reconnect so
  // a waiting host stays reachable.
  peer.on('disconnected', () => { if (!closed && !peer.destroyed) peer.reconnect(); });

  peer.on('error', (err) => {
    const reason = {
      'peer-unavailable': 'noroom',
      'unavailable-id': 'taken',
      'browser-incompatible': 'browser',
      'network': 'network',
      'server-error': 'network',
      'socket-error': 'network',
      'socket-closed': 'network',
    }[err.type];
    // Once the two browsers are talking, broker trouble is not our problem.
    if (reason && !(call?.open && reason === 'network')) end(reason);
  });

  return {
    send(message) { if (conn?.open) conn.send(message); },
    /** Swap what the other person hears (microphone or translated speech). */
    setAudioTrack(track) { wantedTrack = track; applyTrack(); },
    close() {
      if (closed) return;
      try { if (conn?.open) conn.send({ t: 'bye' }); } catch {}
      closed = true;
      // Give the goodbye a moment to leave before tearing down.
      setTimeout(() => { try { peer.destroy(); } catch {} }, 150);
    },
  };
}
