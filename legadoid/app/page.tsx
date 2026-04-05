import Link from "next/link";
import {
  Flame, Image, Clock, TreePine, BookOpen, Star,
  Shield, Infinity, Users, ArrowRight, CheckCircle2,
  ChevronDown, Quote,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// ─── DADOS ESTÁTICOS ──────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BookOpen,
    title: "Biografia",
    desc: "Escreva ou deixe nossa IA gerar um texto de homenagem digno, sensível e personalizado.",
  },
  {
    icon: Image,
    title: "Galeria de Fotos e Vídeos",
    desc: "Reúna todas as fotos espalhadas por celulares e álbuns antigos. Sem limite de quantidade.",
  },
  {
    icon: Clock,
    title: "A História de Uma Vida",
    desc: "Marque os momentos que definiram quem ele ou ela foi — escola, casamento, conquistas.",
  },
  {
    icon: TreePine,
    title: "Raízes — Árvore Genealógica",
    desc: "Mostre de onde vieram as histórias. Um mapa de origem que as próximas gerações vão agradecer.",
  },
  {
    icon: BookOpen,
    title: "Livro de Memórias",
    desc: "Amigos e familiares deixam mensagens, fotos e histórias. Sem cadastro, sem custo.",
  },
  {
    icon: Flame,
    title: "Velas Virtuais",
    desc: "Acenda uma vela. Um gesto pequeno com um significado imenso — especialmente no Dia de Finados.",
  },
];

const TESTIMONIALS = [
  {
    text: "Fiz o memorial do meu pai em uma hora, ainda no dia do velório. Quando compartilhei no grupo da família, minha tia ligou chorando — ela tinha fotos que a gente nunca tinha visto.",
    name: "Rodrigo M.",
    role: "Filho",
    stars: 5,
  },
  {
    text: "O que mais me surpreendeu foi a elegância. Não parece um site de obituário. Parece um livro de família. Cada vez que acesso, sinto que ele ainda está aqui de alguma forma.",
    name: "Cláudia S.",
    role: "Viúva",
    stars: 5,
  },
  {
    text: "Meus netos nunca conheceram minha avó. Hoje, aos 8 anos, meu filho entra no Legado dela, vê as fotos, lê a história. Isso não tem preço.",
    name: "Mariana P.",
    role: "Neta",
    stars: 5,
  },
];

const FAQ = [
  {
    q: "O LEGADO ID é gratuito?",
    a: "Sim. Você pode criar e personalizar o memorial completamente de graça. Para torná-lo permanente e remover a marca d'água, existe o plano Mensal (R$ 29/mês) ou o plano Eterno (R$ 197, pagamento único).",
  },
  {
    q: "O memorial vai ficar no ar para sempre?",
    a: "No plano Eterno, sim — garantido contratualmente. Mantemos um fundo financeiro de continuidade para garantir que seus memoriais continuem no ar indefinidamente.",
  },
  {
    q: "Família e amigos precisam criar conta para contribuir?",
    a: "Não. Qualquer pessoa pode visitar o memorial, deixar uma mensagem e enviar uma foto sem criar conta e sem pagar absolutamente nada.",
  },
  {
    q: "Tem limite de fotos ou vídeos?",
    a: "Não. Nos planos pagos, você pode adicionar quantas fotos e vídeos quiser, sem limite de armazenamento.",
  },
  {
    q: "Posso proteger o memorial com senha?",
    a: "Sim. Se preferir que somente pessoas próximas acessem, adicione uma senha ao memorial. Apenas quem tiver a senha consegue visualizar o conteúdo.",
  },
  {
    q: "E se eu não gostar? Tem reembolso?",
    a: "Sim. Se dentro de 7 dias do pagamento você não estiver satisfeito por qualquer motivo, devolvemos 100% do valor — sem perguntas.",
  },
];

// ─── COMPONENTES ──────────────────────────────────────────────────────────────
function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-medium text-amber-medium" />
      ))}
    </div>
  );
}

function StepCard({
  number, title, desc,
}: { number: string; title: string; desc: string }) {
  return (
    <div className="text-center group">
      <div className="w-14 h-14 rounded-2xl bg-amber-soft border border-amber-light
                      flex items-center justify-center mx-auto mb-4
                      transition-all duration-300 group-hover:bg-amber-deep group-hover:border-amber-deep">
        <span className="font-display text-2xl font-semibold text-amber-deep
                         group-hover:text-white transition-colors">
          {number}
        </span>
      </div>
      <h3 className="font-sans font-semibold text-stone mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center pt-16
                            bg-gradient-to-br from-sand via-mist to-white overflow-hidden">
          {/* Decoração de fundo */}
          <div className="absolute top-20 right-0 w-[600px] h-[600px]
                          bg-amber-soft rounded-full opacity-30 blur-3xl -translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px]
                          bg-amber-light rounded-full opacity-10 blur-3xl" />

          <div className="section-container relative z-10 py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-soft border border-amber-light
                              rounded-full px-4 py-2 mb-8">
                <StarRating count={5} />
                <span className="text-sm font-medium text-amber-deep">
                  Avaliado por famílias brasileiras
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-display-l md:text-[4rem] lg:text-[4.5rem]
                             font-light text-stone leading-tight mb-6 text-balance">
                A história de quem você amou{" "}
                <em className="text-amber-deep not-italic">merece durar para sempre.</em>
              </h1>

              {/* Subtítulo */}
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                Crie um memorial digital bonito, completo e eterno — onde toda a família
                pode guardar fotos, compartilhar memórias e visitar sempre que sentir saudade.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/criar" className="btn-primary text-base py-4 px-8">
                  Criar gratuitamente — leva 5 minutos
                </Link>
                <Link href="/exemplos" className="btn-secondary text-base py-4 px-8 flex items-center gap-2">
                  Ver exemplos <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Microcopy */}
              <p className="mt-4 text-sm text-muted-foreground">
                Sem cartão de crédito. Sem necessidade de criar conta agora.
              </p>

              {/* Garantias rápidas */}
              <div className="mt-12 flex flex-wrap justify-center gap-6">
                {[
                  { icon: Shield,   text: "Sem anúncios" },
                  { icon: Infinity, text: "Permanente para sempre" },
                  { icon: Users,    text: "Família contribui grátis" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-amber-medium" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── COMO FUNCIONA ─────────────────────────────────────────────────── */}
        <section className="section bg-white">
          <div className="section-container">
            <h2 className="section-title">Três passos. Uma memória para sempre.</h2>
            <p className="section-subtitle">
              Criar o Legado de quem você ama é simples, rápido e não exige nenhum conhecimento técnico.
            </p>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
              <StepCard
                number="1"
                title="Crie o perfil"
                desc="Digite o nome, as datas e faça o upload da foto. Em menos de dois minutos, o Legado já existe."
              />
              <StepCard
                number="2"
                title="Personalize com amor"
                desc="Escolha entre dezenas de temas elegantes. Adicione fotos, vídeos, a história de vida e muito mais."
              />
              <StepCard
                number="3"
                title="Compartilhe com a família"
                desc="Envie o link pelo WhatsApp. Amigos e familiares podem contribuir sem precisar criar conta."
              />
            </div>

            <div className="mt-12 text-center">
              <Link href="/criar" className="btn-primary">
                Começar agora
              </Link>
            </div>
          </div>
        </section>

        {/* ── FUNCIONALIDADES ───────────────────────────────────────────────── */}
        <section className="section bg-sand texture-noise">
          <div className="section-container">
            <h2 className="section-title">Tudo o que uma vida merece ter</h2>
            <p className="section-subtitle">
              Cada módulo foi pensado para preservar um pedaço diferente de quem partiu.
            </p>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card-base p-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-soft flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-amber-deep" />
                  </div>
                  <h3 className="font-sans font-semibold text-stone mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COLABORAÇÃO FAMILIAR ──────────────────────────────────────────── */}
        <section className="section bg-white">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-display-m text-stone mb-6 text-balance">
                  A família inteira pode participar.
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Não importa onde cada um está — o Legado reúne todo mundo.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      title: "Compartilhe em segundos",
                      desc: "Envie o link pelo WhatsApp. Não precisa de nada mais do que isso.",
                    },
                    {
                      title: "Sem burocracia para quem contribui",
                      desc: "Amigos podem escrever mensagens, enviar fotos e acender velas sem criar conta ou pagar nada.",
                    },
                    {
                      title: "Você decide o que aparece",
                      desc: "Prefere revisar cada mensagem antes de publicar? A escolha é sua.",
                    },
                  ].map(({ title, desc }) => (
                    <div key={title} className="flex gap-4">
                      <div className="mt-1 flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-amber-medium" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone text-sm">{title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card de depoimento lateral */}
              <div className="card-base p-8 bg-sand border-amber-light">
                <Quote className="w-8 h-8 text-amber-light mb-4" />
                <p className="font-display text-xl font-light italic text-stone leading-relaxed mb-6">
                  "Minha mãe morava em São Paulo, meu irmão em Porto Alegre, meu pai em Recife.
                  O Legado foi o único lugar onde a gente se encontrou de verdade naquele momento."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-soft border border-amber-light
                                  flex items-center justify-center">
                    <span className="font-display font-semibold text-amber-deep">F</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-stone">Fernanda R.</p>
                    <p className="text-xs text-muted-foreground">Filha de homenageada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DEPOIMENTOS ───────────────────────────────────────────────────── */}
        <section className="section bg-stone text-white">
          <div className="section-container">
            <h2 className="font-display text-display-m text-white text-center mb-4">
              Mais de 3.000 famílias brasileiras já criaram seu Legado
            </h2>
            <p className="text-white/60 text-center mb-16 max-w-xl mx-auto">
              Avaliado com 5 estrelas por quem usou no momento mais difícil.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(({ text, name, role, stars }) => (
                <div key={name} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <StarRating count={stars} />
                  <p className="font-display text-lg font-light italic text-white/80
                                leading-relaxed mt-4 mb-6">
                    "{text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-deep/20 border border-amber-deep/30
                                    flex items-center justify-center">
                      <span className="font-display font-semibold text-amber-light text-sm">
                        {name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{name}</p>
                      <p className="text-xs text-white/50">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PREÇOS ────────────────────────────────────────────────────────── */}
        <section className="section bg-white" id="precos">
          <div className="section-container">
            <h2 className="section-title">Um preço honesto. Uma memória para sempre.</h2>
            <p className="section-subtitle">
              Sem cobranças escondidas. Sem anúncios. Sem cobranças para a família.
            </p>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Plano Mensal */}
              <div className="card-base p-8">
                <p className="text-sm font-medium text-muted-foreground mb-1">Mensal</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="font-display text-4xl font-semibold text-stone">R$ 29</span>
                  <span className="text-muted-foreground mb-1">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Memorial completo, sem marca d'água",
                    "Fotos e vídeos ilimitados",
                    "Todos os módulos inclusos",
                    "Família contribui sem custo",
                    "Sem anúncios",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-amber-medium flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/criar" className="btn-secondary w-full text-center block">
                  Ativar por R$ 29/mês
                </Link>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Cancele quando quiser
                </p>
              </div>

              {/* Plano Eterno — Destaque */}
              <div className="relative card-base p-8 border-amber-medium bg-gradient-to-br
                              from-amber-soft to-white ring-2 ring-amber-medium">
                {/* Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-deep text-white text-xs font-semibold
                                   px-3 py-1 rounded-full">
                    ⭐ Mais escolhido
                  </span>
                </div>

                <p className="text-sm font-medium text-amber-deep mb-1">Eterno</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-display text-4xl font-semibold text-stone">R$ 197</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">pagamento único</p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Tudo do plano Mensal",
                    "Pago uma vez. Dura para sempre.",
                    "Garantia de permanência contratual",
                    "Fundo de continuidade LEGADO ID",
                    "Suporte prioritário",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-stone">
                      <CheckCircle2 className="w-4 h-4 text-amber-deep flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href="/criar" className="btn-primary w-full text-center block">
                  Tornar meu Legado eterno
                </Link>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Sem renovações. Nunca.
                </p>
              </div>
            </div>

            {/* Garantias */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { emoji: "🛡️", text: "7 dias de garantia" },
                { emoji: "📵", text: "Sem anúncios jamais" },
                { emoji: "👨‍👩‍👧‍👦", text: "Família entra de graça" },
                { emoji: "♾️", text: "Fundo de continuidade" },
              ].map(({ emoji, text }) => (
                <div key={text} className="text-center">
                  <span className="text-2xl">{emoji}</span>
                  <p className="text-xs text-muted-foreground mt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section className="section bg-sand">
          <div className="section-container max-w-2xl">
            <h2 className="section-title">Perguntas frequentes</h2>

            <div className="mt-12 space-y-0 divide-y divide-border">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group py-5">
                  <summary className="flex items-center justify-between cursor-pointer
                                      font-semibold text-stone list-none">
                    {q}
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0
                                           transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
        <section className="section bg-white">
          <div className="section-container text-center max-w-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-soft border border-amber-light
                            flex items-center justify-center mx-auto mb-6">
              <Flame className="w-8 h-8 text-amber-deep animate-candle-flicker" />
            </div>

            <h2 className="font-display text-display-m text-stone mb-4 text-balance">
              Não deixe a memória de quem você amou depender da sorte.
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Fotos somem. Celulares quebram. Memórias enfraquecem. O LEGADO ID existe para
              que nada disso aconteça com a história de quem foi tão importante para você.
            </p>

            <Link href="/criar" className="btn-primary text-base py-4 px-10 inline-flex">
              Criar o Legado agora — é gratuito
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Sem cartão de crédito. Sem compromisso. Começa em 5 minutos.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
