import { describe, expect, it } from 'vitest';

import { MATRIZ_PERMISSOES, PERFIS, temPermissao } from '@/lib/auth/rbac';

describe('matriz RBAC', () => {
  it('dá ao DEEE acesso aos parâmetros do sistema', () => {
    expect(temPermissao('DEEE', 'parametros:usuarios')).toBe(true);
  });

  it('impede o Apoio de Coordenação de deletar vínculos', () => {
    expect(temPermissao('APOIO_COORDENACAO', 'estagios:deletar')).toBe(false);
    expect(temPermissao('APOIO_COORDENACAO', 'aprendiz:deletar')).toBe(false);
  });

  it('mantém o Professor Orientador em somente leitura', () => {
    const escrita = MATRIZ_PERMISSOES.PROFESSOR_ORIENTADOR.filter(
      (p) => !p.endsWith(':ler') && !p.startsWith('relatorios:'),
    );
    expect(escrita).toEqual([]);
  });

  it('restringe a empresa externa à solicitação de convênio', () => {
    expect(MATRIZ_PERMISSOES.EXTERNO_EMPRESA).toEqual(['convenio:solicitar']);
  });

  it('define permissões para todos os perfis declarados', () => {
    for (const perfil of PERFIS) {
      expect(MATRIZ_PERMISSOES[perfil]).toBeDefined();
    }
  });
});
