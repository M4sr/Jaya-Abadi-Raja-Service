# Jaya Service - AC Management & Booking System 🌬️🔧

A professional, full-stack management system designed for AC service businesses. This application provides a seamless experience for customers to book services, for technicians to manage their tasks, and for administrators to oversee the entire operation.

## 🚀 Key Features

### 👤 Admin Dashboard
- **Comprehensive Oversight**: Manage bookings, customers, technicians, and financial reports.
- **Service Management**: Easily add, edit, or remove service categories and pricing.
- **Content Management**: Built-in blog and gallery management for SEO and branding.
- **Settings**: Configure WhatsApp notifications, site metadata, and operational hours.

### 🛠️ Technician Portal
- **Real-time Tracking**: Live location updates for active bookings.
- **Task Management**: Update booking status from "On Process" to "Completed".
- **FCM Notifications**: Receive real-time push notifications for new assignments.

### 📱 Customer Experience
- **Easy Booking**: Simple, multi-step booking form.
- **Live Tracking**: Customers can track their technician's location in real-time.
- **Service Catalog**: Browse available services with clear pricing.
- **Responsive Design**: Premium UI optimized for both desktop and mobile devices.

---

## 💻 Tech Stack

- **Core**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MySQL](https://www.mysql.com/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Real-time**: [Pusher](https://pusher.com/) for location tracking
- **Notifications**: [Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Framer Motion](https://www.framer.com/motion/) animations
- **Maps**: [Leaflet](https://leafletjs.org/) / [Google Maps API](https://developers.google.com/maps)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- MySQL Server
- Firebase Project (for notifications)
- Pusher Account (for tracking)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/jaya-service.git
   cd jaya-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and fill in your credentials:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/jaya_service"
   NEXTAUTH_SECRET="your_secret_key"
   NEXTAUTH_URL="http://localhost:3000"

   # Firebase
   FIREBASE_PROJECT_ID="..."
   FIREBASE_CLIENT_EMAIL="..."
   FIREBASE_PRIVATE_KEY="..."

   # Pusher
   PUSHER_APP_ID="..."
   NEXT_PUBLIC_PUSHER_KEY="..."
   PUSHER_SECRET="..."
   NEXT_PUBLIC_PUSHER_CLUSTER="..."
   ```

4. **Database Setup**
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 📡 Deployment (aaPanel/Ubuntu)

1. **Build the project locally**
   ```bash
   npm run build
   ```
2. **Upload** the `.next`, `public`, `package.json`, and `.env` files to the server.
3. **Install production dependencies** on the server:
   ```bash
   npm install --production
   ```
4. **Setup Node.js Project** in aaPanel pointing to `npm run start`.
5. **Configure Reverse Proxy** to point your domain to the application port (default: 3000).

---

## 📂 Project Structure

- `src/app`: Next.js App Router (Pages & API Routes)
- `src/components`: Reusable UI components
- `src/lib`: Utilities and shared logic (Prisma, Firebase, etc.)
- `src/types`: TypeScript definitions
- `prisma`: Database schema and seeding scripts
- `public`: Static assets (Images, Icons)

---

## 📄 License

Internal project for **PT. Jaya Abadi Raja Service**. All rights reserved.

---

Created with ❤️ by [Abdul Rahman]
