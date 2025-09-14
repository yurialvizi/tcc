# Projeto de Formatura 2025 — Grupo 6 - Engenharia de Computação — Poli USP

Este repositório contém o trabalho de formatura do **Grupo 6** de 2025, composto por **Yuri, Isabelle e Beatriz**, do curso de **Engenharia de Computação da Escola Politécnica da USP**.  

## 📌 Descrição do Projeto

O objetivo deste trabalho é realizar uma **análise comparativa entre os principais algoritmos de machine learning e redes neurais aplicados ao processo de concessão de crédito para pessoas físicas**.  

O projeto foi estruturado em três grandes etapas:  

1. **Pré-processamento e análise exploratória dos dados**:  
   - Tratamento do conjunto de dados utilizado.  
   - Garantia de consistência e qualidade das informações.  

2. **Treinamento de modelos**:  
   - Diferentes algoritmos de classificação foram treinados individualmente.  
   - Métricas de desempenho foram extraídas para avaliação comparativa.  

3. **Análise comparativa com ATAM (Architecture Tradeoff Analysis Method)**:  
   - Comparação abrangente dos modelos.  
   - Consideração de desempenho, aspectos técnicos e operacionais no contexto de concessão de crédito.


A fim de expor os resultados e ilustrar como diferentes algoritmos de Inteligência Artificial podem ser usados num cenário de concessão de crédito para pessoas físicas, o grupo também propõe uma plataforma web, cujo código pode ser encontrado neste repositório.

## 📂 Estrutura do Repositório


- **`models/`**  
  Contém os códigos de treinamento dos modelos de machine learning e redes neurais, além das métricas obtidas.  

- **`backend/`**  
  API desenvolvida em Flask, responsável por:  
  - Expor as métricas de desempenho dos modelos.
  - Disponibilizar os modelos treinados para receber dados de entrada e gerar previsões.
  - Integrar com o frontend, permitindo que usuários façam simulações de análise de crédito.

- **`frontend/`**  
  Aplicação web desenvolvida em React, responsável por:  
  - Apresentar os resultados obtidos.  
  - Permitir a simulação da análise comparativa dos modelos (entrada de dados de um usuário e retorno da classificação de cada algoritmo — **bom ou mau pagador**).  

Cada uma dessas pastas contém seu próprio **README** com instruções detalhadas de instalação, configuração e execução.  



## 🚀 Como rodar o projeto

Para informações sobre como executar cada parte do sistema:  

- [Frontend](./frontend/README.md)  
- [Backend](./backend/README.md)  
- [Models](./models/README.md)  



## 👥 Alunos

- **Yuri de Sene Alvizi**  
- **Isabelle Ritter Vargas**  
- **Beatri Pama de Vasconcelos**  

---

⚡️ Esse projeto representa a consolidação dos conhecimentos adquiridos durante a graduação e aplica conceitos de **machine learning, engenharia de software, arquitetura de sistemas e análise de trade-offs** em um problema real de relevância prática: a concessão de crédito.  
