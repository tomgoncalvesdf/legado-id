# 🕯️ LEGADO ID — Memorial Digital Premium

> "O lugar onde quem você amou nunca some de verdade."

## 🚀 Como rodar localmente

### 1. Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no [Supabase](https://supabase.com) (gratuita)

### 2. Instalar dependências
```bash
cd legadoid
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.local.example .env.local
# Edite .env.local com suas credenciais
```

### 4. Configurar banco de dados
1. Acesse seu projeto no Supabase
2. Vá em **SQL Editor**
3. Execute o arquivo `supabase-schema.sql` completo

### 5. Rodar em desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3000

---

## 📁 Estrutura do projeto

```
legadoid/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Páginas de autenticação
│   ├── (public)/           # Memorial público
│   ├── painel/             # Dashboard admin
│   ├── criar/              # Onboarding de criação
│   ├── api/                # API Routes
│   ├── layout.tsx          # Layout raiz
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Componentes base (shadcn)
│   ├── memorial/           # Componentes do memorial
│   ├── dashboard/          # Componentes do painel
│   └── layout/             # Navbar, Footer, Sidebar
├── lib/
│   ├── supabase/           # Cliente Supabase
│   └── utils.ts            # Utilitários
├── types/                  # TypeScript types
├── hooks/                  # Custom hooks
├── middleware.ts            # Proteção de rotas
├── supabase-schema.sql     # Schema do banco
└── .env.local.example      # Variáveis de ambiente
```

## 🧰 Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Pagamentos | Mercado Pago |
| Email | Resend |
| IA | OpenAI (GPT-4o) |
| Deploy | Vercel |

## 🌐 Deploy na Vercel

```bash
npm i -g vercel
vercel
```

Configure as variáveis de ambiente no dashboard da Vercel.

---

*Desenvolvido com 💛 para o Brasil*
