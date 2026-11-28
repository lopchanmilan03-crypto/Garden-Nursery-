# Garden Restaurant — cafe ops

Staff-only phone app for **Garden Restaurant** (Lazimpat, Kathmandu).

## Enter

Tap a role on `/` (Owner · Staff · Kitchen). No passwords — the server sets an httpOnly role cookie; `proxy` gates protected routes.

| Role | Home |
| --- | --- |
| Owner | `/admin` — dash, bills, payables, expenses, reports, stock, attendance |
| Staff | `/employee` — order → kitchen, stock, shift, bills |
| Kitchen | `/kitchen` — live board + stock alerts |

Owner can open Floor and Kitchen. Demo data in **NPR**, timezone **Asia/Kathmandu**, client state in `localStorage` (`garden-restaurant-ops-v5`).

## Scripts

```bash
npm run dev
npm run build
npm start
```
