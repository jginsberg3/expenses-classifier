# Budget Classifier Backend

This is the FastAPI backend for the Budget Classifier application. It serves a machine learning model (sklearn) to categorize text inputs (e.g., "Netflix subscription") into budget categories (e.g., "Entertainment").

## Features

*   **FastAPI**: High-performance, async Python web framework.
*   **scikit-learn**: Integration for ML model prediction.
*   **CORS Support**: Configured for secure frontend communication.
*   **Mock Mode**: Includes a mock classifier for development without the real model file.

## Prerequisites

*   **Python 3.12+**
*   **uv**: An extremely fast Python package installer and resolver. [Install uv](https://github.com/astral-sh/uv).

## Setup

1.  **Install Dependencies**:
    ```bash
    uv sync
    ```

2.  **Environment Variables**:
    Create a `.env` file in this directory (if it doesn't exist) and set your frontend URL:
    ```bash
    FRONTEND_URL=http://localhost:5173
    ```

## Running Locally

Start the development server:

```bash
uv run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Endpoints

### `POST /classify`

Classifies a text string into a budget category.

**Request:**
```json
{
  "text": "grocery shopping at whole foods"
}
```

**Response:**
```json
{
  "category": "Food & Dining",
  "confidence": 0.95
}
```

## Deployment

This project includes a `requirements.txt` exported from `uv` for compatibility with standard hosting providers like **Render**.

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```
