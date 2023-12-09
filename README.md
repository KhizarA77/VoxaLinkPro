## VoxaLink Pro

This project is a comprehensive full-stack web application designed for food ordering. It integrates the power of ReactJS, NodeJS, and OracleDB to offer a seamless and interactive user experience.

## Getting Started

These instructions will guide you in setting up the project on your local machine for development and testing purposes.

### Prerequisites

Before starting, ensure you have the following installed:
- Node.js - Download and install from [Node.js](https://nodejs.org/)
- Python & PIP

### Installation

Follow these steps to set up your development environment:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KhizarA77/VoxaLinkPro.git
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```



4. **Configure Database Connection:**
   Edit the `connection.cjs` file in the server directory with your Postgres credentials.

5. **Start the Server:**
   ```bash
   cd server
   npm run start
   ```

6. **Start the Client:**
   In a new terminal window:
   ```bash
   cd client
   npm start
   ```

### Usage

With both the server and client running, the application can be accessed at `http://localhost:3000`.
