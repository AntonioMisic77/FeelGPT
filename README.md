# FeelGpt

> This project develops an AI-powered chatbot that adapts its communication style based on the user's emotional state, detected through real-time facial analysis using a webcam or selfie camera. By combining emotion detection with a large language model (LLM), the chatbot provides personalized responses, helping users better understand and manage their emotions while fostering emotional intelligence. The system integrates emotion-detection technology (visage|SDK FaceAnalysis) and enriched knowledge on emotions, allowing the chatbot to deliver more natural and empathetic conversations.


## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Introduction

This project aims to create an AI-powered chatbot that adapts its communication style based on the user’s emotional state, detected through facial analysis via a webcam or selfie camera. By combining emotion detection with a large language model (LLM), the chatbot provides personalized, empathetic responses to help users understand and manage their emotions, while fostering emotional intelligence.

Designed for anyone looking to improve emotional awareness, this tool can be used by individuals, educators, and mental health professionals. It leverages visage|SDK FaceAnalysis to detect real-time emotions and enhances the LLM’s responses using Retrieval-Augmented Generation (RAG) or prompt engineering with emotional intelligence resources. Ultimately, this project aims to create more natural, human-like interactions between AI and users.

---

## Installation

### Prerequisites
List the software or tools that need to be installed before setting up the project.
- [Node](https://nodejs.org/en/download/package-manager)
- [Docker](https://docs.docker.com/engine/install/)

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/AntonioMisic77/FeelGPT.git
    ```
2. Install dependencies:
    - For Node.js projects:
        ```bash
        npm install
        ```

3. Set up environment variables (if applicable). Example:
    ```bash
    export API_KEY=your_api_key
    ```

4. Run the project:
    - For development:
        ```bash
        npm start
        ```

---
## Usage

### Starting the Project
Include instructions on how to start the project, including running servers, services, or apps.

Example:
```bash
npm run dev
