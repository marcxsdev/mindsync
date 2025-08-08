"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Button from "../components/ui/Button";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLocal = () => {
    router.push("/local");
  };

  const handleCreateRoom = async () => {
    const { value: username } = await Swal.fire({
      title: "Criar Sala",
      input: "text",
      inputLabel: "Digite seu nome",
      inputPlaceholder: "Seu nome",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Você precisa digitar um nome!";
      },
    });

    if (username) {
      setIsLoading(true);
      router.push(
        `/room/new?username=${encodeURIComponent(username)}&action=create`
      );
    }
  };

  const handleJoinRoom = async () => {
    const { value } = await Swal.fire({
      title: "Entrar em Sala",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Seu nome">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Código da sala">',
      focusConfirm: false,
      preConfirm: () => {
        const username = document.getElementById("swal-input1").value;
        const roomId = document.getElementById("swal-input2").value;
        if (!username || !roomId) {
          Swal.showValidationMessage("Nome e código da sala são obrigatórios!");
          return false;
        }
        return { username, roomId };
      },
      showCancelButton: true,
    });

    if (value) {
      setIsLoading(true);
      router.push(
        `/room/${encodeURIComponent(
          value.roomId
        )}?username=${encodeURIComponent(value.username)}&action=join`
      );
    }
  };

  const handleHowToPlay = () => {
    Swal.fire({
      title: "Como Jogar",
      html: `
        <p><strong>Modo Local:</strong></p>
        <p>1. O Hinter clica em "Revelar!" para ver o alvo.</p>
        <p>2. O Hinter clica em "Esconder" e dá uma dica ao Guesser.</p>
        <p>3. O Guesser move o marcador com base na dica e clica em "Confirmar".</p>
        <p>4. O alvo é revelado, a pontuação é atualizada, e uma nova rodada começa com "Finalizar!".</p>
        <p><strong>Modo Multiplayer:</strong></p>
        <p>1. O Hinter cria uma sala e compartilha o código com o Guesser.</p>
        <p>2. O Guesser entra na sala com o código.</p>
        <p>3. O Hinter vê o alvo com "Revelar!" (invisível para o Guesser), esconde com "Esconder", e dá a dica.</p>
        <p>4. O Guesser move o marcador e clica em "Confirmar".</p>
        <p>5. O alvo é revelado para ambos, a pontuação é atualizada, e a rodada reinicia com "Finalizar!".</p>
      `,
      confirmButtonText: "Entendido!",
    });
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-slate-900 text-white p-8">
      <div className="flex flex-col items-center">
        <Image
          src="/images/ms-logo.png"
          alt="Logo MindSync"
          className="py-8"
          width={780}
          height={496}
        />
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button onClick={handleLocal} disabled={isLoading}>
            Local
          </Button>
          <Button onClick={handleCreateRoom} disabled={isLoading}>
            Criar Sala
          </Button>
          <Button onClick={handleJoinRoom} disabled={isLoading}>
            Entrar em Sala
          </Button>
          <Button onClick={handleHowToPlay} disabled={isLoading}>
            Como Jogar
          </Button>
        </div>
      </div>

      <p className="text-lg text-gray-400 text-center mt-8">
        Desenvolvido por{" "}
        <a href="https://github.com/marcxsdev" target="_blank">
          <span className="inline-block font-bold transition-transform duration-200 hover:scale-110">
            Marcos
          </span>
        </a>
      </p>
    </div>
  );
}
