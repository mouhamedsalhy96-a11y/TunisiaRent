# TunisiaRent 🏠🇹🇳  
**A rental platform for short-term, long-term, and student housing across all cities/governorates in Tunisia.**

TunisiaRent is a modern marketplace where users can **browse and search rentals** and **publish their own listings**. Built as a portfolio project with a clean UI, authentication, a dashboard for managing listings, and a Supabase-powered backend (DB + Auth + Storage).

---

## ✨ Features

### 🔎 Browse & Search
- Browse listings across **all Tunisian governorates**
- Filter by rental type:
  - **Long-term** (months/years)
  - **Short-term** (vacations, short stays)
  - **Student** (near universities)
- Browse by categories (Apartment, House, Villa, Room, Studio)
- Listing details page with gallery + specs

### 📝 Publish Listings
- Authenticated users can publish a listing with:
  - title, description, price
  - category, region, address
  - rooms, bathrooms, surface area, furnished flag
  - photos (stored as URLs in `images[]`)

### 👤 Dashboard
- Manage your listings from a personal dashboard
- Quick stats (total, active, long-term, short-term)

### 🔐 Authentication & Privacy
- Sign up / login
- Protected routes (publish listing + dashboard)
- **Phone/email are hidden by default** and can be revealed only after login (UI + database policies when RLS is enabled)

---

## 🧰 Tech Stack
- **Next.js** (App Router)
- **Tailwind CSS**
- **Supabase** (Auth + Postgres + Storage)
- **lucide-react** (icons)

---

## 🗺️ Main Routes
- `/` — Home (hero + search + categories + regions)
- `/annonces` — Listings page (browse/search)
- `/annonces/[id]` — Listing details
- `/ajouter` — Publish a listing *(protected)*
- `/dashboard` — User dashboard *(protected)*
- `/connexion` — Login
- `/inscription` — Signup

---

## 🚀 Getting Started (Local)

### 1) Install dependencies
```bash
npm install
``