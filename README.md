# Xadrez - Análise do Projeto

## 1. Visão Geral

O **Xadrez** é uma aplicação web moderna que permite aos usuários jogar partidas de xadrez contra uma inteligência artificial avançada, o Stockfish. O projeto foi desenvolvido com foco em performance, responsividade e uma experiência de usuário fluida e agradável, utilizando tecnologias de ponta.

A aplicação consiste em uma página inicial (landing page) que apresenta o projeto e uma página de jogo onde a partida acontece.

## 2. Funcionalidades Principais

- **Partidas contra IA**: Jogue xadrez contra o motor Stockfish, um dos mais fortes do mundo.
- **Interface Intuitiva**: Tabuleiro interativo com suporte a "arrastar e soltar" (drag-and-drop) e "clicar para mover".
- **Validação de Movimentos**: Regras do xadrez, incluindo movimentos especiais como o roque, são validadas em tempo real.
- **Feedback Visual**: Movimentos válidos, último movimento realizado e situações de xeque são destacados visualmente.
- **Histórico de Jogadas**: Uma lista com todas as jogadas da partida é exibida em notação algébrica.
- **Detecção de Fim de Jogo**: O sistema identifica automaticamente condições de xeque-mate e empate por afogamento (stalemate).
- **Design Responsivo**: A experiência é otimizada para desktops, tablets e dispositivos móveis.
- **Efeitos Sonoros**: Sons para movimentação de peças e xeque, melhorando a imersão.

## 3. Arquitetura e Tecnologias (Tech Stack)

A aplicação utiliza uma arquitetura moderna baseada em componentes, com uma clara separação entre a lógica da interface (frontend) e as regras do jogo (backend/lógica).

### Frontend

- **Framework**: **Next.js 15 (App Router)** - Utilizado para renderização no servidor (SSR) e geração de páginas estáticas (SSG), garantindo ótima performance e SEO.
- **Linguagem**: **TypeScript** - Adiciona tipagem estática ao JavaScript, aumentando a robustez e a manutenibilidade do código.
- **UI Framework**: **React 18** - Base para a construção da interface de usuário em componentes.
- **Estilização**:
  - **Tailwind CSS**: Framework CSS utility-first para criar designs customizados rapidamente.
  - **ShadCN/UI**: Coleção de componentes de UI reusáveis e acessíveis, construídos sobre o Radix UI e Tailwind CSS.
- **Ícones**: **Lucide React** - Biblioteca de ícones SVG leve e customizável.

### Backend e Lógica

- **Motor de Xadrez (IA)**: A lógica do oponente é fornecida pelo **Stockfish**, acessado através de uma API externa.
  - A requisição para a jogada da IA é feita para o endpoint `/api/bestmove`, que é um rewrite (proxy) para uma Cloud Function.
- **Lógica do Jogo**: O arquivo `src/lib/chess-logic.ts` contém toda a lógica para:
  - Inicialização do tabuleiro.
  - Validação de movimentos (incluindo xeque, roque, etc.).
  - Conversão de coordenadas para notação algébrica.
  - Geração do estado do tabuleiro no formato FEN (Forsyth-Edwards Notation).
  - Verificação de fim de jogo (xeque-mate e empate).
- **IA (Alternativa/Futura)**: O projeto inclui a estrutura do **Genkit (Google AI)** em `src/ai/`, permitindo a futura integração de modelos de IA generativa, como o Gemini, para sugerir jogadas ou analisar partidas.

### Infraestrutura

- **Hospedagem**: O projeto está configurado para ser hospedado no **Firebase App Hosting**.
- **Backend Service**: A IA Stockfish é executada como um serviço separado (Google Cloud Function), garantindo que o processamento pesado não afete a performance do frontend.

## 4. Estrutura de Arquivos

A estrutura do projeto é organizada para facilitar a manutenção e escalabilidade.

```
/
├── public/                  # Arquivos estáticos (imagens das peças, sons)
│   ├── pieces/              # Imagens SVG das peças de xadrez
│   └── sounds/              # Efeitos sonoros
├── src/
│   ├── ai/                  # Lógica relacionada à IA com Genkit
│   │   └── flows/           # Fluxos de IA (ex: suggest-move.ts)
│   ├── app/                 # Rotas da aplicação (App Router)
│   │   ├── game/            # Rota da página do jogo
│   │   │   └── page.tsx
│   │   ├── globals.css      # Estilos globais e variáveis de tema (Tailwind)
│   │   ├── layout.tsx       # Layout principal da aplicação
│   │   └── page.tsx         # Página inicial (landing page)
│   ├── components/          # Componentes React
│   │   ├── game/            # Componentes específicos do jogo (Tabuleiro, Histórico, etc.)
│   │   └── ui/              # Componentes de UI genéricos (ShadCN)
│   ├── hooks/               # Hooks customizados (ex: use-toast.ts)
│   └── lib/                 # Lógica principal e utilitários
│       ├── chess-logic.ts   # Regras do xadrez, validação de movimentos
│       └── utils.ts         # Funções utilitárias (ex: cn para classes)
├── next.config.ts           # Configurações do Next.js (rewrites, domínios de imagem)
├── package.json             # Dependências e scripts do projeto
└── README.md                # Este arquivo
```

## 5. Como Executar o Projeto Localmente

Para executar o projeto em um ambiente de desenvolvimento, siga os passos abaixo.

### Pré-requisitos

- Node.js (versão 20 ou superior)
- npm (ou um gerenciador de pacotes similar como yarn ou pnpm)

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
    Abra seu navegador e acesse [http://localhost:9002](http://localhost:9002).

## 6. Fluxo de Jogo e Lógica de IA

1.  **Turno do Jogador (Brancas)**:
    - O jogador clica em uma de suas peças.
    - O componente `GameClient.tsx` chama a função `getValidMoves` de `chess-logic.ts` para calcular e exibir os movimentos possíveis.
    - O jogador clica em uma casa válida ou arrasta a peça.
    - `GameClient.tsx` valida o movimento com `isMoveValid`.
    - Se válido, o estado do tabuleiro (`board`) é atualizado, a jogada é adicionada ao histórico e o turno passa para a IA (Pretas).

2.  **Turno da IA (Pretas)**:
    - Um `useEffect` em `GameClient.tsx` detecta a mudança de turno para `'b'`.
    - A função `boardToFEN` gera a string FEN que representa o estado atual do tabuleiro.
    - Uma requisição `POST` é enviada para o endpoint `/api/bestmove` (que redireciona para a Cloud Function) com o FEN no corpo da requisição.
    - A API do Stockfish processa o FEN e retorna a melhor jogada em notação algébrica (ex: "e7e5").
    - O `GameClient.tsx` recebe a jogada, converte a notação para coordenadas (`algebraicToCoords`), valida o movimento e atualiza o estado do tabuleiro.
    - O turno é devolvido ao jogador.

3.  **Fim de Jogo**:
    - Após cada jogada, as funções `isCheckmate` e `isStalemate` são chamadas para verificar se a partida terminou.
    - Se uma condição de fim de jogo for atingida, um diálogo é exibido com o resultado.
