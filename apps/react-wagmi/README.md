# React Wagmi App

This project was generated with [`@coinbase/create-cdp-app`](https://coinbase.github.io/cdp-web/modules/_coinbase_create-cdp-app.html) using the React template.

## Prerequisites

You will need Node.js v20 or higher and pnpm installed on your machine.

## Setting up the app

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Fetch your Project ID from [CDP Portal](https://portal.cdp.coinbase.com/) and update `VITE_CDP_PROJECT_ID` in `.env`.

   ```bash
   VITE_CDP_PROJECT_ID='your-project-id-here'
   ```

## Running the App

```bash
pnpm dev
```
