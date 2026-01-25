# Expenses Classifier Frontend

This is the React-based frontend for the **Expenses Classifier** application. It provides a modern, responsive interface for users to paste budget entries, categorize them using an AI-powered backend, and manage the results.

## Features

- **AI-Powered Classification**: Sends your text entries to the backend for automatic categorization.
- **Glassmorphism Design**: A sleek, modern UI with vibrant gradients and interactive elements.
- **Dynamic Category Editing**: Manually adjust categories using a dropdown menu if the AI needs a correction.
- **CSV Export**: Download your categorized results as a `.csv` file for use in spreadsheet applications.
- **Clear & Reset**: Easily clear your entries and results to start a new batch.

## Tech Stack

- **React 19**: Core UI library.
- **Vite**: Ultra-fast build tool and dev server.
- **Vanilla CSS**: Custom-built design system for maximum performance and visual precision.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in this directory and specify the API URL:
   ```bash
   VITE_API_URL=http://localhost:8000
   ```

   See the `.env.example` file as an example.

## Running Locally

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment

**Build Command**:
```bash
npm run build
```

**Output Directory**: `dist`
