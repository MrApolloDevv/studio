# Xadrez

## Visão Geral

Xadrez é uma plataforma de xadrez online moderna e responsiva, projetada para oferecer partidas desafiadoras contra a engine de IA Stockfish. A aplicação web é construída com as tecnologias mais recentes para garantir uma experiência de jogo fluida, interativa e visualmente agradável em qualquer dispositivo.

Este projeto serve como um exemplo prático de como integrar um motor de xadrez de alta performance em uma interface web moderna, utilizando ferramentas de ponta para desenvolvimento front-end, back-end e integração de IA.

## Funcionalidades Principais

- **Interface de Jogo Interativa**: Tabuleiro de xadrez totalmente interativo com suporte a arrastar e soltar (drag-and-drop) e clique para mover.
- **Integração com IA**: Jogue contra a Stockfish, uma das engines de xadrez mais fortes do mundo, que calcula a melhor jogada em tempo real.
- **Validação de Movimentos**: Lógica completa para validação de movimentos, incluindo movimentos especiais como roque.
- **Responsividade Total**: Experiência de usuário consistente e funcional em desktops, tablets e smartphones.
- **Histórico de Movimentos**: Visualização do histórico de jogadas em notação algébrica padrão.
- **Feedback Visual**: Destaques visuais para a última jogada, movimentos válidos e feedback de xeque.

## Tech Stack

Este projeto foi construído utilizando um conjunto de tecnologias modernas para garantir performance, escalabilidade e uma ótima experiência de desenvolvimento:

- **Front-End**:
  - **Next.js**: Framework React para renderização no lado do servidor (SSR) e geração de sites estáticos (SSG).
  - **React**: Biblioteca para construção de interfaces de usuário.
  - **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
  - **Tailwind CSS**: Framework CSS utility-first para estilização rápida e customizável.
  - **Shadcn/ui**: Coleção de componentes de UI reutilizáveis e acessíveis.
  - **Lucide React**: Biblioteca de ícones SVG.

- **Back-End & IA**:
  - **Genkit (Firebase AI)**: Orquestração de fluxos de IA para sugestão de jogadas.
  - **Firebase Hosting**: Hospedagem para a aplicação Next.js.
  - **Cloud Functions for Firebase**: Ambiente serverless para executar a lógica da Stockfish.

- **Ferramentas de Desenvolvimento**:
  - **pnpm**: Gerenciador de pacotes rápido e eficiente.
  - **ESLint**: Ferramenta de linting para manter a qualidade do código.

## Arquitetura do Projeto

A estrutura de arquivos foi organizada para manter uma separação clara de responsabilidades, facilitando a manutenção e a escalabilidade.

```
/
├── public/                  # Arquivos estáticos (imagens das peças, sons)
├── src/
│   ├── app/                 # Rotas da aplicação (App Router do Next.js)
│   │   ├── game/            # Rota e lógica da página de jogo
│   │   └── page.tsx         # Página inicial (landing page)
│   │
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── game/            # Componentes específicos do jogo (Tabuleiro, Histórico)
│   │   ├── icons/           # Componentes de ícones das peças
│   │   └── ui/              # Componentes base do Shadcn/ui
│   │
│   ├── ai/                  # Lógica relacionada à Inteligência Artificial com Genkit
│   │   ├── flows/           # Fluxos de IA (ex: suggest-move.ts)
│   │   └── genkit.ts        # Configuração do Genkit
│   │
│   ├── lib/                 # Funções utilitárias e lógica de negócio
│   │   ├── chess-logic.ts   # Núcleo da lógica do xadrez (movimentos, validação, FEN)
│   │   └── utils.ts         # Funções utilitárias gerais (ex: cn)
│   │
│   └── hooks/               # Hooks React customizados (ex: use-toast)
│
├── next.config.ts           # Configurações do Next.js
├── tailwind.config.ts       # Configurações do Tailwind CSS
└── package.json             # Dependências e scripts do projeto
```

### Detalhes da Lógica

- **`src/lib/chess-logic.ts`**: Este é o coração da lógica do xadrez. Ele é responsável por:
  - Representar o tabuleiro e as peças.
  - Validar todos os tipos de movimentos, incluindo capturas, promoções (não implementado na UI) e o roque.
  - Verificar condições de jogo como xeque, xeque-mate e empate por afogamento.
  - Converter o estado do tabuleiro para o formato FEN (Forsyth-Edwards Notation), que é enviado para a engine Stockfish.

- **`src/components/game/GameClient.tsx`**: Orquestra todo o estado do jogo no lado do cliente.
  - Gerencia o estado do tabuleiro, o turno do jogador e o histórico de jogadas.
  - Manipula as interações do usuário com o tabuleiro.
  - Comunica-se com o backend para obter a jogada da IA.

- **`/api/bestmove` (via `next.config.ts` rewrites)**: Um endpoint de API que atua como proxy para a Cloud Function onde a Stockfish está sendo executada. Ele recebe o estado do tabuleiro em FEN e retorna a melhor jogada calculada pela IA.

## Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento.

### Pré-requisitos

- **Node.js** (versão 20 ou superior)
- **pnpm** (pode ser instalado com `npm install -g pnpm`)
- **Firebase Account** (para integração com Genkit e deploy)

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/MrApolloDevv/Xadrez.git
   cd Xadrez
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na raiz do projeto.
   - Adicione as chaves de API necessárias para a integração com o Firebase e Genkit.
     ```
     GEMINI_API_KEY=SUA_CHAVE_DE_API_DO_GEMINI
     ```

### Executando o Servidor de Desenvolvimento

Para iniciar a aplicação Next.js e o servidor Genkit simultaneamente, você pode usar dois terminais:

1. **Terminal 1: Inicie o Genkit (em modo de observação):**
   ```bash
   pnpm genkit:watch
   ```
   Isso iniciará o servidor de desenvolvimento do Genkit, que recarregará automaticamente em caso de alterações nos fluxos de IA.

2. **Terminal 2: Inicie a aplicação Next.js:**
   ```bash
   pnpm dev
   ```

Após esses passos, a aplicação estará disponível em `http://localhost:9002`.

## Considerações Finais para o Analista

- **Performance**: A escolha do Next.js com SSR garante um carregamento inicial rápido. A lógica do xadrez no cliente permite interações instantâneas, enquanto a chamada para a IA é assíncrona, não bloqueando a UI.
- **Manutenibilidade**: A estrutura modular, o uso de TypeScript e a separação clara de responsabilidades facilitam a adição de novas funcionalidades e a correção de bugs.
- **Escalabilidade**: A arquitetura serverless com Firebase (Cloud Functions e Hosting) permite que a aplicação escale automaticamente para lidar com um grande número de usuários sem a necessidade de gerenciar infraestrutura.
