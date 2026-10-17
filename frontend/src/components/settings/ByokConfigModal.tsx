'use client';

import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle2, Shield, ExternalLink, X, Cpu, Sparkles } from 'lucide-react';
import { useLabStore } from '@/store/useLabStore';

export const ByokConfigModal: React.FC = () => {
  const { byok, byokModalOpen, setByokModalOpen, saveByokSettings } = useLabStore();

  const [geminiKey, setGeminiKey] = useState(byok.geminiApiKey || '');
  const [groqKey, setGroqKey] = useState(byok.groqApiKey || '');
  const [provider, setProvider] = useState<'gemini' | 'groq' | 'backend'>(byok.preferredProvider || 'backend');

  const [showGemini, setShowGemini] = useState(false);
  const [showGroq, setShowGroq] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!byokModalOpen) return null;

  const handleSave = () => {
    saveByokSettings({
      geminiApiKey: geminiKey.trim(),
      groqApiKey: groqKey.trim(),
      preferredProvider: provider,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setByokModalOpen(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl p-6 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/40 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                Bring Your Own Key (BYOK)
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Gratuito
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Execute auditorias científicas com seus próprios limites gratuitos das APIs oficiais.
              </p>
            </div>
          </div>
          <button
            onClick={() => setByokModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security badge */}
        <div className="my-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-300">
          <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-slate-200">Privacidade Acadêmica Garantida:</span> Suas chaves de API ficam salvas exclusivamente no armazenamento local do seu navegador (localStorage) e nunca são gravadas em servidores de terceiros.
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Provider Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Modo de Execução Preferencial:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProvider('backend')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition ${
                  provider === 'backend'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                    : 'bg-slate-800/50 border-slate-700/80 text-slate-400 hover:border-slate-600'
                }`}
              >
                Servidor CortexLab
              </button>
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition flex items-center justify-center gap-1 ${
                  provider === 'gemini'
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-sm'
                    : 'bg-slate-800/50 border-slate-700/80 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Gemini 1.5 Flash
              </button>
              <button
                type="button"
                onClick={() => setProvider('groq')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition flex items-center justify-center gap-1 ${
                  provider === 'groq'
                    ? 'bg-orange-500/20 border-orange-400 text-orange-300 shadow-sm'
                    : 'bg-slate-800/50 border-slate-700/80 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-orange-400" />
                Groq (Llama 3.3)
              </button>
            </div>
          </div>

          {/* Google Gemini Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                Google Gemini API Key (15 RPM Grátis)
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
              >
                Obter chave no Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showGemini ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2 pr-10 text-xs bg-slate-950/70 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowGemini(!showGemini)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Groq Cloud Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                Groq Cloud API Key (30 RPM Grátis)
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1 hover:underline"
              >
                Obter chave no Groq Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showGroq ? 'text' : 'password'}
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full px-3.5 py-2 pr-10 text-xs bg-slate-950/70 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowGroq(!showGroq)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showGroq ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
          <div className="text-[11px] text-slate-500">
            {savedSuccess ? (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Chaves salvas com sucesso!
              </span>
            ) : (
              'As chamadas de extração usarão suas chaves locais.'
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setByokModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition active:scale-95"
            >
              Salvar Configuração
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
