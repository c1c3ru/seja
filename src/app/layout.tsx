import type { Metadata } from 'next';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'SEJA — Sistema de Estágios e Jovem Aprendiz',
  description: 'Plataforma institucional de gestão de estágios e jovem aprendiz do IFCE.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
