# Clube do Céu — Gestão de Quadras 🎾

App de gestão do Clube do Céu (Chapadão do Céu, GO): agenda semanal por professor com
arrastar-e-soltar, cadastro de alunos com nível de habilidade (NTRP/ITF), modalidades e
regras de preço, financeiro com garantia do professor e painel de indicadores.

**Endereço do app:** https://diegoschlatter.github.io/clube-do-ceu/app_clube_do_ceu.html

## Como funciona

- **Arquivo único**: [app_clube_do_ceu.html](app_clube_do_ceu.html) — HTML/CSS/JS sem build.
  A única biblioteca é o [supabase.js](supabase.js) (cópia local do supabase-js 2.118.0),
  usado para login, leitura/gravação e Realtime.
- **Login obrigatório**: Supabase Auth (e-mail + senha). Só entra quem está na tabela
  `clube_ceu_usuarios`; a RLS do banco bloqueia leitura e gravação de quem não está nela.
- **Dados na nuvem**: um documento JSONB único na tabela `clube_ceu_estado` (id `principal`),
  compartilhado por todos os usuários. O navegador guarda uma cópia offline (localStorage).
- **Sincronização**: toda alteração é gravada 0,6 s depois. O banco carimba `updated_at`
  (trigger) e avisa os outros aparelhos pelo Realtime, que recarregam na hora. Ao voltar
  pra aba ou recuperar a internet, o app também confere se há versão mais nova.
  Vale o último que grava: edições simultâneas no mesmo segundo podem se sobrescrever.
- **PWA**: instalável no celular; o service worker ([sw.js](sw.js)) serve o app do cache
  quando está sem internet (as chamadas ao Supabase nunca passam pelo cache).

## Dar acesso a alguém

1. No painel do Supabase (projeto `rznueluwhujcpkxcsddi`): **Authentication → Users → Add user**,
   com e-mail e senha (marcar *auto confirm*).
2. Incluir o e-mail na lista de autorizados (SQL Editor):

```sql
insert into public.clube_ceu_usuarios (email, nome) values ('pessoa@exemplo.com', 'Nome');
```

Para revogar, basta apagar a linha da tabela: no próximo acesso a pessoa é deslogada.

## Regras de negócio implementadas

- Modalidade automática pelo nº de alunos na quadra (1=Individual R$600, 2=Dupla R$500,
  3=Trio R$350, 4=Quarteto R$280; infantil 450/200) — 2 horários/semana = valor cheio,
  1 horário = 50%.
- **Valor combinado** por aluno (trava exceções históricas, ex.: turma dos R$280).
- **Piso** de R$350/aluno e desconto de quarteto condicionado à turma cheia.
- **Horário nobre** (6–8h e 17–20h): mínimo de uma dupla cheia (R$1.000/mês) por hora.
- **Garantia do professor**: repasse mínimo de R$4.000/mês; divisão 50/50 volta acima de
  R$8.000 de receita bruta.
- Ocupação sobre base de 50h úteis/semana (9h seg–sex, 5h sáb).

## Rodar localmente

Qualquer servidor estático na pasta serve (o login e os dados vêm do Supabase):

```bash
python -m http.server 8123
# abrir http://localhost:8123/app_clube_do_ceu.html
```

## Publicar alterações

Basta dar push na branch `master`: o GitHub Pages publica a raiz do repositório em um ou
dois minutos. (A edge function `clube` do Supabase, que servia o HTML da tabela
`clube_ceu_app`, era o caminho antigo e não é mais atualizada.)
