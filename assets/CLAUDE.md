# Piso de design (schematize-design) — sempre-on

Direção visual, gosto, wireframe, polimento, animação e auditoria visual. A engenharia de front (RSC, segurança,
a11y como piso técnico, CWV, SEO técnico, testes) é da `schematize-web`.

1. **Wireframe aprovado antes de código**, em página inteira: `wireframe.json` renderizado em SVG cinza, mostrado, e
   **pare**. A stack de saída é a **última** pergunta. Ajuste de uma seção pode pular, dizendo por quê.
2. **Nenhuma cor sem medir contraste** (`scripts/checar-contraste.mjs`), nos papéis do acento: rótulo em cima, forma
   contra o fundo, link em texto. Estado interativo (hover, foco) é superfície nova.
3. **Zero travessão** (`—`, `–`, `--`) em copy, `alt`, meta e placeholder. **Um CTA focal por tela.**
4. **O briefing manda; site-mãe é a referência.** Nunca copie a referência pixel a pixel. "Menos cara de IA" se
   resolve mudando **uma seção** e mostrando, nunca refazendo a página inteira.
5. **Recusas por omissão:** kicker sobre título, card dentro de card, grid de 3 cards iguais como estrutura, métrica-herói,
   texto em gradiente, vidro de enfeite, roxo por padrão, emoji como ícone. Ícone é SVG com traço consistente.
6. **Movimento:** decida se anima; ease-out forte, nunca `ease-in` em UI; UI até 300ms; um momento autoral por página;
   só `transform` e `opacity`; `prefers-reduced-motion` com o conteúdo **visível**; nada animado em ação de teclado.
7. **MÍDIA GERADA NUNCA POR MODELO CLAUDE.** Imagem, ilustração figurativa, vídeo e áudio gerados saem de Codex ou
   Gemini: rode `scripts/detectar-geradores.sh`, **pergunte** à pessoa qual usar e delegue à `schematize-models`
   (`/models-image`). Nenhum gerador: avise sem rodeio que visual gerado pelo Claude sai ruim e ofereça instalar
   Codex/Gemini, banco com licença comercial ou asset do cliente. SVG de wireframe, de ícone e estrutural é código
   e pode.
8. **Comando sem alvo ou sem argumento pergunta; nunca roda sozinho.** Verificação em rodadas limitadas: uma
   inspeção, um lote de correção, no máximo uma confirmação.
9. <!-- herdado:engineering/orquestracao:curto -->**Orquestrador não desenvolve; subagent barato executa.** O agent principal só planeja, despacha e revisa; ação onerosa vira micro-tasks para o executor mais barato que resolve: `haiku` (mecânico) / `sonnet` (código; falhou → mesmo subagent corrige, até 2 rodadas) → Codex `gpt-5.6-terra` → Cursor → subagent `opus` (motivo) → `park`; **visual vai direto ao Codex**; **imagem nunca pelo Claude: detectar Codex/Gemini e perguntar ao usuário qual usar (Codex é a sugestão), nunca API de imagem paga**; papéis em `agentes.toml`. No overdev, cada item do checklist vai a um subagent e o principal revisa antes do `- [x]`. **Sem frota ociosa:** idle com pendência volta ao trabalho; dependente de outro agent → mata e enfileira com gatilho; terminou → mata (§9.6). Detalhe: `schematize-engineering` → `references/orquestracao.md` §9.<!-- /herdado -->

Detalhe e conflitos resolvidos entre as fontes: `schematize-design` → `references/recusas-anti-ai-slop.md`.

<!-- herdado:engineering/pisos-22-29:bloco -->**Herda os pisos 22–29 da `schematize-engineering`** (texto completo em `assets/CLAUDE.md` dela): 22 tudo no git — sem remote, push falho ou HEAD≠origin a demanda NÃO se conclui; 23 deploy só do git (VETADO scp/rsync/tar|ssh/docker save|load/git bundle); 24 o ops é o gate da IA — a IA nunca muda a VPS direto nem escreve SQL, só operação nomeada (`ssh vps "ops <op>"`); 25 sem agents inúteis (entregou, morreu); 26 relatório a cada 30 min e handoff a cada 6 h; 27 CI remoto só antes do hml, a pedido ou em tag (`workflow_dispatch` + `hml-*`/`v*`; VETADO `pull_request`, `push` em branch, `workflow_run`, cron sem justificativa); 28 microserviço autônomo (fila durável + 7 testes de resiliência); 29 build/teste na máquina dev/hml quando existe (ponte só no workspace de build, nunca prd) + higiene (`scripts/higiene.sh`).<!-- /herdado -->
