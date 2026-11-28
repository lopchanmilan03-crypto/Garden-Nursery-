# Garden Restaurant — cafe ops

Staff-only phone app for **Garden Restaurant** (Lazimpat, Kathmandu).

## Roles

| Login | Password | Home |
| --- | --- | --- |
| `owner` | `owner` | Admin dashboard, payables, expenses, bills, reports, stock, attendance |
| `staff` | `staff` | Take orders → kitchen, stock, shift, open bills |
| `kitchen` | `kitchen` | Live board + stock alerts |

Owner can open Floor and Kitchen too. Demo data in **NPR**, timezone **Asia/Kathmandu**, synced via `localStorage` (`garden-restaurant-ops-v4`).

## Scripts

```bash
npm run dev
npm run build
npm start
```
