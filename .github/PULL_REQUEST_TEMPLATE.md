## Descrição

<!-- O que muda e por quê. Referencie o épico/issue: Closes #123 -->

Épico:

## Checklist geral

- [ ] Branch de destino correta (`dev`; `homologacao` e `producao` só recebem promoção)
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passam localmente
- [ ] Sem `any` novo e sem `console.log` esquecido

## Checklist de segurança

- [ ] Rotas sensíveis chamam `exigirPermissao()` no servidor
- [ ] IDs vindos do cliente passam por checagem de escopo (IDOR)
- [ ] Entradas validadas com Zod
- [ ] Nenhum segredo no código; variáveis novas adicionadas ao `.env.example`
- [ ] Tabelas novas com RLS habilitado e policy definida
- [ ] Ações destrutivas gravam auditoria com justificativa

## Evidências

<!-- Prints, gravação ou saída de teste -->
