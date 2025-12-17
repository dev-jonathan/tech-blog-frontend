# Tech Blog (Frontend)

Frontend React/TypeScript para o blog integrado ao backend NestJS.

## Demo

[![Watch Demo](https://img.youtube.com/vi/7RCv6NP4y4g/0.jpg)](https://youtu.be/7RCv6NP4y4g)

Clique na miniatura para assistir

## Stack

- React + TypeScript: produtividade, tipagem e ecossistema maduro.
- Vite: dev server rápido e build eficiente.
- Tailwind + shadcn/ui: UI veloz com design consistente.
- Zod: validação declarativa e segura no cliente.
- Prettier/EditorConfig: padronização de código entre IDEs.

## Pré-requisitos

- Node 20+
- pnpm 9+
- Backend rodando em `http://localhost:3000` (ou ajustar `.env`)

## Configuração

Crie `.env` (ou `.env.local`) na raiz:

```bash
VITE_API_URL=http://localhost:3000
```

Instale e rode:

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm build
pnpm preview
```

## Estrutura principal

- `src/api/client.ts` – cliente fetch com base URL do `.env`.
- `src/types/api.ts` – tipos de User/Article/Category/Comment e payloads.
- `src/lib/auth.ts` – persistência simples de sessão no `localStorage`.
- `src/pages` – telas (Landing, Login, Register, Articles, Article, Create/Edit).
- `src/components` – UI reutilizável (cards, forms, comments, header).

## Fluxos e rotas

- `/` Landing.
- `/login` Login (POST `/users/login`). Armazena `userId`, `name`, `email`.
- `/register` Criação de conta (POST `/users`).
- `/articles` Lista artigos (GET `/articles?page=1&limit=50`) com busca e filtro por categoria (GET `/categories`).
- `/articles/:slug` Detalhe com banner, autor, categoria e comentários.
  - Comentar (POST `/comments`).
  - Responder (POST `/comments` com `parentId`).
  - Excluir comentário (DELETE `/comments/:id?userId=...`) visível apenas para o autor.
- `/articles/create` Criar artigo (POST `/articles`) exige login.
- `/articles/:slug/edit` Editar artigo (PATCH `/articles/:id`) exige login e envia `userId` no body.

## Dados obrigatórios por ação

- Criar artigo: `title`, `content`, `categoryId`, `authorId`, opcional `banner`.
- Editar artigo: mesmos campos opcionais + `userId` no body.
- Comentar: `content`, `articleId`, `authorId`.
- Responder: `content`, `articleId`, `authorId`, `parentId`.
- Deletar comentário: query `userId` obrigatório.

## Como testar/compilar

1. Subir backend (`pnpm start:dev` no projeto Nest do backend).
2. `pnpm dev` no frontend.
3. Criar usuário em `/register`, logar e criar artigo em `/articles/create`.
4. Abrir artigo, comentar, responder e excluir (somente seus comentários).
5. Validar filtro por categoria e busca na listagem.
