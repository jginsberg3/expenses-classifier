# Expenses Classifier

An AI-powered web application that automatically categorizes budget entries. Simply paste your expenses, let the machine learning model classify them, and download the results as a CSV.

![Architecture Overview](https://img.shields.io/badge/Architecture-FastAPI_%2B_React-blue)
![ML](https://img.shields.io/badge/ML-Scikit--Learn-green)

## Project Overview

This repository contains both the frontend and backend components of the Expenses Classifier:

- **[Frontend](./frontend)**: A modern React application built with Vite and custom Vanilla CSS.
- **[Backend](./backend)**: A FastAPI server that utilizes a Scikit-learn model for expense categorization.

## Key Features

- **Automated Categorization**: Uses a trained ML model to assign categories to text-based expense entries.
- **Interactive UI**: Manually override AI predictions via a simple dropdown.
- **Data Portability**: Export your categorized expenses directly to a CSV file.
- **Mobile First**: Fully responsive design optimized for various screen sizes.

## Getting Started

To get the project running locally, please follow the setup instructions in the respective directories:

1.  **Backend**: Follow the [Backend README](./backend/README.md) to set up the Python environment and ML model.
2.  **Frontend**: Follow the [Frontend README](./frontend/README.md) to set up the React dev server and environment variables.

## License

MIT
