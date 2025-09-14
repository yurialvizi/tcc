# Backend — Projeto de Formatura (Grupo 6 — Poli USP)

Backend do projeto de formatura do **Grupo 6** (Yuri, Isabelle, Beatriz) — API em **Flask** que serve os modelos treinados, fornece métricas e endpoints de predição para o frontend.



## ✅ Funcionalidades principais

- Carregar modelos salvos (`.pkl`) e preditor de entrada.  
- Endpoints para obter métricas dos modelos.  
- Endpoints para fazer predições (simulação: dado um input, qual a resposta de cada modelo).  
- Servir plots/artefatos gerados.

## 📋 Pré-requisito

- **Python 3.9+**
- **pip** (gerenciador de pacotes Python)
- **Docker** (opcional, para containerização)
- É necessário ter a pasta `saved_models/` populada de maneira correta para que o backend funcione da forma esperada.
- Os modelos não estão incluídos no GitHub, por isso é preciso treinar os modelos localmente usando os notebooks da pasta `models/`.
- Siga as instruções no [README de Models](../models/README.md).

### Principais dependências
- Flask (framework web)
- Flask-CORS (CORS para frontend)
- pandas (manipulação de dados)
- scikit-learn (modelos ML)
- XGBoost (modelo de boosting)
- SHAP (explicabilidade)
- matplotlib (visualizações)


## ⚙️ Rodando localmente

1. Vá para a pasta do backend:
   ```bash
   cd backend
   ```

2. Crie e ative um ambiente virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate   # macOS / Linux
   venv\Scripts\activate      # Windows (cmd/powershell)
   ```

3. Instale dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Execute a aplicação:
   ```bash
   python app.py
   ```

A API ficará disponível em: `http://localhost:5001`


## 🐳 Rodando com Docker

> Certifique-se de que o `Dockerfile` e `requirements.txt` estão na pasta `backend/`.

1. Construa a imagem (executar dentro de `backend/`):
   ```bash
   docker build -t credit-api .
   ```

2. Rode o container (mapeando a porta 5001):
   ```bash
   docker run -d -p 5001:5001 --name credit-api credit-api
   ```

A API ficará disponível em: `http://localhost:5001`

### Outros comandos úteis com Docker

- **Ver logs do container:**
  ```bash
  docker logs credit-api
  ```

- **Acessar o terminal do container:**
  ```bash
  docker exec -it credit-api /bin/bash
  ```

- **Parar o container:**
  ```bash
  docker stop credit-api
  ```

- **Remover o container:**
  ```bash
  docker rm credit-api
  ```


- **Listar containers em execução:**
  ```bash
  docker ps
  ```

- **Listar todas as imagens:**
  ```bash
  docker images
  ```

- **Rebuild da imagem (caso altere o código):**
  ```bash
  docker build -t credit-api .
  ```



## 🔌 Endpoints

- `GET  /metrics`  
  → Retorna todas as métricas dos modelos.

- `GET  /metrics/<model_name>`  
  → Retorna métricas do modelo especificado (ex.: `random-forest`, `xg-boost`, `logistic-regression`, `mlp`).

- `POST /predict`  
  → Recebe JSON com os atributos do usuário e retorna a predição de todos os modelos (`bom` / `mau` pagador).

- `GET  /shap/plots/<model_name>`  
  → Retorna os gráficos SHAP (summary plot e feature importance) do modelo especificado, codificados em base64.

- `POST /shap/waterfall/<model_name>`  
  → Recebe um JSON com os atributos de um usuário e retorna o gráfico SHAP waterfall (base64) para a explicação individual da predição do modelo especificado.

- `GET /analyze`
  → Retorna uma análise exploratória dos dados usados para o treinamento dos modelos, incluindo contagem de amostras, distribuição de variáveis e outras estatísticas úteis para entender o perfil dos dados analisados neste trabalho.

- `GET  /`  
  → Endpoint simples para checagem ("health check") da API.

**Exemplo de payload para `/predict` ou `/shap/waterfall/<model_name>`:**

```json
{
    "sex": "female",
    "marrital_status": "divorced",
    "age": 58,
    "n_of_liables": 1,
    "job": "unskilled resident",
    "foreign_worker": 1,
    "present_employee_since": ">=7y",
    "telephone": 0,
    "housing": "for free",
    "present_residence_since": 4,
    "property": "unk. / no property",
    "checking_account": "< 0 DM",
    "savings": "<100 DM",
    "purpose": "used car",
    "credit_history": 5,
    "duration": 48,
    "credit_amount": 6416,
    "guarantors": null,
    "other_installment_plans": "bank",
    "credits_at_bank": 2
}
```


## 📁 Estrutura

```
backend/
├── app.py                 # App Flask
├── requirements.txt
├── Dockerfile
├── saved_models/          # .pkl dos modelos
├── utils/                 # preprocessamento, mappings, loader, predictor
└── README.md
```


