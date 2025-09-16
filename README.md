# Xadrez - Análise do Projeto

## 1. Visão Geral

O **Xadrez** é uma aplicação web moderna que permite aos usuários jogar partidas de xadrez contra uma inteligência artificial avançada. O projeto foi desenvolvido com foco em performance, responsividade e uma experiência de usuário fluida e agradável, utilizando uma arquitetura de ponta.

A aplicação consiste em uma página inicial que serve como uma apresentação do projeto e uma página principal de jogo, onde a partida acontece.

## 2. Funcionalidades Principais

* **Partidas contra a IA**: Jogue contra o motor **Stockfish**, um dos mais fortes do mundo.
* **Interface Intuitiva**: Um tabuleiro interativo com suporte a `arrastar e soltar` (drag-and-drop) e `clicar para mover` (click-to-move).
* **Lógica de Jogo Completa**: O sistema valida todas as regras do xadrez, incluindo movimentos especiais como roque e _en passant_.
* **Feedback Visual e Sonoro**: Movimentos válidos, a última jogada e situações de xeque são destacados visualmente e com efeitos sonoros, melhorando a imersão.
* **Histórico de Jogadas**: Uma lista com todas as jogadas da partida é exibida em notação algébrica.
* **Detecção de Fim de Jogo**: O sistema identifica automaticamente condições de xeque-mate e empate.
* **Design Responsivo**: A experiência de jogo é otimizada para desktops, tablets e dispositivos móveis.

---

## 3. Arquitetura e Tecnologias (Tech Stack)

A aplicação utiliza uma arquitetura moderna baseada em componentes, com uma clara separação entre a lógica de interface (frontend) e as regras do jogo (backend).

### Frontend

* **Framework**: **Next.js 15 (App Router)** - Utilizado para roteamento, renderização no servidor (SSR) e otimização de performance.
* **Linguagem**: **TypeScript** - Adiciona tipagem estática, garantindo a robustez e a manutenibilidade do código.
* **UI**: **React 18** e **ShadCN/UI** - Para a construção da interface de usuário com componentes reutilizáveis, acessíveis e elegantes.
* **Estilização**: **Tailwind CSS** - Framework CSS utilitário que permite a criação de designs customizados de forma ágil.
* **Ícones**: **Lucide React** - Uma biblioteca de ícones SVG moderna e leve.

### Backend e Lógica

* **Motor de Xadrez (IA)**: A IA do oponente é fornecida pelo **Stockfish**, um motor de xadrez de código aberto.
* **Lógica do Jogo**: O arquivo `src/lib/chess-logic.ts` é o "cérebro" do projeto, contendo todas as regras do xadrez, validação de movimentos e a geração do estado do tabuleiro no formato **FEN**.
* **IA (Alternativa/Futura)**: O projeto inclui a estrutura do **Genkit (Google AI)** em `src/ai/` para permitir a futura integração de modelos de IA generativa, como o Gemini, para sugestões de jogadas ou análises avançadas.

### Infraestrutura

O projeto é hospedado no **Firebase App Hosting**, que se integra perfeitamente com a Google Cloud Platform para o backend.

* **Google Cloud Function**: O motor Stockfish é executado como uma **Cloud Function**. Isso garante que o processamento pesado da IA não afete a performance do frontend. Cada requisição de um movimento da IA aciona uma função na nuvem, que roda o Stockfish, calcula a jogada e retorna o resultado. Essa abordagem _serverless_ é ideal para performance e escalabilidade, já que a função só é executada quando necessário.

---

## 4. Estrutura de Arquivos

A estrutura do projeto é organizada para facilitar a manutenção e escalabilidade.

```

/
├── public/                \# Arquivos estáticos (imagens das peças, sons)
│   ├── pieces/            \# Imagens SVG das peças de xadrez
│   └── sounds/            \# Efeitos sonoros
├── src/
│   ├── ai/                \# Lógica relacionada à IA com Genkit
│   │   └── flows/         \# Fluxos de IA (ex: suggest-move.ts)
│   ├── app/               \# Rotas da aplicação (App Router)
│   │   ├── game/          \# Rota da página do jogo
│   │   │   └── page.tsx
│   │   ├── globals.css    \# Estilos globais e variáveis de tema (Tailwind)
│   │   ├── layout.tsx     \# Layout principal da aplicação
│   │   └── page.tsx       \# Página inicial (landing page)
│   ├── components/        \# Componentes React
│   │   ├── game/          \# Componentes específicos do jogo (Tabuleiro, Histórico, etc.)
│   │   └── ui/            \# Componentes de UI genéricos (ShadCN)
│   ├── hooks/             \# Hooks customizados (ex: use-toast.ts)
│   └── lib/               \# Lógica principal e utilitários
│       ├── chess-logic.ts   \# Regras do xadrez, validação de movimentos
│       └── utils.ts       \# Funções utilitárias (ex: cn para classes)
├── next.config.ts         \# Configurações do Next.js
├── package.json           \# Dependências e scripts do projeto
└── README.md              \# Este arquivo

````

---

## 5. Como Executar o Projeto Localmente

Para executar o projeto em um ambiente de desenvolvimento, siga os passos abaixo.

### Pré-requisitos

* Node.js (versão 20 ou superior)
* npm (ou um gerenciador de pacotes similar)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_DIRETORIO>
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

### Execução

1.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

2.  **Acesse a aplicação:**
    Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000).

---

## 6. Fluxo de Jogo e Lógica de IA

* **Turno do Jogador (Brancas)**: O jogador clica em uma de suas peças. O componente `GameClient.tsx` chama a função `getValidMoves` para exibir as jogadas possíveis. Após um movimento válido, o estado do tabuleiro é atualizado e o turno é passado para a IA.
* **Turno da IA (Pretas)**: Um `useEffect` em `GameClient.tsx` detecta a mudança de turno e envia uma requisição **FEN** para a API de backend. O motor **Stockfish** processa o FEN e retorna o melhor movimento. O `GameClient.tsx` atualiza o tabuleiro e devolve o turno ao jogador.
* **Fim de Jogo**: Após cada jogada, a lógica do jogo verifica se a partida terminou devido a xeque-mate ou empate.
````
