# MindSync

Bem-vindo ao MindSync, um projeto divertido e interativo construído com Next.js e Socket.IO! Este é um jogo em tempo real onde dois jogadores colaboram para alcançar a maior pontuação possível. Um jogador, o Hinter, dá dicas e define um alvo secreto em um slider, enquanto o outro, o Guesser, tenta posicionar um marcador o mais próximo possível do alvo com base nas dicas. O jogo é perfeito para amigos que querem se divertir juntos e provar que estão em Sincronia!

O projeto foi implantado na Vercel e no Render (backend WebSocket) e está pronto para ser jogado online. Experimente agora: [Jogar Online!](https://mindsync-two.vercel.app)

## 🎯 Funcionalidades

- **Multiplayer em Tempo Real:** Dois jogadores (Hinter e Guesser) interagem via WebSocket, com sincronização instantânea de ações e estados do jogo.
- **Sistema de Pontuação:** Ganhe pontos (0, 2 ou 3) com base na precisão do marcador em relação ao alvo.
- **Interface Intuitiva:** Design responsivo e moderno com Next.js e Tailwind CSS, incluindo um slider interativo.
- **Gerenciamento de Salas:** Crie ou entre em salas privadas usando códigos únicos.
- **Feedback Visual:** Alvos, marcadores e pontuações são exibidos de forma clara, com alertas para erros ou desconexões.
- **Deploy em Produção:** Hospedado na Vercel e Render, com suporte a HTTPS e WebSocket seguro (WSS).

## 🛠️ Tecnologias Utilizadas

### Frontend:

- Next.js - Framework React para interfaces dinâmicas e SSR.
- Tailwind CSS - Estilização rápida e responsiva.
- Socket.IO Client - Comunicação em tempo real com o backend.
- SweetAlert2 - Alertas visuais para feedback do usuário.

### Backend:

- Node.js - Ambiente de execução para o servidor.
- Socket.IO - Gerenciamento de conexões WebSocket para multiplayer.
- Express - Servidor HTTP leve.
- CORS - Configuração de segurança para conexões cross-origin.

## Deploy:

- Vercel - Hospedagem do frontend Next.js.
- Render - Hospedagem do backend WebSocket.

## 🚀 Como Jogar

1. Acesse o Jogo: Visite https://seu-projeto.vercel.app.
2. Crie ou Entre em uma Sala:

- Hinter: Insira seu nome e clique em "Criar Sala" para gerar um código único.
- Guesser: Insira seu nome e o código da sala para entrar.

3. Jogabilidade:

- Hinter: Veja o alvo secreto clicando em "Revelar!", dê uma dica ao Guesser para ajudá-lo a acertar o alvo e, em seguida, clique em "Esconder".
- Guesser: Use a dica recebida para mover o marcador no slider, tentando acertar o alvo, e clique em "Confirmar".
- Ambos: Veja o resultado (pontuação) e clique em "Finalizar!" para começar uma nova rodada.

4. Sair: Clique no botão "Sair" (vermelho) para voltar ao menu inicial.

## 🖥️ Instalação Local

Quer rodar o jogo localmente? Siga os passos abaixo:

#### Pré-requisitos

- Node.js (v18 ou superior)
- Git
- npm (gerenciador de pacotes)

#### Passos

1. Clone o Repositório:

```bash
git clone https://github.com/marcxsdev/mindsync
cd seu-projeto
```

2. Backend:

- Instale as dependências e rode o servidor:

```bash
npm install
node server.js
```

- O servidor WebSocket rodará em http://localhost:3001.

3. Frontend:

- Inicie o frontend:

```bash
npm run dev
```

- Acesse http://localhost:3000 no navegador.

4. Teste o Jogo:

- Abra dois navegadores.
- Crie uma sala em um e entre com o código no outro.
- Jogue algumas rodadas para confirmar que tudo funciona.

## 📈 O Que Aprendi

Este projeto foi uma oportunidade incrível para aprofundar meu conhecimento em desenvolvimento full-stack. Alguns destaques:

- **WebSockets com Socket.IO:** Implementei comunicação bidirecional para sincronizar estados entre jogadores, lidando com eventos como criação de salas, ações de jogo e desconexões.
- **Next.js e React:** Criei uma interface dinâmica e responsiva, utilizando rotas dinâmicas e hooks do React para gerenciar estados complexos.
- **Gerenciamento de Estado:** Sincronizei estados entre cliente e servidor, garantindo uma experiência fluida para ambos os jogadores.
- **Resolução de Bugs:** Trabalhei na correção de problemas como sincronização do alvo, desconexões e pontuação, garantindo robustez.

## 🌟 Por Que Este Projeto?

Desenvolvi este jogo para demonstrar minhas habilidades em desenvolvimento web full-stack, com foco em aplicações interativas e em tempo real. Ele reflete minha capacidade de:

- Construir interfaces modernas e responsivas.
- Gerenciar comunicação cliente-servidor em tempo real.
- Implementar lógica de jogo complexa e divertida.
- Implantar projetos em produção de forma confiável.

## 🔗 Links Úteis

- **Jogo Online:** https://mindsync-two.vercel.app
- **Repositório GitHub:** https://github.com/marcxsdev/mindsync
- **LinkedIn:** www.linkedin.com/in/marcos-alexandre-dev (sinta-se à vontade para me contatar!)

## 🤝 Contribuições

Quer contribuir? Fique à vontade para abrir issues ou pull requests no GitHub! Sugestões de novas funcionalidades, melhorias de design ou otimizações são sempre bem-vindas.

## 📜 Licença

Este projeto é licenciado sob a MIT License.

---

**Desenvolvido com 💻 e ☕ por [Marcxs](https://github.com/marcxsdev)**
