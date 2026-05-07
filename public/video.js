// ── InterfaithDebate — video.js ──
// Handles WebRTC peer connection, media controls,
// and the video-chat screen UI.
// Loaded AFTER client.js in index.html.
// Relies on: socket (from client.js), state (from client.js), showScreen()

// ════════════════════════════════════════════
// ICE CONFIG — add TURN servers here for prod
// ════════════════════════════════════════════
const ICE_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

// ════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════
const vid = {
  localStream:  null,   // MediaStream from getUserMedia
  pc:           null,   // RTCPeerConnection
  isCaller:     false,  // true = the one who sends the offer
  micOn:        true,
  camOn:        true,
  roomId:       null,
  cameras:      [],     // list of {deviceId, label}
};

// ════════════════════════════════════════════
// DOM REFS
// ════════════════════════════════════════════
const elRemoteVideo       = document.getElementById('video-remote');
const elLocalVideo        = document.getElementById('video-local');
const elRemotePlaceholder = document.getElementById('video-remote-placeholder');
const elConnectingOverlay = document.getElementById('video-connecting-overlay');
const elConnectingText    = document.getElementById('video-connecting-text');
const elMatchOverlay      = document.getElementById('video-match-overlay');
const elMatchName         = document.getElementById('video-match-name');
const elMatchFaith        = document.getElementById('video-match-faith');
const elPipCamOff         = document.getElementById('pip-cam-off');
const elCamSelect         = document.getElementById('cam-select');
const elVideoChatMsgs     = document.getElementById('video-chat-messages');
const elVideoChatInput    = document.getElementById('video-chat-input');
const elVideoSendBtn      = document.getElementById('video-btn-send');
const elVideoStyleBadge   = document.getElementById('video-style-badge');
const ctrlMic             = document.getElementById('ctrl-mic');
const ctrlCam             = document.getElementById('ctrl-cam');
const ctrlSkip            = document.getElementById('ctrl-skip-video');
const ctrlEnd             = document.getElementById('ctrl-end-video');

// ════════════════════════════════════════════
// MODE PICKER (landing screen)
// ════════════════════════════════════════════
document.querySelectorAll('[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.chatMode = btn.dataset.mode; // 'text' | 'video'
  });
});
// default
state.chatMode = 'text';

// ════════════════════════════════════════════
// SOCKET SIGNALING — WebRTC
// ════════════════════════════════════════════
socket.on('webrtc_offer', async ({ sdp, roomId }) => {
  if (roomId !== vid.roomId) return;
  try {
    await ensurePeerConnection();
    await vid.pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await vid.pc.createAnswer();
    await vid.pc.setLocalDescription(answer);
    socket.emit('webrtc_answer', { sdp: answer, roomId: vid.roomId });
  } catch (e) {
    console.error('[WebRTC] offer handling error', e);
  }
});

socket.on('webrtc_answer', async ({ sdp }) => {
  try {
    if (!vid.pc) return;
    await vid.pc.setRemoteDescription(new RTCSessionDescription(sdp));
  } catch (e) {
    console.error('[WebRTC] answer handling error', e);
  }
});

socket.on('webrtc_ice', async ({ candidate }) => {
  try {
    if (vid.pc && candidate) await vid.pc.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (e) {
    console.error('[WebRTC] ICE error', e);
  }
});

// Server tells us we're the caller (first matched socket emits offer)
socket.on('webrtc_start', ({ isCaller, roomId }) => {
  vid.isCaller = isCaller;
  vid.roomId   = roomId;
  if (isCaller) startOffer();
});

// Peer disconnected from video room — only handle when on video screen
socket.on('match_disconnected', () => {
  if (!document.getElementById('screen-video').classList.contains('active')) return;
  addVideoMsg('system', 'Peer disconnected.');
  cleanupPeer();
  setTimeout(() => {
    showScreen('disconnected');
    document.getElementById('disc-reason').textContent = `${state.matchName || 'Your match'} disconnected.`;
  }, 1200);
});

// ════════════════════════════════════════════
// PEER CONNECTION SETUP
// ════════════════════════════════════════════
async function ensurePeerConnection() {
  if (vid.pc) return;

  vid.pc = new RTCPeerConnection(ICE_CONFIG);

  // Add local tracks
  if (vid.localStream) {
    vid.localStream.getTracks().forEach(t => vid.pc.addTrack(t, vid.localStream));
  }

  // Remote stream
  const remoteStream = new MediaStream();
  elRemoteVideo.srcObject = remoteStream;

  vid.pc.ontrack = (e) => {
    e.streams[0].getTracks().forEach(t => remoteStream.addTrack(t));
    elRemotePlaceholder.style.display = 'none';
    elRemoteVideo.style.display       = 'block';
    elConnectingOverlay.classList.add('hidden');
    elMatchOverlay.style.display      = 'flex';
  };

  vid.pc.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit('webrtc_ice', { candidate: e.candidate, roomId: vid.roomId });
    }
  };

  vid.pc.onconnectionstatechange = () => {
    const s = vid.pc?.connectionState;
    if (s === 'connected') {
      elConnectingOverlay.classList.add('hidden');
    } else if (s === 'failed' || s === 'disconnected') {
      elConnectingText.textContent = 'Connection lost. Try skipping.';
    }
  };
}

async function startOffer() {
  await ensurePeerConnection();
  const offer = await vid.pc.createOffer();
  await vid.pc.setLocalDescription(offer);
  socket.emit('webrtc_offer', { sdp: offer, roomId: vid.roomId });
}

function cleanupPeer() {
  vid.pc?.close();
  vid.pc = null;
  elRemoteVideo.srcObject  = null;
  elRemoteVideo.style.display       = 'none';
  elRemotePlaceholder.style.display = 'flex';
  elMatchOverlay.style.display      = 'none';
}

// ════════════════════════════════════════════
// MEDIA — getUserMedia + camera list
// ════════════════════════════════════════════
async function startLocalMedia(deviceId) {
  try {
    if (vid.localStream) {
      vid.localStream.getTracks().forEach(t => t.stop());
    }
    const constraints = {
      audio: true,
      video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'user' },
    };
    vid.localStream = await navigator.mediaDevices.getUserMedia(constraints);
    elLocalVideo.srcObject = vid.localStream;
    applyMicState();
    applyCamState();
    await populateCameras();
  } catch (e) {
    console.error('[Media] getUserMedia failed', e);
    elConnectingText.textContent = 'Camera/mic access denied.';
  }
}

async function populateCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  vid.cameras = devices.filter(d => d.kind === 'videoinput');
  elCamSelect.innerHTML = '';
  vid.cameras.forEach((cam, i) => {
    const opt = document.createElement('option');
    opt.value = cam.deviceId;
    opt.textContent = cam.label || `Camera ${i + 1}`;
    elCamSelect.appendChild(opt);
  });
  // Select the currently active camera
  const activeCam = vid.localStream?.getVideoTracks()[0];
  if (activeCam) {
    const activeSettings = activeCam.getSettings();
    elCamSelect.value = activeSettings.deviceId || '';
  }
}

elCamSelect.addEventListener('change', () => {
  startLocalMedia(elCamSelect.value).then(() => {
    // Replace tracks in existing peer connection
    if (vid.pc && vid.localStream) {
      const [videoTrack] = vid.localStream.getVideoTracks();
      vid.pc.getSenders().forEach(sender => {
        if (sender.track?.kind === 'video' && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });
    }
  });
});

// ════════════════════════════════════════════
// CONTROLS
// ════════════════════════════════════════════
function applyMicState() {
  vid.localStream?.getAudioTracks().forEach(t => { t.enabled = vid.micOn; });
  ctrlMic.textContent = vid.micOn ? '🎙️' : '🔇';
  ctrlMic.classList.toggle('off', !vid.micOn);
}

function applyCamState() {
  vid.localStream?.getVideoTracks().forEach(t => { t.enabled = vid.camOn; });
  ctrlCam.textContent = vid.camOn ? '📷' : '🚫';
  ctrlCam.classList.toggle('off', !vid.camOn);
  elPipCamOff.classList.toggle('show', !vid.camOn);
}

ctrlMic.addEventListener('click', () => { vid.micOn = !vid.micOn; applyMicState(); });
ctrlCam.addEventListener('click', () => { vid.camOn = !vid.camOn; applyCamState(); });

ctrlSkip.addEventListener('click', () => {
  if (vid.roomId) socket.emit('skip', { roomId: vid.roomId });
  cleanupPeer();
  vid.roomId = null;
  showScreen('waiting');
  socket.emit('find_match', {
    name: state.name, faithId: state.faithId,
    matchPref: state.matchPref, style: state.style,
    customFaith: state.customFaith, mode: 'video',
  });
});

ctrlEnd.addEventListener('click', () => {
  if (vid.roomId) socket.emit('end_chat', { roomId: vid.roomId });
  cleanupPeer();
  stopLocalMedia();
  vid.roomId = null;
  showScreen('disconnected');
  document.getElementById('disc-reason').textContent = 'You ended the video call.';
});

function stopLocalMedia() {
  vid.localStream?.getTracks().forEach(t => t.stop());
  vid.localStream = null;
  elLocalVideo.srcObject = null;
}

// ════════════════════════════════════════════
// VIDEO SCREEN TEXT CHAT
// ════════════════════════════════════════════
function addVideoMsg(type, text) {
  if (type === 'system') {
    const el = document.createElement('div');
    el.className = 'system-msg';
    el.textContent = text;
    elVideoChatMsgs.appendChild(el);
  } else {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${type}`;
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    const meta = document.createElement('div');
    meta.className = 'message-meta';
    const time = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    meta.textContent = type === 'mine' ? `You · ${time}` : `${state.matchName || 'Stranger'} · ${time}`;
    wrapper.appendChild(bubble);
    wrapper.appendChild(meta);
    elVideoChatMsgs.appendChild(wrapper);
  }
  elVideoChatMsgs.scrollTop = elVideoChatMsgs.scrollHeight;
}

function sendVideoMsg() {
  const text = elVideoChatInput.value.trim();
  if (!text || !vid.roomId) return;
  elVideoChatInput.value = '';
  videoInputAutoResize();
  addVideoMsg('mine', text);
  socket.emit('message', { text, roomId: vid.roomId });
}

elVideoSendBtn.addEventListener('click', sendVideoMsg);
elVideoChatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendVideoMsg(); }
});

function videoInputAutoResize() {
  elVideoChatInput.style.height = 'auto';
  elVideoChatInput.style.height = Math.min(elVideoChatInput.scrollHeight, 90) + 'px';
}
elVideoChatInput.addEventListener('input', videoInputAutoResize);

// Receive text messages while in video screen
// client.js has its own listener guarded to text-chat; this one is guarded to video.
socket.on('message', ({ text }) => {
  if (!document.getElementById('screen-video').classList.contains('active')) return;
  addVideoMsg('theirs', text);
});

// ════════════════════════════════════════════
// ENTRY POINT — called when video match is made
// ════════════════════════════════════════════
window.startVideoChat = async function(data) {
  vid.roomId = data.roomId;

  // Update UI
  elMatchName.textContent  = data.name;
  elMatchFaith.textContent = data.faith;
  const styleLabels = { casual:'Casual Chat', debate:'Structured Debate', ama:'Ask Me Anything' };
  elVideoStyleBadge.textContent = styleLabels[state.style] || 'Casual';

  // Reset UI
  elVideoChatMsgs.innerHTML     = '';
  elRemoteVideo.style.display   = 'none';
  elRemotePlaceholder.style.display = 'flex';
  elConnectingOverlay.classList.remove('hidden');
  elConnectingText.textContent  = 'Getting camera & mic…';
  elMatchOverlay.style.display  = 'none';

  showScreen('video');

  // Get media first, then signal server we're ready for WebRTC
  await startLocalMedia();
  elConnectingText.textContent = 'Connecting to peer…';

  // Tell server we're ready; server decides who is caller
  socket.emit('webrtc_ready', { roomId: vid.roomId });

  addVideoMsg('system', `Video call with ${data.name} (${data.faith}). Say hello!`);
};