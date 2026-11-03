#!/usr/bin/env node
/**
 * aprovacao.mjs · schematize-design
 *
 * Piso 1 (wireframe aprovado ANTES do codigo) como ESTADO gravado, nao prosa.
 * meta.aprovacao = { por, em, sha256 }, onde sha256 e o hash do wireframe SEM o proprio campo
 * `aprovacao` (JSON canonico, chaves ordenadas). Mudou o desenho depois de aprovar, o hash nao bate.
 *
 *   node scripts/aprovacao.mjs w.json                        imprime o hash
 *   node scripts/aprovacao.mjs w.json --aprovar --por NOME   grava meta.aprovacao (so apos o humano aprovar o SVG)
 *   node scripts/aprovacao.mjs w.json --verificar            exit 0 aprovado e coerente · 1 sem aprovacao ou hash nao bate · 2 uso
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const canon = (v) => Array.isArray(v) ? `[${v.map(canon).join(',')}]`
  : v && typeof v === 'object' ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}`
  : JSON.stringify(v);

export function hashWireframe(wf) {
  const c = structuredClone(wf);
  if (c.meta) delete c.meta.aprovacao;
  return createHash('sha256').update(canon(c)).digest('hex');
}

export function estadoAprovacao(wf) {
  const a = wf?.meta?.aprovacao;
  if (!a || !a.por || !a.em || !a.sha256) return { ok: false, motivo: 'sem meta.aprovacao {por, em, sha256}: wireframe NAO aprovado (piso 1)' };
  const h = hashWireframe(wf);
  if (a.sha256 !== h) return { ok: false, motivo: `wireframe mudou depois da aprovacao (aprovado ${a.sha256.slice(0, 12)}, atual ${h.slice(0, 12)}): reaprove` };
  return { ok: true, hash: h };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arq = process.argv[2];
  if (!arq || arq.startsWith('--')) { console.error('uso: aprovacao.mjs <wireframe.json> [--aprovar --por NOME | --verificar]'); process.exit(2); }
  let wf;
  try { wf = JSON.parse(readFileSync(arq, 'utf8')); } catch (e) { console.error(`JSON invalido: ${e.message}`); process.exit(2); }
  const args = process.argv.slice(3);
  if (args.includes('--aprovar')) {
    const por = args[args.indexOf('--por') + 1];
    if (!args.includes('--por') || !por) { console.error('--aprovar exige --por NOME'); process.exit(2); }
    wf.meta.aprovacao = { por, em: new Date().toISOString(), sha256: hashWireframe(wf) };
    writeFileSync(arq, JSON.stringify(wf, null, 2) + '\n', 'utf8');
    console.log(`aprovado por ${por}: sha256 ${wf.meta.aprovacao.sha256}`);
  } else if (args.includes('--verificar')) {
    const r = estadoAprovacao(wf);
    if (!r.ok) { console.error(`NAO APROVADO: ${r.motivo}`); process.exit(1); }
    console.log(`aprovado, sha256 ${r.hash}`);
  } else console.log(hashWireframe(wf));
}
