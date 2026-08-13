# Clube do Céu — Gestão de Quadras 🎾

App de gestão do Clube do Céu (Chapadão do Céu, GO): agenda semanal por professor com
arrastar-e-soltar, cadastro de alunos com nível de habilidade (NTRP/ITF), modalidades e
regras de preço, financeiro com garantia do professor e painel de indicadores.

## Como funciona

- **Arquivo único**: [app_clube_do_ceu.html](app_clube_do_ceu.html) — HTML/CSS/JS sem dependências.
- **Dados na nuvem**: salvos automaticamente no Supabase (tabela `clube_ceu_estado`,
  documento JSONB único); o navegador guarda uma cópia offline (localStorage).
- **Página pública**: servida pela edge function `clube` do Supabase, que lê o HTML da
  tabela `clube_ceu_app`.

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

```bash
python -m http.server 8123
# abrir http://localhost:8123/app_clube_do_ceu.html
```

## Publicar alterações

Editar o HTML e reenviar para a tabela `clube_ceu_app` (o endereço público serve a
versão da tabela; ver histórico da conversa no Claude Code para o script de envio).
