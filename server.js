// ══════════════════════════════════════════════════════
//  SERVER.JS — VIDEO ADDITIONS
//  Add these changes to your existing server.js
// ══════════════════════════════════════════════════════

// ─────────────────────────────────────────
// CHANGE 1: In the 'find_match' handler
// After you destructure the data, extract 'mode':
//
//   const { name, faithId, matchPref, style, customFaith, mode } = data;
//
// Then store it on the seeker object:
//
//   const seeker = {
//     socket, name, faithId, broad, broader,
//     matchPref, style, customFaith,
//     mode: mode || 'text',   // ← ADD THIS
//   };
//
// And update isCompatible() to require matching mode:
//
//   if (seeker.style !== candidate.style) return false;
//   if (seeker.mode  !== candidate.mode)  return false;  // ← ADD THIS
//
// ─────────────────────────────────────────
// CHANGE 2: In the matched block (after socket.join / matched.socket.join),
// for video mode rooms, track which socket is the caller:

/*
  if (seeker.mode === 'video') {
    // Store caller designation in the room record
    activeRooms.set(roomId, {
      sockets: [socket.id, matched.socket.id],
      caller:  socket.id,   // first matched socket is caller
    });
  } else {
    activeRooms.set(roomId, {
      sockets: [socket.id, matched.socket.id],
    });
  }
*/

// ─────────────────────────────────────────
// CHANGE 3: ADD these two new socket event handlers
// inside the io.on('connection', ...) block:

/*
  // ── WebRTC: both peers signal they have media ready ──
  const videoReadyRooms = new Map(); // roomId -> [socketId, ...]

  socket.on('webrtc_ready', ({ roomId }) => {
    if (!videoReadyRooms.has(roomId)) videoReadyRooms.set(roomId, []);
    const ready = videoReadyRooms.get(roomId);
    if (!ready.includes(socket.id)) ready.push(socket.id);

    if (ready.length >= 2) {
      // Both sides ready — tell the room's caller to send the offer
      const room = activeRooms.get(roomId);
      if (!room) return;
      const callerId = room.caller || room.sockets[0];
      const [s1Id, s2Id] = room.sockets;

      io.sockets.sockets.get(s1Id)?.emit('webrtc_start', {
        isCaller: s1Id === callerId,
        roomId,
      });
      io.sockets.sockets.get(s2Id)?.emit('webrtc_start', {
        isCaller: s2Id === callerId,
        roomId,
      });

      videoReadyRooms.delete(roomId); // cleanup
    }
  });

  // ── WebRTC signaling relay ──
  socket.on('webrtc_offer', ({ sdp, roomId }) => {
    if (socket.rooms.has(roomId)) socket.to(roomId).emit('webrtc_offer', { sdp, roomId });
  });

  socket.on('webrtc_answer', ({ sdp, roomId }) => {
    if (socket.rooms.has(roomId)) socket.to(roomId).emit('webrtc_answer', { sdp });
  });

  socket.on('webrtc_ice', ({ candidate, roomId }) => {
    if (socket.rooms.has(roomId)) socket.to(roomId).emit('webrtc_ice', { candidate });
  });
*/

// ══════════════════════════════════════════════════════
//  COMPLETE UPDATED server.js — copy this entire file
// ══════════════════════════════════════════════════════

const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const path    = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, 'public')));

// ── Matchmaking state ──
const waitingPool   = [];
const activeRooms   = new Map();
const videoReadyRooms = new Map();
let totalChatsToday = 0;

// ── Faith metadata (unchanged) ──
const FAITH_META = {
  christian_protestant:  { broad:'christian',   broader:'abrahamic' },
  christian_catholic:    { broad:'christian',   broader:'abrahamic' },
  christian_orthodox:    { broad:'christian',   broader:'abrahamic' },
  christian_evangelical: { broad:'christian',   broader:'abrahamic' },
  christian_mormon:      { broad:'christian',   broader:'abrahamic' },
  christian_jehovah:     { broad:'christian',   broader:'abrahamic' },
  christian_other:       { broad:'christian',   broader:'abrahamic' },
  muslim_sunni:          { broad:'muslim',      broader:'abrahamic' },
  muslim_shia:           { broad:'muslim',      broader:'abrahamic' },
  muslim_sufi:           { broad:'muslim',      broader:'abrahamic' },
  muslim_ahmadi:         { broad:'muslim',      broader:'abrahamic' },
  muslim_other:          { broad:'muslim',      broader:'abrahamic' },
  jewish_orthodox:       { broad:'jewish',      broader:'abrahamic' },
  jewish_conservative:   { broad:'jewish',      broader:'abrahamic' },
  jewish_reform:         { broad:'jewish',      broader:'abrahamic' },
  jewish_secular:        { broad:'jewish',      broader:'abrahamic' },
  jewish_other:          { broad:'jewish',      broader:'abrahamic' },
  buddhist_zen:          { broad:'buddhist',    broader:'eastern' },
  buddhist_theravada:    { broad:'buddhist',    broader:'eastern' },
  buddhist_mahayana:     { broad:'buddhist',    broader:'eastern' },
  buddhist_tibetan:      { broad:'buddhist',    broader:'eastern' },
  buddhist_secular:      { broad:'buddhist',    broader:'eastern' },
  buddhist_other:        { broad:'buddhist',    broader:'eastern' },
  hindu_vaishnavism:     { broad:'hindu',       broader:'eastern' },
  hindu_shaivism:        { broad:'hindu',       broader:'eastern' },
  hindu_shaktism:        { broad:'hindu',       broader:'eastern' },
  hindu_advaita:         { broad:'hindu',       broader:'eastern' },
  hindu_other:           { broad:'hindu',       broader:'eastern' },
  sikh:                  { broad:'sikh',        broader:'eastern' },
  taoist:                { broad:'taoist',      broader:'eastern' },
  confucian:             { broad:'confucian',   broader:'eastern' },
  shinto:                { broad:'shinto',      broader:'eastern' },
  jain:                  { broad:'jain',        broader:'eastern' },
  zoroastrian:           { broad:'zoroastrian', broader:'eastern' },
  atheist_materialist:   { broad:'atheist',     broader:'nonreligious' },
  atheist_humanist:      { broad:'atheist',     broader:'nonreligious' },
  atheist_other:         { broad:'atheist',     broader:'nonreligious' },
  agnostic_strong:       { broad:'agnostic',    broader:'nonreligious' },
  agnostic_weak:         { broad:'agnostic',    broader:'nonreligious' },
  agnostic_other:        { broad:'agnostic',    broader:'nonreligious' },
  secular_spiritual:     { broad:'spiritual',   broader:'nonreligious' },
  deist:                 { broad:'deist',       broader:'nonreligious' },
  pagan_wiccan:          { broad:'pagan',       broader:'folk' },
  pagan_norse:           { broad:'pagan',       broader:'folk' },
  pagan_celtic:          { broad:'pagan',       broader:'folk' },
  pagan_other:           { broad:'pagan',       broader:'folk' },
  indigenous:            { broad:'indigenous',  broader:'folk' },
  other:                 { broad:'other',       broader:'other' },
};

function isCompatible(seeker, candidate) {
  if (seeker.socket.id === candidate.socket.id) return false;
  if (seeker.style !== candidate.style) return false;
  if (seeker.mode  !== candidate.mode)  return false; // ← NEW

  const pref = seeker.matchPref;
  switch (pref) {
    case 'any':              return true;
    case 'any_different':    return seeker.broad !== candidate.broad;
    case 'any_abrahamic':    return candidate.broader === 'abrahamic';
    case 'any_eastern':      return candidate.broader === 'eastern';
    case 'any_nonreligious': return candidate.broader === 'nonreligious';
    case 'any_folk':         return candidate.broader === 'folk';
    case 'any_christian':    return candidate.broad === 'christian';
    case 'any_muslim':       return candidate.broad === 'muslim';
    case 'any_jewish':       return candidate.broad === 'jewish';
    case 'any_buddhist':     return candidate.broad === 'buddhist';
    case 'any_hindu':        return candidate.broad === 'hindu';
    case 'any_atheist':      return candidate.broad === 'atheist';
    case 'any_agnostic':     return candidate.broad === 'agnostic';
    default:                 return candidate.faithId === pref;
  }
}

function findMatch(seeker) {
  for (let i = 0; i < waitingPool.length; i++) {
    const candidate = waitingPool[i];
    if (candidate.socket.id === seeker.socket.id) continue;
    if (isCompatible(seeker, candidate) && isCompatible(candidate, seeker)) return i;
  }
  return -1;
}

function removeFromPool(socketId) {
  const idx = waitingPool.findIndex(u => u.socket.id === socketId);
  if (idx !== -1) waitingPool.splice(idx, 1);
}

function broadcastStats() {
  io.emit('stats', {
    online: io.engine.clientsCount,
    chatsToday: totalChatsToday,
  });
}
setInterval(broadcastStats, 5000);

function formatFaithLabel(faithId, customFaith) {
  if (faithId === 'other') return customFaith || 'Other';
  return faithId
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace('Christian ', 'Christian (')
    .replace('Muslim ', 'Muslim (')
    .replace('Jewish ', 'Jewish (')
    .replace('Buddhist ', 'Buddhist (')
    .replace('Hindu ', 'Hindu (')
    .replace('Atheist ', 'Atheist (')
    .replace('Agnostic ', 'Agnostic (')
    .replace('Pagan ', 'Pagan (')
    + (faithId.includes('_') && !['secular_spiritual'].includes(faithId) ? ')' : '');
}

// ══════════════════════════════════════════════════════
io.on('connection', (socket) => {
  console.log(`[+] Connected: ${socket.id}`);
  broadcastStats();

  socket.on('find_match', (data) => {
    const { name, faithId, matchPref, style, customFaith, mode } = data; // ← mode added
    if (!name || !faithId) return;
    const meta = FAITH_META[faithId] || { broad: 'other', broader: 'other' };

    const seeker = {
      socket,
      name:        name.slice(0, 24),
      faithId,
      broad:       meta.broad,
      broader:     meta.broader,
      matchPref:   matchPref || 'any',
      style:       style || 'casual',
      customFaith: customFaith || '',
      mode:        mode || 'text', // ← NEW
    };

    removeFromPool(socket.id);
    const matchIdx = findMatch(seeker);

    if (matchIdx !== -1) {
      const matched = waitingPool.splice(matchIdx, 1)[0];
      const roomId  = `room_${socket.id}_${matched.socket.id}`;

      socket.join(roomId);
      matched.socket.join(roomId);

      // ← Store caller for video mode
      activeRooms.set(roomId, {
        sockets: [socket.id, matched.socket.id],
        caller:  socket.id,
        mode:    seeker.mode,
      });

      totalChatsToday++;

      socket.emit('matched', {
        name:   matched.name,
        faith:  formatFaithLabel(matched.faithId, matched.customFaith),
        roomId,
        style:  seeker.style,
        mode:   seeker.mode, // ← NEW
      });
      matched.socket.emit('matched', {
        name:   seeker.name,
        faith:  formatFaithLabel(seeker.faithId, seeker.customFaith),
        roomId,
        style:  seeker.style,
        mode:   seeker.mode, // ← NEW
      });

      console.log(`[match][${seeker.mode}] ${seeker.name} <-> ${matched.name} room: ${roomId}`);
      broadcastStats();
    } else {
      waitingPool.push(seeker);
      socket.emit('waiting');
    }
  });

  socket.on('message', (data) => {
    const { text, roomId } = data;
    if (!text || !roomId || !socket.rooms.has(roomId)) return;
    socket.to(roomId).emit('message', { text: text.slice(0, 1000) });
  });

  socket.on('skip', (data) => {
    const { roomId } = data || {};
    if (roomId) leaveRoom(socket, roomId);
  });

  socket.on('end_chat', (data) => {
    const { roomId } = data || {};
    if (roomId) leaveRoom(socket, roomId);
  });

  socket.on('cancel_match', () => {
    removeFromPool(socket.id);
  });

  // ── WebRTC signaling ── (NEW)
  socket.on('webrtc_ready', ({ roomId }) => {
    if (!videoReadyRooms.has(roomId)) videoReadyRooms.set(roomId, []);
    const ready = videoReadyRooms.get(roomId);
    if (!ready.includes(socket.id)) ready.push(socket.id);

    if (ready.length >= 2) {
      const room = activeRooms.get(roomId);
      if (!room) return;
      const callerId = room.caller || room.sockets[0];
      const [s1Id, s2Id] = room.sockets;

      io.sockets.sockets.get(s1Id)?.emit('webrtc_start', {
        isCaller: s1Id === callerId, roomId,
      });
      io.sockets.sockets.get(s2Id)?.emit('webrtc_start', {
        isCaller: s2Id === callerId, roomId,
      });
      videoReadyRooms.delete(roomId);
    }
  });

  socket.on('webrtc_offer', ({ sdp, roomId }) => {
    if (socket.rooms.has(roomId)) socket.to(roomId).emit('webrtc_offer', { sdp, roomId });
  });

  socket.on('webrtc_answer', ({ sdp, roomId }) => {
    if (socket.rooms.has(roomId)) socket.to(roomId).emit('webrtc_answer', { sdp });
  });

  socket.on('webrtc_ice', ({ candidate, roomId }) => {
    if (socket.rooms.has(roomId)) socket.to(roomId).emit('webrtc_ice', { candidate });
  });

  // ──────────────────────────────────────────
  socket.on('disconnect', () => {
    removeFromPool(socket.id);
    for (const [roomId, room] of activeRooms.entries()) {
      if (room.sockets.includes(socket.id)) {
        socket.to(roomId).emit('match_disconnected');
        activeRooms.delete(roomId);
        videoReadyRooms.delete(roomId);
        break;
      }
    }
    broadcastStats();
  });
});

function leaveRoom(socket, roomId) {
  socket.to(roomId).emit('match_disconnected');
  socket.leave(roomId);
  activeRooms.delete(roomId);
  videoReadyRooms.delete(roomId);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`InterfaithDebate server running on http://localhost:${PORT}`);
});