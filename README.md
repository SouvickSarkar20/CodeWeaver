# CodeWeaver 🕸️✨

> **Weaving your ideas into reality with AI.**
> An intelligent, browser-based full-stack website builder powered by Next.js, WebContainers, and LLMs.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3-black)
![React](https://img.shields.io/badge/React-19.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

---

## 🚀 Overview

**CodeWeaver** is an advanced AI development environment that allows you to build, edit, and deploy full-stack web applications directly from your browser. By combining the power of Large Language Models (LLMs) with **WebContainers** (WebAssembly-based Node.js), CodeWeaver offers a seamless experience where you can prompt an AI to generate code, and instantly see it running live.

Whether you're prototyping a new idea or building a complex dashboard, CodeWeaver handles the heavy lifting of project scaffolding and file management so you can focus on creativity.

## ✨ Key Features

*   **🤖 AI-Powered Generation**: Describe your application in natural language, and CodeWeaver will generate the file structure, dependencies, and code.
*   **⚡ WebContainers**: Run a full Node.js environment entirely in your browser. Install packages, run builds, and start dev servers without any local setup.
*   **📝 Interactive Editor**: A fully functional code editor (Monaco) with syntax highlighting, file explorer, and tabbed editing.
*   **👀 Live Preview**: See your changes instantly in a preview pane as you edit or as the AI generates code.
*   **💬 Chat Interface**: Iterative development through a chat interface. Ask for changes, fix bugs, or add new features conversationally.
*   **🎨 Modern Stack**: Built with Next.js 15, React 19, Tailwind CSS v4, and Lucide Icons.

## 🛠️ Tech Stack

*   **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Code Execution**: [WebContainer API](https://webcontainers.io/)
*   **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **AI Model**: [Groq](https://groq.com/) (Llama 3 70b)

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

*   Node.js 18+ installed
*   A [Groq API Key](https://console.groq.com/keys) (for the AI functionality)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SouvickSarkar20/CodeWeaver.git
    cd CodeWeaver
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Groq API key:
    ```bash
    GROQ_API_KEY=your_groq_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to start weaving code!

## 📖 Usage

1.  **Enter a Prompt**: On the home page, describe the website or application you want to build (e.g., "A personal portfolio with a dark theme" or "A task management dashboard").
2.  **Watch it Build**: CodeWeaver will generate the file structure and code.
3.  **Explore & Edit**: Use the file explorer to view the generated code. You can manually edit files in the editor.
4.  **Preview**: The application will automatically start in the preview pane.
5.  **Iterate**: Use the chat provided to ask for modifications (e.g., "Change the button color to blue" or "Add a contact form").

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ using Next.js and WebContainers.*
