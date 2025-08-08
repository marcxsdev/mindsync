"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { io } from "socket.io-client";
import Slider from "../../../components/game/Slider";
import Button from "../../../components/ui/Button";
import Swal from "sweetalert2";

export default function Room() {
  console.log("Componente Room montado:", {
    roomId: useParams().roomId,
    username: useSearchParams().get("username"),
    action: useSearchParams().get("action"),
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const username = searchParams.get("username");
  const action = searchParams.get("action");
  const roomIdFromUrl = params.roomId;

  const socketRef = useRef(null);
  const [role, setRole] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(roomIdFromUrl);
  const [gameState, setGameState] = useState({
    phase: "waiting",
    targetPosition: null,
    markerPosition: 50,
    score: 0,
    currentCards: null,
    sliderWidth: 1000,
  });
  const [showTarget, setShowTarget] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(1000);

  useEffect(() => {
    console.log("useEffect executado:", { username, action, roomIdFromUrl });
    if (!username || !action) {
      console.log("Faltando username ou action, redirecionando para /");
      router.push("/");
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001", {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      console.log("Socket criado:", socketRef.current.id || "ID não definido");
    }

    const socketInstance = socketRef.current;

    socketInstance.on("connect", () => {
      console.log("Conectado ao WebSocket:", socketInstance.id);
      console.log("Estado do socket:", socketInstance.connected);
      if (action === "create" && roomIdFromUrl === "new") {
        console.log("Emitindo createRoom para username:", username);
        socketInstance.emit("createRoom", { username });
      } else if (
        action === "join" &&
        roomIdFromUrl &&
        roomIdFromUrl !== "new"
      ) {
        console.log(
          "Emitindo joinRoom para roomId:",
          roomIdFromUrl,
          "username:",
          username
        );
        socketInstance.emit("joinRoom", { roomId: roomIdFromUrl, username });
      } else if (
        action === "create" &&
        roomIdFromUrl &&
        roomIdFromUrl !== "new"
      ) {
        console.log(
          "Sala já criada, roomId:",
          roomIdFromUrl,
          "username:",
          username
        );
        setRole("hinter");
      } else {
        console.log("Condições inválidas, redirecionando para /");
        router.push("/");
      }
    });

    socketInstance.on("reconnect", (attempt) => {
      console.log(`Reconectado ao WebSocket após ${attempt} tentativas`);
    });

    socketInstance.on("reconnect_error", (error) => {
      console.log("Erro de reconexão:", error);
      Swal.fire({
        title: "Erro",
        text: "Falha ao reconectar ao servidor. Tente novamente.",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/");
      });
    });

    socketInstance.on("roomCreated", ({ roomId, username, role }) => {
      console.log(
        `Evento roomCreated recebido: roomId=${roomId}, username=${username}, role=${role}`
      );
      setRole(role);
      setCurrentRoomId(roomId);
    });

    socketInstance.on("roomJoined", ({ roomId, username, role }) => {
      console.log(
        `Evento roomJoined recebido: roomId=${roomId}, username=${username}, role=${role}`
      );
      setRole(role);
      setCurrentRoomId(roomId);
    });

    socketInstance.on("error", (message) => {
      console.log("Erro recebido do servidor:", message);
      Swal.fire({
        title: "Erro",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/");
      });
    });

    socketInstance.on("gameStart", ({ gameState }) => {
      console.log("Evento gameStart recebido:", gameState);
      setGameState(gameState);
      setShowTarget(false);
    });

    socketInstance.on("updateGameState", (newGameState) => {
      console.log("Evento updateGameState recebido:", newGameState);
      setGameState(newGameState);
      if (newGameState.phase === "hintGiverView") {
        setShowTarget(false);
      }
    });

    socketInstance.on("showTarget", (show) => {
      console.log("Evento showTarget recebido:", show);
      setShowTarget(show);
    });

    socketInstance.on("playerDisconnected", ({ disconnected }) => {
      console.log("Evento playerDisconnected recebido:", { disconnected });
      Swal.fire({
        title: "Jogador desconectado",
        text: `O ${
          disconnected === "hinter" ? "Hinter" : "Guesser"
        } saiu da sala. Você será redirecionado.`,
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/");
      });
    });

    socketInstance.on("connect_error", (error) => {
      console.log("Erro de conexão com o WebSocket:", error);
      Swal.fire({
        title: "Erro",
        text: "Falha na conexão com o servidor. Verifique se o servidor está rodando.",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/");
      });
    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("reconnect");
      socketInstance.off("reconnect_error");
      socketInstance.off("connect_error");
      socketInstance.off("roomCreated");
      socketInstance.off("roomJoined");
      socketInstance.off("error");
      socketInstance.off("gameStart");
      socketInstance.off("updateGameState");
      socketInstance.off("showTarget");
      socketInstance.off("playerDisconnected");
      console.log("Cleanup de listeners executado");
    };
  }, [username, action, roomIdFromUrl, router]);

  const handleButtonClick = () => {
    if (!socketRef.current || !role) return;
    console.log("Botão clicado, ação:", gameState.phase, "role:", role);
    if (gameState.phase === "hintGiverView" && role === "hinter") {
      socketRef.current.emit("gameAction", {
        roomId: currentRoomId,
        action: "reveal",
      });
    } else if (gameState.phase === "hintGiverHide" && role === "hinter") {
      socketRef.current.emit("gameAction", {
        roomId: currentRoomId,
        action: "hide",
      });
    } else if (gameState.phase === "guesserTurn" && role === "guesser") {
      socketRef.current.emit("gameAction", {
        roomId: currentRoomId,
        action: "confirm",
      });
    } else if (gameState.phase === "revealResult") {
      socketRef.current.emit("gameAction", {
        roomId: currentRoomId,
        action: "finalize",
      });
    }
  };

  const handleMarkerChange = (e) => {
    if (role === "guesser" && gameState.phase === "guesserTurn") {
      const newPosition = parseInt(e.target.value);
      console.log("Atualizando marcador:", newPosition);
      setGameState((prev) => ({ ...prev, markerPosition: newPosition }));
      socketRef.current.emit("updateMarker", {
        roomId: currentRoomId,
        markerPosition: newPosition,
        sliderWidth,
      });
    }
  };

  const handleExit = () => {
    if (socketRef.current) {
      console.log("Desconectando socket e redirecionando para /");
      socketRef.current.disconnect();
    }
    router.push("/");
  };

  const getButtonText = () => {
    switch (gameState.phase) {
      case "waiting":
        return role === "hinter" ? "Aguardando jogador..." : "Conectando...";
      case "hintGiverView":
        return role === "hinter" ? "Revelar!" : "Aguardando Hinter...";
      case "hintGiverHide":
        return role === "hinter" ? "Esconder" : "Aguardando Hinter...";
      case "guesserTurn":
        return role === "guesser" ? "Confirmar" : "Aguardando Guesser...";
      case "revealResult":
        return "Finalizar!";
      default:
        return "Aguardando...";
    }
  };

  const isButtonDisabled = () => {
    if (gameState.phase === "waiting") return true;
    if (
      role === "hinter" &&
      gameState.phase !== "hintGiverView" &&
      gameState.phase !== "hintGiverHide"
    )
      return true;
    if (role === "guesser" && gameState.phase !== "guesserTurn") return true;
    return false;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-8">
      <div className="w-full max-w-4xl rounded-2xl bg-slate-800 p-8 shadow-2xl border border-blue-900 flex flex-col">
        <div className="flex justify-between mb-5">
          <div className="w-[121px]"></div>
          <div className="bg-[#0f3460] w-40 rounded-xl py-4 px-5 text-center border border-blue-900">
            <p className="m-0 text-4xl font-bold">{gameState.score}</p>
          </div>
          <Button
            onClick={handleExit}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sair
          </Button>
        </div>
        <Slider
          value={gameState.markerPosition}
          onChange={handleMarkerChange}
          showTarget={showTarget}
          targetPosition={gameState.targetPosition}
          disabled={role !== "guesser" || gameState.phase !== "guesserTurn"}
          onWidthChange={setSliderWidth}
        />
        <div className="pt-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold uppercase text-center shrink-0 w-48">
            {gameState.currentCards
              ? gameState.currentCards.left
              : "Carregando..."}
          </h1>
          <Button onClick={handleButtonClick} disabled={isButtonDisabled()}>
            {getButtonText()}
          </Button>
          <h1 className="text-2xl font-semibold uppercase text-center shrink-0 w-48">
            {gameState.currentCards
              ? gameState.currentCards.right
              : "Carregando..."}
          </h1>
        </div>
        {role === "hinter" && currentRoomId && currentRoomId !== "new" && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">Sala de {username}</p>
            <p className="text-xl font-bold">Código: {currentRoomId}</p>
          </div>
        )}
      </div>
    </div>
  );
}
