# FeelGpt

> This project develops an AI-powered chatbot that adapts its communication style based on the user's emotional state, detected through real-time facial analysis using a webcam or selfie camera. By combining emotion detection with a large language model (LLM), the chatbot provides personalized responses, helping users better understand and manage their emotions while fostering emotional intelligence. The system integrates emotion-detection technology (visage|SDK FaceAnalysis) and enriched knowledge on emotions, allowing the chatbot to deliver more natural and empathetic conversations.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#installation)

---

## Introduction

This project aims to create an AI-powered chatbot that adapts its communication style based on the user’s emotional state, detected through facial analysis via a webcam or selfie camera. By combining emotion detection with a large language model (LLM), the chatbot provides personalized, empathetic responses to help users understand and manage their emotions, while fostering emotional intelligence.

Designed for anyone looking to improve emotional awareness, this tool can be used by individuals, educators, and mental health professionals. It leverages visage|SDK FaceAnalysis to detect real-time emotions and enhances the LLM’s responses using Retrieval-Augmented Generation (RAG) or prompt engineering with emotional intelligence resources. Ultimately, this project aims to create more natural, human-like interactions between AI and users.

---

## Installation

### Prerequisites

- [Node](https://nodejs.org/en/download/package-manager)
- [Docker](https://docs.docker.com/engine/install/)

### Enviornment variables

To set up the backend, you'll need the following environment variables:

| Variable name | Value |
| --- | --- |
|AZURE_PHI_ENDPOINT|YOUR_AZURE_PHI_ENDPOINT|
|AZURE_PHI_API_KEY|YOUR_AZURE_PHI_API_KEY|

### Docker setup

1. **Clone the repository**

```bash
git clone https://github.com/AntonioMisic77/FeelGPT.git
```

2. **Navigate to the project root**

```bash
cd FeelGPT
```

3. **Build and start the containers**

- Setup the MongoDb database first
```bash
docker compose -f docker-compose.db.yaml up
```

- Development enviorment
```bash
docker compose -f docker-compose.dev.yaml up
```

- Production enviorment

```bash
docker compose -f docker-compose.prod.yaml up
```

5. **Access the application**
   The frontend will be available at http://localhost:3001.
   The backend API will be available at http://localhost:5001.
