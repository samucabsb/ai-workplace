import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CortexLab — Human Augmentation in Scientific Research | Multi-Agent Platform",
  description:
    "Plataforma multi-agente para aumento de desempenho humano na pesquisa científica. Mineração federada em APIs abertas, auditoria metodológica e síntese PRISMA com zero alucinação.",
  keywords: [
    "Human Augmentation",
    "Scientific Research",
    "Multi-Agent",
    "LangGraph",
    "PRISMA 2020",
    "Systematic Review",
    "OpenAlex",
    "Europe PMC",
    "FastAPI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-slate-950 antialiased">
        {children}
      </body>
    </html>
  );
}
