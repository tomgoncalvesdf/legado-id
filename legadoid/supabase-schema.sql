-- ═══════════════════════════════════════════════════════════════════════════
-- LEGADO ID — SCHEMA COMPLETO DO BANCO DE DADOS
-- Execute este arquivo no SQL Editor do Supabase
-- ═══════════════════════════════════════════════════════════════════════════

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─── USUÁRIOS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id           UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              VARCHAR(150) NOT NULL,
  email             VARCHAR(255) UNIQUE NOT NULL,
  phone             VARCHAR(20),
  avatar_url        TEXT,
  notification_email     BOOLEAN DEFAULT true,
  notification_birthdays BOOLEAN DEFAULT true,
  notification_new_posts BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

-- ─── MEMORIAIS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memorials (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  full_name         VARCHAR(200) NOT NULL,
  nickname          VARCHAR(100),
  birth_date        DATE,
  death_date        DATE,
  birth_city        VARCHAR(150),
  death_city        VARCHAR(150),
  country           VARCHAR(100) DEFAULT 'Brasil',
  biography         TEXT,
  biography_ai      BOOLEAN DEFAULT false,
  favorite_quote    TEXT,
  religious_symbol  VARCHAR(50),
  profile_photo_url TEXT,
  cover_photo_url   TEXT,
  cover_position    VARCHAR(20) DEFAULT 'center',
  theme_id          VARCHAR(100) DEFAULT 'classic-white',
  custom_colors     JSONB,
  slug              VARCHAR(200) UNIQUE NOT NULL,
  password_hash     TEXT,
  status            VARCHAR(20) DEFAULT 'draft'
                    CHECK (status IN ('draft','published','paused','archived')),
  is_indexable      BOOLEAN DEFAULT true,
  privacy           VARCHAR(20) DEFAULT 'public'
                    CHECK (privacy IN ('public','password','private')),
  is_preventive     BOOLEAN DEFAULT false,
  modules           JSONB DEFAULT '{
    "biography": true,
    "photos": true,
    "videos": false,
    "timeline": true,
    "family_tree": false,
    "memory_wall": true,
    "candles": true,
    "music": false,
    "service": false,
    "prayers": false,
    "rsvp": false,
    "location": false
  }'::jsonb,
  moderation_type   VARCHAR(20) DEFAULT 'pre'
                    CHECK (moderation_type IN ('pre','post')),
  views_count       INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  published_at      TIMESTAMPTZ,
  deleted_at        TIMESTAMPTZ
);

-- ─── ADMINS DO MEMORIAL ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memorial_admins (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id       UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  invited_email     VARCHAR(255),
  invite_token      VARCHAR(100) UNIQUE,
  invite_expires_at TIMESTAMPTZ,
  invite_accepted   BOOLEAN DEFAULT false,
  role              VARCHAR(20) DEFAULT 'editor'
                    CHECK (role IN ('owner','editor','moderator','viewer')),
  can_edit_content  BOOLEAN DEFAULT true,
  can_moderate      BOOLEAN DEFAULT true,
  can_manage_admins BOOLEAN DEFAULT false,
  can_change_settings BOOLEAN DEFAULT false,
  can_view_stats    BOOLEAN DEFAULT true,
  can_manage_plan   BOOLEAN DEFAULT false,
  invited_by        UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PLANOS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memorial_plans (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id       UUID UNIQUE NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  plan_type         VARCHAR(20) DEFAULT 'free'
                    CHECK (plan_type IN ('free','monthly','lifetime','b2b')),
  plan_status       VARCHAR(20) DEFAULT 'active'
                    CHECK (plan_status IN ('active','cancelled','expired','grace_period')),
  activated_at      TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  mp_subscription_id VARCHAR(200),
  last_payment_id   VARCHAR(200),
  coupon_code       VARCHAR(50),
  photo_limit       INTEGER DEFAULT 20,
  video_limit       INTEGER DEFAULT 2,
  storage_mb        INTEGER DEFAULT 500,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FOTOS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memorial_photos (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id       UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  uploaded_by       UUID REFERENCES users(id),
  url               TEXT NOT NULL,
  url_thumbnail     TEXT,
  url_medium        TEXT,
  caption           TEXT,
  taken_at          DATE,
  album             VARCHAR(100),
  sort_order        INTEGER DEFAULT 0,
  is_visible        BOOLEAN DEFAULT true,
  is_cover          BOOLEAN DEFAULT false,
  is_profile        BOOLEAN DEFAULT false,
  moderation_status VARCHAR(20) DEFAULT 'approved'
                    CHECK (moderation_status IN ('pending','approved','rejected')),
  file_size_bytes   INTEGER,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TIMELINE ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS timeline_events (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id       UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  title             VARCHAR(300) NOT NULL,
  description       TEXT,
  event_date        DATE,
  event_year        INTEGER,
  photo_url         TEXT,
  category          VARCHAR(50) DEFAULT 'general',
  sort_order        INTEGER DEFAULT 0,
  is_visible        BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── POSTS DO MURAL ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memory_posts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id       UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  author_user_id    UUID REFERENCES users(id),
  author_name       VARCHAR(150) NOT NULL,
  author_relation   VARCHAR(100),
  author_email      VARCHAR(255),
  author_ip         INET,
  content           TEXT,
  photo_url         TEXT,
  video_url         TEXT,
  moderation_status VARCHAR(20) DEFAULT 'pending'
                    CHECK (moderation_status IN ('pending','approved','rejected')),
  moderated_by      UUID REFERENCES users(id),
  moderated_at      TIMESTAMPTZ,
  is_pinned         BOOLEAN DEFAULT false,
  is_visible        BOOLEAN DEFAULT true,
  reactions_count   JSONB DEFAULT '{"heart":0,"candle":0,"pray":0}'::jsonb,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VELAS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS candles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id       UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES users(id),
  lighter_name      VARCHAR(150),
  lighter_relation  VARCHAR(100),
  message           TEXT,
  anonymous_token   VARCHAR(100),
  is_visible        BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SERVIÇOS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_events (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id       UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  event_type        VARCHAR(30) NOT NULL,
  title             VARCHAR(300),
  description       TEXT,
  venue_name        VARCHAR(300),
  address           VARCHAR(500),
  city              VARCHAR(150),
  state             VARCHAR(50),
  starts_at         TIMESTAMPTZ,
  ends_at           TIMESTAMPTZ,
  is_public         BOOLEAN DEFAULT true,
  accepts_rsvp      BOOLEAN DEFAULT false,
  rsvp_limit        INTEGER,
  sort_order        INTEGER DEFAULT 0,
  is_visible        BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RSVP ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rsvp_entries (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_event_id  UUID NOT NULL REFERENCES service_events(id) ON DELETE CASCADE,
  memorial_id       UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES users(id),
  name              VARCHAR(150) NOT NULL,
  email             VARCHAR(255),
  phone             VARCHAR(20),
  relation          VARCHAR(100),
  guests_count      INTEGER DEFAULT 1,
  message           VARCHAR(500),
  status            VARCHAR(20) DEFAULT 'confirmed',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PAGAMENTOS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id       UUID NOT NULL REFERENCES memorials(id) ON DELETE RESTRICT,
  user_id           UUID NOT NULL REFERENCES users(id),
  amount            DECIMAL(10,2) NOT NULL,
  currency          VARCHAR(3) DEFAULT 'BRL',
  plan_type         VARCHAR(20) NOT NULL,
  installments      INTEGER DEFAULT 1,
  status            VARCHAR(30) NOT NULL,
  payment_method    VARCHAR(30),
  mp_payment_id     VARCHAR(200) UNIQUE,
  mp_external_ref   VARCHAR(200),
  mp_status_detail  VARCHAR(100),
  mp_raw_response   JSONB,
  coupon_code       VARCHAR(50),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  approved_at       TIMESTAMPTZ
);

-- ─── ÍNDICES ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_auth ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_memorials_owner ON memorials(owner_id);
CREATE INDEX IF NOT EXISTS idx_memorials_slug ON memorials(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_memorials_status ON memorials(status);
CREATE INDEX IF NOT EXISTS idx_photos_memorial ON memorial_photos(memorial_id);
CREATE INDEX IF NOT EXISTS idx_posts_memorial ON memory_posts(memorial_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON memory_posts(memorial_id, moderation_status);
CREATE INDEX IF NOT EXISTS idx_candles_memorial ON candles(memorial_id);
CREATE INDEX IF NOT EXISTS idx_payments_mp ON payments(mp_payment_id);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE candles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Usuário lê/edita apenas seus próprios dados
CREATE POLICY "users_self" ON users
  FOR ALL USING (auth.uid() = auth_id);

-- Memorial: público pode ler se publicado e sem senha
CREATE POLICY "memorial_public_read" ON memorials FOR SELECT
  USING (status = 'published' AND privacy = 'public' AND deleted_at IS NULL);

-- Memorial: dono/admin pode fazer tudo
CREATE POLICY "memorial_owner_all" ON memorials FOR ALL
  USING (
    owner_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Posts aprovados visíveis publicamente
CREATE POLICY "posts_public_read" ON memory_posts FOR SELECT
  USING (moderation_status = 'approved' AND is_visible = true);

-- Posts: qualquer um pode criar (contribuição sem conta)
CREATE POLICY "posts_public_insert" ON memory_posts FOR INSERT
  WITH CHECK (true);

-- Velas: leitura pública
CREATE POLICY "candles_public_read" ON candles FOR SELECT
  USING (is_visible = true);

-- Velas: qualquer um pode criar
CREATE POLICY "candles_public_insert" ON candles FOR INSERT
  WITH CHECK (true);

-- Fotos: leitura pública para fotos aprovadas
CREATE POLICY "photos_public_read" ON memorial_photos FOR SELECT
  USING (moderation_status = 'approved' AND is_visible = true);

-- Pagamentos: somente o dono vê
CREATE POLICY "payments_owner_read" ON payments FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ─── FUNÇÃO: auto-criar user após signup ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger no auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── FUNÇÃO: incrementar views ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_memorial_views(memorial_slug TEXT)
RETURNS VOID AS $$
  UPDATE memorials SET views_count = views_count + 1 WHERE slug = memorial_slug;
$$ LANGUAGE sql SECURITY DEFINER;
