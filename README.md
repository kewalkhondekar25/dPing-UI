# dPing UI

Web app for creators and audience to connect via Solana. Creators set a DM price; audience pays to unlock direct messaging. Payments are recorded on-chain and reflected in dashboards and transaction history.

## Tech

- **React 19** + **Vite** + **TypeScript**
- **Solana** wallet (Wallet Adapter) for connect and payments
- **Tailwind CSS** + **shadcn/ui** (Radix)
- **Axios** with cookie-based auth and refresh-token handling

## Setup

1. **Dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Create a `.env` in the project root:

   ```
   VITE_API_URL=http://localhost:8080/api/v1
   ```

   Point this at your backend API base URL.

3. **Run**

   ```bash
   npm run dev
   ```

   App is served at `http://localhost:3000`.

## Scripts

| Command     | Description        |
| ----------- | ------------------ |
| `npm run dev`     | Start dev server    |
| `npm run build`   | Production build    |
| `npm run preview` | Preview production  |
| `npm run lint`    | TypeScript check    |

## Roles

- **Creator** — Register, set profile and DM price, connect wallet for payouts, view earnings and incoming transactions.
- **Audience** — Discover creators, pay SOL to unlock DMs, view active chats and payment history.

Auth uses access + refresh tokens stored in HTTP-only-style cookies; the client refreshes the access token on 401 via `POST /auth/refresh`.
