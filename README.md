# PokerDraws

> A real-time Planning Poker web app with beautiful card animations, zero-friction room creation, and instant collaboration.

PokerDraws is a modern, responsive Planning Poker application designed for agile teams. It features a polished UI/UX with smooth animations, real-time updates using PartyKit, and a serverless architecture that requires no database setup.

## Features

- **Real-time Collaboration**: Instant updates for all participants using PartyKit.
- **Beautiful Animations**: Smooth card flips, deals, and interactions powered by Framer Motion.
- **Zero Friction**: capabilities to create a room instantly, share a link, and start estimating.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices.
- **No Database Needed**: Room state is handled in-memory at the edge.
- **Up to 20 Participants**: Supports medium to large teams.

## Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Real-time**: [PartyKit](https://partykit.io/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/flup-repo/pokerdraws.git
   cd pokerdraws
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the application locally, you need to start both the frontend dev server and the PartyKit server.

1. Start the frontend:
   ```bash
   npm run dev
   ```

2. Start the PartyKit server (in a separate terminal):
   ```bash
   npx partykit dev
   ```

Open your browser and navigate to the URL shown by Vite (usually `http://localhost:5173`).

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Copyright

Copyright (c) 2026 https://github.com/flup-repo/
