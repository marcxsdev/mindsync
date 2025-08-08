const { createServer } = require("node:http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const { cardPairs } = require("./src/lib/cardsData.js");

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://mindsync-two.vercel.app"],
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  socket.on("createRoom", ({ username }) => {
    const roomId = Math.floor(1000 + Math.random() * 9000).toString();
    const randomIndex = Math.floor(Math.random() * cardPairs.length);
    console.log(`Sala criada: ${roomId}, usuário: ${username}`);
    rooms.set(roomId, {
      hinter: socket.id,
      guesser: null,
      gameState: {
        phase: "waiting",
        targetPosition: Math.floor(Math.random() * 101),
        markerPosition: 50,
        score: 0,
        currentCards: cardPairs[randomIndex],
        sliderWidth: 1000,
      },
    });
    console.log("Estado das salas:", Array.from(rooms.keys()));
    socket.join(roomId);
    socket.emit("roomCreated", { roomId, username, role: "hinter" });
  });

  socket.on("joinRoom", ({ roomId, username }) => {
    console.log(`Tentativa de entrar na sala: ${roomId}, usuário: ${username}`);
    const room = rooms.get(roomId);
    if (!room) {
      console.log(
        `Sala ${roomId} não encontrada. Salas disponíveis:`,
        Array.from(rooms.keys())
      );
      socket.emit("error", "Sala não encontrada");
      return;
    }
    if (room.guesser) {
      console.log(`Sala ${roomId} já está cheia`);
      socket.emit("error", "Sala cheia");
      return;
    }
    room.guesser = socket.id;
    socket.join(roomId);
    socket.emit("roomJoined", { roomId, username, role: "guesser" });
    room.gameState.phase = "hintGiverView";
    io.to(roomId).emit("showTarget", false);
    io.to(roomId).emit("gameStart", { gameState: room.gameState });
    io.to(roomId).emit("updateGameState", room.gameState);
    console.log(`Usuário ${username} entrou na sala ${roomId} como guesser`);
  });

  socket.on("gameAction", ({ roomId, action }) => {
    const room = rooms.get(roomId);
    if (!room) {
      console.log(`Ação ignorada: sala ${roomId} não encontrada`);
      return;
    }

    const gameState = room.gameState;
    if (
      action === "reveal" &&
      socket.id === room.hinter &&
      gameState.phase === "hintGiverView"
    ) {
      gameState.phase = "hintGiverHide";
      io.to(room.hinter).emit("showTarget", true);
      io.to(roomId).emit("updateGameState", gameState);
      console.log(`Sala ${roomId}: fase alterada para hintGiverHide`);
    } else if (
      action === "hide" &&
      socket.id === room.hinter &&
      gameState.phase === "hintGiverHide"
    ) {
      gameState.phase = "guesserTurn";
      io.to(roomId).emit("showTarget", false);
      io.to(roomId).emit("updateGameState", gameState);
      console.log(`Sala ${roomId}: fase alterada para guesserTurn`);
    } else if (
      action === "confirm" &&
      socket.id === room.guesser &&
      gameState.phase === "guesserTurn"
    ) {
      gameState.phase = "revealResult";
      const points = calculateScore(
        gameState.markerPosition,
        gameState.targetPosition,
        gameState.sliderWidth
      );
      gameState.score += points;
      io.to(roomId).emit("showTarget", true);
      io.to(roomId).emit("updateGameState", gameState);
      console.log(
        `Sala ${roomId}: fase alterada para revealResult, pontos: ${points}`
      );
    } else if (action === "finalize" && gameState.phase === "revealResult") {
      startNewRound(roomId);
      io.to(roomId).emit("showTarget", false);
      io.to(roomId).emit("updateGameState", room.gameState);
      console.log(`Sala ${roomId}: nova rodada iniciada`);
    }
  });

  socket.on("updateMarker", ({ roomId, markerPosition, sliderWidth }) => {
    const room = rooms.get(roomId);
    if (
      !room ||
      socket.id !== room.guesser ||
      room.gameState.phase !== "guesserTurn"
    ) {
      console.log(`Atualização de marcador ignorada para sala ${roomId}`);
      return;
    }
    room.gameState.markerPosition = markerPosition;
    room.gameState.sliderWidth = sliderWidth;
    io.to(roomId).emit("updateGameState", room.gameState);
    console.log(
      `Sala ${roomId}: marcador atualizado para ${markerPosition}, sliderWidth: ${sliderWidth}`
    );
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    for (const [roomId, room] of rooms) {
      if (room.hinter === socket.id || room.guesser === socket.id) {
        const otherPlayer =
          room.hinter === socket.id ? room.guesser : room.hinter;
        if (!otherPlayer || !io.sockets.sockets.get(otherPlayer)) {
          setTimeout(() => {
            if (
              rooms.has(roomId) &&
              (!room.hinter || !io.sockets.sockets.get(room.hinter)) &&
              (!room.guesser || !io.sockets.sockets.get(room.guesser))
            ) {
              io.to(roomId).emit("playerDisconnected", {
                disconnected: socket.id === room.hinter ? "hinter" : "guesser",
              });
              rooms.delete(roomId);
              console.log(
                `Sala ${roomId} removida após timeout, ambos os jogadores desconectados`
              );
            }
          }, 60000);
        } else {
          console.log(
            `Sala ${roomId} mantida, outro jogador ainda conectado: ${otherPlayer}`
          );
          io.to(roomId).emit("playerDisconnected", {
            disconnected: socket.id === room.hinter ? "hinter" : "guesser",
          });
        }
      }
    }
  });

  socket.on("error", (error) => {
    console.log(`Erro no socket ${socket.id}:`, error);
  });
});

function calculateScore(markerPosition, targetPosition, sliderWidth) {
  const targetWidthPx = 154;
  const zoneWidthPx = targetWidthPx / 3;
  const targetWidthPercent = (targetWidthPx / sliderWidth) * 100;
  const zoneWidthPercent = targetWidthPercent / 3;

  const leftZoneStart = targetPosition - targetWidthPercent / 2;
  const leftZoneEnd = leftZoneStart + zoneWidthPercent;
  const centerZoneEnd = leftZoneEnd + zoneWidthPercent;

  if (markerPosition >= leftZoneStart && markerPosition < leftZoneEnd) {
    return 2;
  } else if (markerPosition >= leftZoneEnd && markerPosition < centerZoneEnd) {
    return 3;
  } else if (
    markerPosition >= centerZoneEnd &&
    markerPosition <= centerZoneEnd + zoneWidthPercent
  ) {
    return 2;
  }
  return 0;
}

function startNewRound(roomId) {
  const room = rooms.get(roomId);
  if (!room) {
    console.log(`Nova rodada ignorada: sala ${roomId} não encontrada`);
    return;
  }
  const randomIndex = Math.floor(Math.random() * cardPairs.length);
  room.gameState = {
    phase: "hintGiverView",
    targetPosition: Math.floor(Math.random() * 101),
    markerPosition: 50,
    score: room.gameState.score,
    currentCards: cardPairs[randomIndex],
    sliderWidth: room.gameState.sliderWidth,
  };
  console.log(`Sala ${roomId}: nova rodada configurada`);
}

httpServer.listen(3001, () => {
  console.log("Servidor WebSocket rodando na porta 3001");
});
