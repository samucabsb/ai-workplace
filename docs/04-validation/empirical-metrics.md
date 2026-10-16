# 📊 Protocolo de Validação Empírica & Métricas de Human Augmentation
## Avaliação de Desempenho e Confiabilidade Científica para a Residência em IA

> **Documento:** VAL-001  
> **Versão:** 1.0.0  
> **Finalidade:** Estabelecer o protocolo de experimentação científica que comprovará empiricamente a eficácia do **CortexLab** como ferramenta de *Human Augmentation* na pesquisa acadêmica.  
> **Hipótese Central ($H_1$):** *Pesquisadores auxiliados pela arquitetura multi-agente do CortexLab reduzem o tempo de triagem e extração metodológica em no mínimo 60%, mantendo precisão de extração estatística superior a 90% e índice de concordância inter-avaliador (Cohen's Kappa) superior a 0.75 com revisores sêniores.*

---

## 1. Desenho Experimental do Estudo Comparativo

Para validar cientificamente a plataforma na monografia/artigo da Residência em IA, será conduzido um experimento controlado pareado (*Within-Subjects or Between-Subjects Experimental Design*):

### 1.1 Amostra de Participantes
- **$N = 20$ Pesquisadores acadêmicos** (10 doutorandos, 6 pós-docs e 4 orientadores/PIs).
- **Áreas Temáticas:** Oncologia Experimental, Aprendizado de Máquina Aplicado à Saúde, Neurociências e Farmacologia.

### 1.2 Tarefa Padronizada de Benchmark
- Cada participante receberá um corpus padronizado de **50 artigos científicos reais** (contendo 35 estudos elegíveis com diferentes graus de risco de viés e 15 estudos com falhas metodológicas deliberadas ou sutis: subamostragem, p-hacking, falta de randomização).
- **Grupo Controle (Manual):** Utiliza ferramentas tradicionais (Zotero + Google Sheets / Excel + Leitura direta do PDF).
- **Grupo Intervenção (CortexLab):** Utiliza o CortexLab com agentes especialistas e pontos de aprovação humana (HITL).

---

## 2. Indicadores-Chave de Desempenho (KPIs) e Métricas Formais

### 2.1 Métrica 1: Redução Percentual do Tempo de Triagem ($\Delta T_{\text{screening}}$)

Mede o ganho de produtividade sem comprometer o rigor.

$$\Delta T_{\text{screening}} = \frac{T_{\text{manual}} - T_{\text{cortex}}}{T_{\text{manual}}} \times 100$$

- **$T_{\text{manual}}$:** Tempo total (em minutos) despendido para triar os 50 artigos e preencher a matriz de métodos manualmente.
- **$T_{\text{cortex}}$:** Tempo total (em minutos) gasto no CortexLab (incluindo tempo de leitura, auditoria das bancadas e aprovação dos checkpoints HITL).
- **Meta de Aceitação:** $\Delta T_{\text{screening}} \ge 60\%$ (redução mínima de 60% do tempo de triagem).

---

### 2.2 Métrica 2: Precisão, Cobertura e F1 da Extração Metodológica

Avalia se os dados extraídos pelo `AuditorAgent` e `ParserAgent` correspondem rigorosamente ao *Ground Truth* estabelecido por 2 revisores humanos seniores.

$$\text{Precisão (Precision)} = \frac{TP}{TP + FP}$$

$$\text{Revocação (Recall)} = \frac{TP}{TP + FN}$$

$$F_1\text{-Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$

Onde cada campo extraído (Tamanho da Amostra $N$, Tipo de Ensaio, P-valor primário, Descrição da Intervenção) é classificado como:
- **$TP$ (Verdadeiro Positivo):** Valor extraído corretamente com trecho literal correspondente.
- **$FP$ (Falso Positivo):** Dado alucinado ou atribuído à variável errada.
- **$FN$ (Falso Negativo):** Dado existente no paper que a IA falhou em extrair.
- **Meta de Aceitação:** $F_1\text{-Score} \ge 0.90$ (precisão e recall $\ge 90\%$).

---

### 2.3 Métrica 3: Taxa de Alucinação de DOIs e Citações ($H_{\text{DOI}}$)

Garante o princípio fundamental de confiabilidade acadêmica inegociável.

$$H_{\text{DOI}} = \frac{\text{DOIs Inválidos ou Inexistentes}}{\text{Total de DOIs Apresentados}} \times 100$$

- **Critério de Validação:** Cada DOI é checado via chamada programática na API da Crossref.
- **Meta Inegociável:** $H_{\text{DOI}} = 0.00\%$ (tolerância zero para citações inventadas).

---

### 2.4 Métrica 4: Concordância Inter-Avaliadores (Cohen's Kappa $\kappa$) na Auditoria de Risco de Viés

Mede a consistência na classificação de risco de viés metodológico (*Baixo Risco*, *Preocupações Algumas*, *Alto Risco*) entre a avaliação do `AuditorAgent` e o consenso dos revisores sêniores humanos.

$$\kappa = \frac{P_o - P_e}{1 - P_e}$$

- **$P_o$:** Proporção de concordância observada entre o agente e os especialistas humanos.
- **$P_e$:** Proporção de concordância esperada pelo acaso.
- **Interpretação (Landis & Koch):**
  - $\kappa < 0.40$: Concordância fraca
  - $0.40 \le \kappa \le 0.75$: Concordância moderada a boa
  - $\kappa > 0.75$: **Excelente concordância** (Nível de aprovação do CortexLab)
- **Meta de Aceitação:** $\kappa \ge 0.75$.

---

### 2.5 Métrica 5: Usabilidade e Carga Cognitiva Humana

| Instrumento de Avaliação | Metodologia | Meta de Aceitação |
| :--- | :--- | :--- |
| **System Usability Scale (SUS)** | Questionário padronizado de 10 perguntas (escala Likert 1-5), pontuado de 0 a 100. | **SUS Score $\ge 80.0$** (Classificação "Grade A / Excelente") |
| **NASA-TLX (Task Load Index)** | Mede o esforço mental, pressão temporal e frustração durante a revisão sistemática. | Redução de pelo menos **40% na demanda mental** reportada em relação ao processo manual |
| **User Trust Perception Index** | Pergunta pós-teste: *"Em uma escala de 1 a 10, o quanto a rastreabilidade do parágrafo aumentou sua segurança para assinar a revisão?"* | **Média $\ge 8.5 / 10$** |

---

## 3. Matriz de Coleta de Dados do Experimento

```csv
participant_id,group,field,papers_screened,time_minutes,tp_count,fp_count,fn_count,f1_score,kappa_score,sus_score,doi_hallucinations
P01,cortexlab,oncology,50,42.5,142,4,6,0.966,0.82,87.5,0
P02,control,oncology,50,138.0,135,11,15,0.912,0.78,62.5,0
```

---

## 4. Cronograma de Validação para a Residência em IA

| Semana | Atividade de Validação | Entregável Concreto |
| :--- | :--- | :--- |
| **Semana 5** | Criação do Corpus Padrão de 50 Artigos e Gabarito (*Ground Truth*) | Dataset validado por 2 PIs seniores |
| **Semana 7** | Teste Piloto com 2 Pesquisadores para ajuste de UX e prompt de auditoria | Relatório de ajustes rápidos e telemetria |
| **Semana 9** | Aplicação do Experimento Completo com os 20 pesquisadores | Gravações, logs de telemetria e CSV de tempos |
| **Semana 10** | Processamento Estatístico dos Dados (Teste t pareado, cálculo de Kappa e ANOVA) | Scripts R / Python com gráficos de significância |
| **Semana 11** | Redação do Artigo Científico da Residência em IA | Artigo formatado para periódico ou conferência (ex: ACM IUI / Nature Digital Medicine) |
| **Semana 12** | Defesa Final da Residência e Lançamento do Release Aberto no GitHub | Repositório público com dados de validação abertos |
