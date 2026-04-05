# LEGADO ID — Guia de Deploy em Produção

> Siga esta sequência antes de publicar. Cada etapa é obrigatória.

---

## 1. Supabase — Configuração de Produção

### 1.1 Banco de Dados

Execute as migrations na ordem no **SQL Editor** do painel Supabase:

```
supabase/migrations/
  001_initial_schema.sql      → Tabelas principais
  002_rls_policies.sql        → Row Level Security
  003_storage_policies.sql    → Políticas do Storage
  004_functions.sql           → Triggers e funções
```

### 1.2 Row Level Security (RLS)

Verificar que as seguintes policies estão ativas na tabela `memorials`:

- `SELECT`: público pode ler memoriais publicados (`published = true AND privacy = 'public'`)
- `SELECT`: dono pode ler seus próprios memoriais
- `INSERT/UPDATE/DELETE`: apenas o dono (`auth.uid() = user_id`)

Verificar tabela `memory_posts`:

- `SELECT`: público pode ler memórias aprovadas de memoriais públicos
- `INSERT`: qualquer pessoa autenticada pode inserir (moderação manual)
- `UPDATE/DELETE`: apenas o dono do memorial

### 1.3 Storage

Criar o bucket `memorial-photos` com as configurações:

| Campo | Valor |
|-------|-------|
| Nome | `memorial-photos` |
| Público | ✅ Sim (leitura pública das fotos) |
| Tamanho máx. | 10 MB |
| Tipos permitidos | `image/jpeg, image/png, image/webp, image/gif` |

Policy de upload (RLS no Storage):

```sql
-- Apenas donos do memorial podem fazer upload
CREATE POLICY "Owners can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'memorial-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Leitura pública
CREATE POLICY "Public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'memorial-photos');

-- Apenas donos podem deletar
CREATE POLICY "Owners can delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'memorial-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 1.4 Autenticação

No painel Supabase → Authentication → Settings:

- **Site URL**: `https://legadoid.com`
- **Redirect URLs permitidas**:
  - `https://legadoid.com/auth/callback`
  - `https://legadoid.com/painel`
- **JWT Expiry**: 3600s (padrão)
- **Email confirmação**: Ativar em produção

Se usar **Google OAuth**:
1. Google Cloud Console → APIs & Services → Credentials → OAuth 2.0
2. Authorized redirect URIs: `https://<project>.supabase.co/auth/v1/callback`
3. Copiar Client ID e Client Secret para Supabase → Authentication → Providers → Google

### 1.5 Coluna `is_admin` (se não existir)

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin) WHERE is_admin = TRUE;
```

---

## 2. Mercado Pago — Configuração de Produção

### 2.1 Credenciais

1. Painel MP → [Suas integrações](https://www.mercadopago.com.br/developers/panel/app)
2. Criar aplicação → selecionar "Pagamentos online"
3. Copiar **Access Token de Produção** e **Public Key de Produção**
4. Atualizar no Vercel: `MERCADO_PAGO_ACCESS_TOKEN` e `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY`

### 2.2 Webhook

1. Painel MP → Webhooks → Criar webhook
2. **URL**: `https://legadoid.com/api/pagamentos/webhook`
3. **Eventos**: `payment` ✅
4. Copiar a **chave secreta** gerada → `MERCADO_PAGO_WEBHOOK_SECRET`

### 2.3 Testar o Webhook

```bash
curl -X POST https://legadoid.com/api/health
# Deve retornar 200 {"status":"ok"}

# Simular notificação MP (substitua o token e payment_id)
curl -X POST https://legadoid.com/api/pagamentos/webhook \
  -H "Content-Type: application/json" \
  -d '{"action":"payment.updated","data":{"id":"TEST_PAYMENT_ID"}}'
```

---

## 3. Vercel — Deploy

### 3.1 Conectar repositório

```bash
# Instalar Vercel CLI
npm i -g vercel

# Dentro da pasta do projeto
vercel --prod
```

Ou via GitHub: Vercel Dashboard → New Project → Import do GitHub.

### 3.2 Variáveis de Ambiente no Vercel

Configurar todas as variáveis de `.env.example` no Vercel Dashboard:
**Project Settings → Environment Variables**

| Variável | Ambiente |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production + Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production + Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only ⚠️ |
| `MERCADO_PAGO_ACCESS_TOKEN` | Production only ⚠️ |
| `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY` | Production + Preview |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Production only ⚠️ |
| `NEXT_PUBLIC_BASE_URL` | Production + Preview (URLs diferentes) |
| `ADMIN_EMAILS` | Production only |

### 3.3 Domínio customizado

1. Vercel Dashboard → Project → Settings → Domains
2. Adicionar `legadoid.com` e `www.legadoid.com`
3. Configurar DNS no registrador:
   - Tipo A → `76.76.21.21` (IP Vercel)
   - Ou CNAME `www` → `cname.vercel-dns.com`
4. SSL é automático via Let's Encrypt

### 3.4 Região

O `vercel.json` já define `"regions": ["gru1"]` (São Paulo).
Verificar em: Project → Settings → Functions → Region.

---

## 4. Checklist de Go-Live

### Antes do deploy

- [ ] Todas as variáveis de ambiente configuradas no Vercel
- [ ] Migrations executadas no Supabase de produção
- [ ] RLS verificado e testado para cada tabela
- [ ] Bucket `memorial-photos` criado com policies corretas
- [ ] Supabase Auth: Site URL e Redirect URLs configurados
- [ ] Mercado Pago: credenciais de PRODUÇÃO (não sandbox)
- [ ] Webhook MP registrado com URL de produção
- [ ] `ADMIN_EMAILS` configurado (pelo menos 1 email admin)

### Após o deploy

- [ ] `GET /api/health` retorna `{"status":"ok"}`
- [ ] Criar conta de teste e verificar email de confirmação
- [ ] Criar memorial teste e verificar publicação
- [ ] Testar upload de foto
- [ ] Testar pagamento Pix em produção (valor mínimo R$0,01)
- [ ] Verificar que webhook processa e altera plano corretamente
- [ ] Acessar `/admin` com email admin e verificar métricas
- [ ] Verificar `https://legadoid.com/sitemap.xml`
- [ ] Verificar `https://legadoid.com/robots.txt`
- [ ] Testar privacy modes: público, privado, senha
- [ ] Verificar Open Graph no [opengraph.xyz](https://www.opengraph.xyz)

### Monitoramento (recomendado)

- **Uptime**: [UptimeRobot](https://uptimerobot.com) → monitorar `/api/health` a cada 5min
- **Erros**: [Sentry](https://sentry.io) → integrar com Next.js
- **Performance**: [Vercel Analytics](https://vercel.com/analytics) → ativar no Dashboard
- **Pagamentos**: Painel Mercado Pago → notificações de pagamento

---

## 5. Comandos Úteis

```bash
# Build local para verificar erros antes do deploy
npm run build

# Verificar tipos TypeScript
npx tsc --noEmit

# Executar linter
npm run lint

# Ver logs do Vercel em tempo real
vercel logs --follow

# Redeploy forçado
vercel --prod --force

# Rollback para deploy anterior
vercel rollback [deployment-url]
```

---

## 6. Estrutura de Custo Estimada

| Serviço | Plano | Custo/mês |
|---------|-------|-----------|
| Vercel | Pro (se >100GB bandwidth) | $20 |
| Supabase | Free (até 500MB) / Pro | $0–25 |
| Mercado Pago | Comissão por transação | ~4% |
| Domínio | Registro.br | ~R$40/ano |
| **Total inicial** | | **~R$0–150/mês** |

---

*Legado ID — Preserve o que importa.*
