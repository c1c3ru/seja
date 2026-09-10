#!/usr/bin/env bash
# tsc falha com TS18003 ("No inputs were found") quando não há nenhum
# arquivo .ts/.tsx versionado em src/ — estado esperado durante o bootstrap
# do projeto (ver commit "remove all project source files and configuration").
# Assim que o primeiro arquivo for adicionado, este guard some da execução
# e o typecheck real volta a rodar normalmente.
set -euo pipefail

if find src -type f \( -name '*.ts' -o -name '*.tsx' \) 2>/dev/null | grep -q .; then
  exec npx tsc --noEmit
fi

echo "Nenhum arquivo .ts/.tsx em src/ ainda — typecheck pulado (fase de bootstrap)."
