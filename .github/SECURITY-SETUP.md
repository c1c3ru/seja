# Setup de segurança do repositório (GitHub Advanced Security)

Este guia complementa o que já foi automatizado via CLI/PR e lista **apenas
os passos que exigem clique na interface do GitHub** — nenhuma IA ou CLI
consegue alterar `Settings` de um repositório em nome do usuário. Execute-os
como dono/administrador do repositório (`c1c3ru/seja`, permissão _Admin_).

## O que já está automatizado (neste repositório, via arquivos versionados)

| Recurso                    | Arquivo                                                        | Status                                   |
| -------------------------- | -------------------------------------------------------------- | ---------------------------------------- |
| Code scanning (CodeQL)     | `.github/workflows/codeql.yml`                                 | ✅ Criado                                |
| Dependabot version updates | `.github/dependabot.yml`                                       | ✅ Criado                                |
| Inspeção contínua (Sonar)  | `.github/workflows/sonarqube.yml` + `sonar-project.properties` | ✅ Criado (requer `SONAR_TOKEN`, ver §4) |
| Revisão obrigatória        | `.github/CODEOWNERS`                                           | ✅ Já existia                            |
| Secret scanning            | _(configuração na UI, ver §1)_                                 | ⬜ Manual                                |
| Push protection            | _(configuração na UI, ver §1)_                                 | ⬜ Manual                                |
| Dependabot alerts/updates  | _(toggle na UI, ver §2)_                                       | ⬜ Manual                                |
| Branch protection rules    | _(configuração na UI, ver §3)_                                 | ⬜ Manual                                |
| Copilot code review        | _(configuração na UI, ver §5)_                                 | ⬜ Manual                                |

> O repositório é **público**, então Secret scanning, Push protection e
> CodeQL/code scanning são **gratuitos** (não exigem licença GitHub Advanced
> Security paga). Se um dia o repositório virar privado, esses três recursos
> passam a exigir um assento de GHAS/Code Security/Secret Protection.

> ⚠️ O _default branch_ configurado no GitHub para este repositório é
> **`producao`** (confirmado via API). É essa mesmo a branch que deve
> receber PRs por padrão? Se não for a intenção, ajuste primeiro em
> `Settings → General → Default branch` — as instruções de proteção abaixo
> tratam `producao` como "branch principal" porque é o que o GitHub
> considera hoje.

---

## 1. Secret Scanning & Push Protection

Caminho: `Settings → Code security and analysis` (aba **Security** do
repositório → **Configure**, dependendo da versão da UI).
URL direta: `https://github.com/c1c3ru/seja/settings/security_analysis`

1. Em **Secret scanning**, clique **Enable**.
2. Em **Push protection**, clique **Enable** — isso bloqueia no `git push`
   qualquer commit que contenha um padrão de segredo reconhecido (chave
   Supabase, token, private key etc.), antes de o segredo entrar no
   histórico remoto.
3. Habilite também **Validity checks** (confirma com o provedor se o
   segredo vazado ainda está ativo — ajuda a priorizar a resposta a
   incidente) e, se disponível no plano, a detecção genérica de segredos
   (padrões não estruturados, tipo senha em texto plano).
4. Secret scanning varre o **histórico inteiro** ao ser ativado, não só
   commits novos. Se aparecer um alerta em um commit antigo, **rotacione a
   credencial imediatamente** (ver `docs/SEGURANCA.md`, seção 5 —
   "Rotação de chaves a cada troca de equipe ou incidente") e só depois
   feche o alerta como resolvido.
5. Se um push legítimo for bloqueado por falso positivo, prefira remover o
   segredo do commit e usar variável de ambiente (`.env.local`, nunca
   versionado — ver `.env.example`) em vez de usar a opção "Allow secret".

## 2. Dependabot Alerts & Security Updates

O arquivo `.github/dependabot.yml` já criado cuida das **atualizações
programadas** (PRs semanais de versão). Isso é independente dos **alertas
de vulnerabilidade**, que precisam ser ligados na mesma página do passo 1:

`https://github.com/c1c3ru/seja/settings/security_analysis`

1. **Dependency graph** — geralmente já ligado em repositórios públicos;
   confirme que está **Enabled**.
2. **Dependabot alerts** → **Enable** (gera alerta quando uma dependência
   do `package.json`/`package-lock.json` tem CVE conhecida).
3. **Dependabot security updates** → **Enable** (abre PR automático e
   imediato de correção assim que um alerta de segurança surge, sem
   esperar o cronograma semanal do `dependabot.yml`).

## 3. Branch Protection Rules

Caminho: `Settings → Branches → Branch protection rules → Add branch
protection rule`.
URL direta: `https://github.com/c1c3ru/seja/settings/branches`

> Os checks abaixo só aparecem na lista de seleção **depois da primeira
> execução** dos workflows correspondentes. Abra (ou atualize) um PR uma
> vez para os workflows rodarem antes de configurar esta seção.

### 3.1 Branch principal (`producao`)

1. **Branch name pattern:** `producao`
2. **Require a pull request before merging**
   - **Require approvals:** mínimo `1`
   - Marque **Require review from Code Owners** (o `.github/CODEOWNERS`
     já exige revisão de `@c1c3ru` em `/supabase/`, `/src/lib/auth/`,
     `/src/lib/security/` e `/.github/`)
   - Marque **Dismiss stale pull request approvals when new commits are
     pushed**
3. **Require status checks to pass before merging**
   - Marque **Require branches to be up to date before merging**
   - Selecione os checks:
     - `Lint, tipos e testes` (job `qualidade` do `ci.yml` — depois do
       passo 3.3 abaixo, este mesmo check também passa a exigir cobertura
       mínima de testes)
     - `Build` (job `build` do `ci.yml`)
     - `Analisar (javascript-typescript)` (job `analyze` do
       `codeql.yml` — bloqueia o merge se o CodeQL encontrar alerta novo)
4. Marque **Require conversation resolution before merging**
5. Marque **Do not allow bypassing the above settings** (inclui
   administradores — recomendado em repositório institucional)
6. Deixe **Allow force pushes** e **Allow deletions** desmarcados
7. **Create** / **Save changes**

> Depois de configurar o SonarQube (`§4`) e confirmar que ele já rodou com
> sucesso em pelo menos um PR, volte aqui e adicione o check
> `SonarQube Cloud` à lista de status obrigatórios do passo 3 — antes
> disso o job fica _skipped_ (não bloqueia, mas também não inspeciona
> nada de fato).

### 3.2 Demais branches de longa duração

Repita o mesmo procedimento para `desenvolvimento` e, quando ela for
criada, `homologacao` (fluxo descrito em `docs/BRANCHING.md`). Nessas
branches intermediárias é aceitável reduzir aprovações obrigatórias para
`0`–`1` conforme o processo do time, mas **mantenha os checks de CodeQL e
de testes como obrigatórios em todas elas** — é o que impede que uma
vulnerabilidade ou uma queda de cobertura suba de ambiente em ambiente.

### 3.3 Cobertura mínima de testes (pré-requisito para o passo 3.1)

Hoje o `ci.yml` roda os testes (`npm test`) mas não mede nem exige
cobertura. Para a regra "bloquear PR que não atinja a cobertura mínima"
funcionar, adicione a checagem ao próprio job `qualidade` (evita criar um
novo status check — o `Lint, tipos e testes` já configurado como
obrigatório no passo 3.1 passa a cobrir cobertura também):

```bash
npm install --save-dev @vitest/coverage-v8
```

```ts
// vitest.config.ts (novo arquivo na raiz do projeto)
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // Ajuste os limites ao nível real de cobertura do projeto; comece
      // pelo patamar atual e suba aos poucos em vez de travar o CI hoje.
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
});
```

```json
// package.json — scripts
"test:coverage": "vitest run --coverage"
```

```yaml
# .github/workflows/ci.yml — novo passo no job "qualidade", após "Testes"
- name: Cobertura de testes
  run: npm run test:coverage
```

O `vitest` sai com código de erro quando a cobertura fica abaixo de
`thresholds`, então o check `Lint, tipos e testes` falha automaticamente —
nenhuma ferramenta externa (Codecov, Coveralls etc.) é necessária. Isso é
proposital: o projeto lida com dados pessoais de discentes (ver
`docs/SEGURANCA.md`, seção 9 — LGPD), então evitar enviar relatórios de
cobertura (que podem conter trechos de código) para serviços de terceiros
é a opção mais conservadora.

## 4. SonarQube — Continuous Inspection

O CodeQL (§ acima) foca em vulnerabilidades de segurança. O SonarQube
complementa com _code smells_, duplicação, complexidade ciclomática e
confiabilidade geral — a "Continuous Inspection" que dá nome ao projeto
[SonarSource/sonarqube](https://github.com/SonarSource/sonarqube).

O workflow `.github/workflows/sonarqube.yml` e o arquivo
`sonar-project.properties` já estão no repositório, mas o job de análise
fica **pulado (skipped)** — não falha, apenas não roda — até o secret
`SONAR_TOKEN` existir. Nenhum PR quebra por causa disso antes do passo 5
abaixo ser feito.

1. Crie uma conta em [sonarcloud.io](https://sonarcloud.io) (gratuito para
   repositórios públicos) com **Login with GitHub** e autorize o app
   SonarQube Cloud a acessar `c1c3ru/seja`.
2. Em **+ → Analyze new project**, importe `c1c3ru/seja`. Anote a
   **Organization Key** e a **Project Key** que a SonarQube Cloud gerar.
3. Se esses valores vierem diferentes de `c1c3ru` (organização) e
   `c1c3ru_seja` (projeto), edite `sonar.organization` e
   `sonar.projectKey` em `sonar-project.properties` (raiz do repositório)
   para baterem exatamente com o que foi criado.
4. Em **My Account → Security**, gere um token (**Project Analysis
   Token** é suficiente).
5. No GitHub, cadastre o secret em `Settings` → `Secrets and variables` →
   `Actions` → **New repository secret**, com nome `SONAR_TOKEN` e valor
   o token do passo 4.
   URL direta: `https://github.com/c1c3ru/seja/settings/secrets/actions`
6. Abra ou atualize um PR — o job "SonarQube Cloud" deixa de aparecer
   como _skipped_ e passa a comentar o resultado direto no PR, além de
   publicar o dashboard completo em sonarcloud.io.
7. Reaproveita o relatório de cobertura do Vitest (`coverage/lcov.info`,
   ver § 3.3) se ele existir; se ainda não existir, o SonarQube só
   analisa sem métrica de cobertura — não é um erro.

> Usa **SonarQube Server** auto-hospedado em vez de SonarQube Cloud? Em
> `sonarqube.yml`, adicione `SONAR_HOST_URL: ${{ vars.SONAR_HOST_URL }}`
> ao `env:` do passo "Análise SonarQube" e cadastre a URL em
> `Settings → Secrets and variables → Actions → Variables`.

## 5. Correções com Copilot (aceitar sugestões em 1 clique)

Dois fluxos distintos, ambos exigem assento Copilot (Individual, Business
ou Enterprise) atribuído a quem for aceitar a sugestão:

1. **Copilot Autofix nos alertas do CodeQL** — aba **Security → Code
   scanning alerts** do repositório, abra um alerta gerado pelo
   `codeql.yml`. Quando o Copilot Autofix já tiver gerado uma correção
   (ou clique em **Generate fix**), revise o diff sugerido e clique em
   **Create pull request** (ou **Commit changes**, se preferir aplicar
   direto na branch) para aceitar a correção com um clique.
2. **Copilot code review em Pull Requests** — no painel **Reviewers** de
   qualquer PR, adicione **Copilot** como revisor (ou ative
   `Settings → Code review → Automatically request Copilot code review`
   para que isso aconteça em todo PR novo, automaticamente). Nas
   sugestões que o Copilot deixar como comentário de revisão, a equipe
   aceita clicando em **Commit suggestion**; para várias de uma vez, use
   **Add suggestion to batch** em cada uma e finalize com **Commit
   suggestions**.

## 6. Checklist final

- [ ] Secret scanning ativo (`§1`)
- [ ] Push protection ativo (`§1`)
- [ ] Dependabot alerts + security updates ativos (`§2`)
- [ ] Branch protection em `producao`: aprovação + Code Owners + checks
      (`Lint, tipos e testes`, `Build`, `Analisar (javascript-typescript)`) + conversas resolvidas (`§3.1`)
- [ ] Mesma proteção replicada em `desenvolvimento` (e `homologacao`
      quando existir) (`§3.2`)
- [ ] Cobertura mínima de testes configurada no CI e exigida via o check
      `Lint, tipos e testes` (`§3.3`)
- [ ] Projeto importado no SonarQube Cloud e secret `SONAR_TOKEN`
      cadastrado (`§4`)
- [ ] Copilot code review testado em pelo menos 1 PR (`§5`)
