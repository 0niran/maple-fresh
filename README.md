# 🍁 MapleFresh - Home & Business Services

A modern, conversion-optimized website for MapleFresh, a professional home and business services company serving Brantford, Ontario.

## ✨ Features

### 🎯 **Conversion-Optimized Design**
- Single, prominent "Get Free Quote" CTA strategy
- Clean navigation without competing buttons
- Mobile-first responsive design
- Professional trust indicators

### 🏠 **Service Categories**
- **Moving Services** - Professional residential & commercial moving
- **Cleaning Services** - Deep cleaning, maintenance, move-in/out services  
- **Handyman Services** - Home repairs, installations, maintenance

### 📦 **Value Packages**
- **First Day Perfect** - Starter package for condos & smaller homes
- **Complete Move-In Solution** - Premium package for larger homes
- **Luxury Relocation** - Executive white-glove service
- **Premium Care Membership** - Ongoing maintenance plans

### 🚀 **Technical Features**
- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS v4** with custom design system
- **Prisma** database with SQLite for bookings/quotes
- **React Hook Form** with Zod validation
- **Responsive Design** optimized for all devices
- **Performance Optimized** with modern best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Prisma + SQLite
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Deployment**: Netlify Ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maple-fresh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
maple-fresh/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── services/           # API services
│   └── types/              # TypeScript type definitions
├── prisma/                 # Database schema & migrations
└── public/                 # Static assets
```

## 🎨 Key Components

### **Hero Section**
- Conversion-optimized single CTA
- Professional service showcase
- Trust indicators and features

### **Navigation**
- Clean, minimal design
- Right-aligned navigation links
- Mobile-responsive hamburger menu

### **Quote Form**
- Multi-step wizard interface
- Real-time quote calculation
- Form validation with Zod

### **Service Packages**
- Value proposition cards
- Pricing comparison
- Feature highlights

## 🚀 Deployment

### **Netlify (Recommended)**

1. **Connect to Netlify**
   - Sign up at [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Configure build settings

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   - Set any required environment variables in Netlify dashboard

## 📊 Performance Features

- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic route-based splitting
- **CSS Optimization** - Tailwind CSS purging
- **Font Optimization** - Google Fonts with display=swap

## 📞 Contact

**MapleFresh Services**
- 📧 Email: hello@maplefresh.ca  
- 📱 Phone: (519) 123-4567
- 📍 Location: Brantford, Ontario, Canada

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

🤖 *Generated with [Claude Code](https://claude.ai/code)*
