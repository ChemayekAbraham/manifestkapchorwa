# Manifest Kapchorwa — Church Ministry Management Platform

A modern, high-performance, mobile-first web application and administrative portal for **Manifest Kapchorwa**, serving Kapchorwa Municipality and the greater Sebei sub-region in Eastern Uganda.


## 🛠 Technology Stack

* **Framework**: Next.js 15 (App Router with Turbopack, React Server Components & Route Handlers)
* **Language**: TypeScript 5 (Strict Mode)
* **Styling**: Tailwind CSS (Tailored highland earth-tone palette: Deep Green, Highland Olive, Clay, and Warm Cream)
* **Database & ORM**: PostgreSQL via Prisma ORM v6
* **Authentication**: Credentials authentication with Auth.js / JWT sessions & bcrypt password hashing
* **Validation**: Zod schema validation
* **Reporting & Exports**: Native CSV, ExcelJS, jsPDF + AutoTable
* **Testing**: Vitest suite (15/15 unit & validation tests passing)


## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.18+ or v20+ / v22+
* **PostgreSQL**: Local PostgreSQL, Neon, or Supabase

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd manifest-kapchorwa

# Install dependencies
npm install
```


### Database Setup & Seeding
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npx prisma db push

# Seed database with initial administrators, sample events, devotions & content
npm run db:seed
```

### Running & Testing
```bash
# Start Development Server (with Turbopack)
npm run dev

# Run Automated Test Suite
npm test

# Typecheck
npm run typecheck

# Production Build
npm run build
npm start
```