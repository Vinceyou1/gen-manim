# Gen-Manim (Generative Manim)

An AI-powered application that generates educational videos using [Manim](https://www.manim.community/) based on natural language prompts. It leverages the [Vercel AI SDK](https://sdk.vercel.ai/docs) and Google's Gemini models to plan, script, and render mathematical animations with voiceovers.

## Demo

<video src="public/example.mp4" controls width="100%"></video>

[Download Example Video](public/example.mp4)

## Features

- **Natural Language to Video**: Transform text prompts into animated math videos.
- **Chain-of-Thought Reasoning**: Uses Gemini's thinking capabilities to plan educational content effectively.
- **Video Improvement Loop**: Interactive feedback loop allowing users to "Improve" generated videos by feeding them back into the context.
- **Voiceover Support**: Automatically adds voiceovers to animations using `manim-voiceover` and gTTS.
- **Interactive Chat Interface**: Built with Shadcn UI and `ai-elements` for a seamless conversational experience.

## Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS, Shadcn UI
- **AI**: Vercel AI SDK v5, Google Gemini
- **Video Engine**: Manim Community (Python)
- **TTS**: `manim-voiceover` with Google TTS (gTTS)

## Prerequisites

Before running the project, ensure you have the following installed:

1.  **Node.js**: Version 18+ (pnpm recommended)
2.  **Python**: Version 3.10 or higher
3.  **System Dependencies** (for Manim):
    - `ffmpeg`
    - `latex` (TexLive or BasicTex)
    - `libcairo2`, `libpango1.0` (see [Manim Installation Guide](https://docs.manim.community/en/stable/installation.html))

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/gen-manim.git
cd gen-manim
```

### 2. Install Node Dependencies

```bash
pnpm install
```

### 3. Set up Python Environment

It is recommended to use a virtual environment to manage Python dependencies.

```bash
# Create a virtual environment named 'venv'
python3 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

### 4. Install Python Dependencies

With the virtual environment activated, install the required packages:

```bash
pip install manim manim-voiceover[gtts]
```

### 5. Configure Environment Variables

Create a `.env` file in the root directory and add your Google AI API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

### 6. Run the Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/api/chat`: Next.js Route Handler for the AI chat endpoint.
- `components/`: React components (Chat interface, Video display, etc.).
- `lib/`: Utility functions and tools (Manim runner, AI tools).
- `public/`: Static assets and generated videos.

## Usage

1.  Enter a prompt like "Explain the Pythagorean theorem" in the chat.
2.  The AI will plan the lecture and generate a video.
3.  Once generated, you can watch the video directly in the chat.
4.  Click the **"Improve"** button on the video card to attach it to your next message and ask for specific changes (e.g., "Fix the alignment of the triangle").
