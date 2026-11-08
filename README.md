# NetOps Portal — Web GUI

Web GUI (remote-control dashboard) untuk **NetOps Portal** — mengelola server Linux VPN,
layanan L2TP/WireGuard/Port Forwarding, infrastruktur, tugas harian, pengguna, dan audit log.

Dibangun di atas template **NextAdmin v2** (Next.js 16 + Tailgrids UI + React Aria), lalu
dimodifikasi penuh untuk kebutuhan NetOps.

> Repositori ini **terpisah** dari repo utama NetOps Portal (backend, agent, vpn-manager).

---

## Stack

- Next.js 16 (App Router, Turbopack) + React 19
- Tailwind CSS 4 + semantik design token Tailgrids
- TanStack Query v5 (data fetching/caching)
- react-aria-components, Sonner (toast), `@xterm/xterm` (Web Terminal)

---

## Prasyarat

- Node.js 22 LTS
- Backend NetOps Portal berjalan (default `http://localhost:3000/api`)

---

## Konfigurasi

Buat `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

> Web Terminal memakai WebSocket ke `ws://<host-backend>/api/ws/terminal` (diturunkan
> otomatis dari `NEXT_PUBLIC_API_BASE_URL`).

---

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3001
# produksi
npm run build && npm run start
```

Login memakai akun backend (hasil seed: `admin@netops.local` / `admin123`).
Fitur **Servers** (setup server & terminal) hanya untuk role `super_admin`.

---

## Halaman utama

| Route | Fungsi |
| ----- | ------ |
| `/` | Dashboard ringkas |
| `/vpn/*` | Services, L2TP Users, WireGuard Peers, Port Forwards |
| `/daily-tasks` | Tugas harian |
| `/servers` | Registry server Linux + uji SSH/agent + setup agent |
| `/servers/[id]/terminal` | Web Terminal (CLI di browser) |
| `/pop`, `/otb`, `/cores`, `/clients` | Infrastruktur |
| `/users`, `/settings`, `/audit` | Sistem |

---

## Push ke GitHub (repo ini terpisah)

```bash
git remote add origin https://github.com/<user>/netops-portal-gui.git
git push -u origin main
```

Atau dari folder induk, jalankan `../save-to-github.ps1` (menyimpan kedua repo).

---

## Kredit

Berbasis template open-source [NextAdmin](https://github.com/NextAdminHQ/nextjs-admin-dashboard).
