<div align="center">
  <img src="public/icon.png" alt="HOOD Logo" width="120" height="120" style="border-radius: 20px;" />
  
  # HOOD — Wear Your Identity
  
  **Premium limited streetwear. Designed by you. Paid with USDC on Base.**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Base](https://img.shields.io/badge/Base-Network-0052FF?style=for-the-badge&logo=base)](https://base.org/)
  [![Farcaster](https://img.shields.io/badge/Farcaster-Mini_App-8A2BE2?style=for-the-badge)](https://farcaster.xyz/)
</div>

---

## 🌌 The Vision

**HOOD** is not just an apparel brand; it is a movement that bridges the gap between digital identity and physical reality. We empower creators, communities, and individuals to wear their onchain identity with pride. 

By integrating seamlessly with the **Farcaster** ecosystem and the **Base** network, HOOD allows users to design premium, heavyweight cotton hoodies featuring their favorite NFTs, PFPs, or custom artwork, and check out instantly using USDC. 

This repository houses the entire HOOD storefront, designer canvas, and checkout flow, built as a high-performance Next.js application and optimized as a Farcaster Mini App.

---

## ✨ Key Features

### 🎨 The Designer Canvas
A professional-grade, interactive canvas that allows users to place text, artwork, and graphics exactly where they want them. Whether it is a front print, back print, or sleeve detail, the designer provides real-time previews of the final product.

### 🔗 Farcaster Integration
HOOD is built to live where the community lives. As a fully compliant Farcaster Mini App, users can launch the storefront directly from their Warpcast feed, connect their wallets, and pull their PFPs directly onto their custom apparel.

### ⚡ Crypto-Native Checkout
Frictionless payments powered by the Base network. Users pay exclusively in USDC, ensuring fast, low-cost, and globally accessible transactions. The checkout flow includes real-time transaction verification and automatic order generation upon confirmation.

### 🎟️ Advanced Coupon System
A robust, server-side validated coupon engine supporting percentage discounts, fixed amount reductions, and exclusive "Free Hoodie" drops where users only cover the shipping fee.

### 📦 Drop Mechanics
Built for scarcity. The platform supports limited-edition drops with real-time inventory tracking, ensuring that once a colorway or collection is sold out, it is gone forever.

---

## 🛠️ Tech Stack

HOOD is engineered for speed, security, and scalability, utilizing the best tools in the modern web ecosystem:

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Framer Motion
- **Database & Auth:** Supabase (PostgreSQL)
- **Web3 Integration:** Wagmi, Viem, and Farcaster Mini App SDK
- **State Management:** Zustand
- **Deployment:** Vercel

---

## 🚀 Getting Started

To run the HOOD storefront locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/bankrdex/HOODIE.git
cd HOODIE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and fill in your specific values:

```bash
cp .env.example .env.local
```

You will need to provide your Supabase URL and Anon Key, as well as your Farcaster account association details for local testing.

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 🗄️ Database Schema

The application relies on a structured PostgreSQL database hosted on Supabase. The schema includes tables for:

- `users`: User profiles and wallet associations.
- `products` & `product_variants`: Catalog management and inventory tracking.
- `orders` & `order_items`: Transaction history and fulfillment details.
- `coupons` & `coupon_uses`: Discount management and usage limits.

To initialize the database, execute the SQL commands found in `supabase/schema.sql` within your Supabase SQL editor.

---

## 🤝 Contributing

We welcome contributions from the community! Whether you are fixing a bug, optimizing the designer canvas, or adding new Web3 features, your input is valued.

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please ensure your code adheres to the existing TypeScript and ESLint configurations.

---

<div align="center">
  <p>Built with 🖤 for the onchain community.</p>
  <p>**More than clothes. It's a movement.**</p>
</div>
