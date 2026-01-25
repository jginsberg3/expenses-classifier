# Expenses Classifier Backend

This is the FastAPI backend for the Expenses Classifier application. It serves a machine learning model (sklearn) to categorize text inputs (e.g., "pizza delivery dinner") into budget categories (e.g., "Dining Out").

## Features

*   **FastAPI**: High-performance, async Python web framework.
*   **scikit-learn**: Integration for ML model prediction.
*   **CORS Support**: Configured for secure frontend communication.

## Prerequisites

*   **Python 3.10+**
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
    See the `.env.example` file as an example.

## Running Locally

Start the development server:

```bash
uv run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Endpoints

### `POST /classify`

Takes a series of budget entries as a single text string (split onto multiple lines) and returns a parsed dataset including a budget category for each.

**Request:**
```json
{
  "text": "- 1/19 $15.38 cafe coffee and breakfast"
}
```

**Response:**
```json
{
  "items": [
    {
      "date": "1/19",
      "category": "Food & Dining",
      "cost": 15.38,
      "desc": "cafe coffee and breakfast"
    }
  ]
}
```

## Running in Production

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0
```
