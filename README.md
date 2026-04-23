# 🌱 Farm2Feed

> **Connecting Kenyan Farmers Directly with Consumers — Powered by AI & M-Pesa**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-green?style=for-the-badge&logo=vercel)](https://farm2feed-ayrpccllu-ochiengclyntono-6558s-projects.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-purple?style=for-the-badge&logo=render)](https://farm2feed.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-Clyn1%2FFarm2feed-black?style=for-the-badge&logo=github)](https://github.com/Clyn1/Farm2feed)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Live URLs](#live-urls)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [M-Pesa Integration](#mpesa-integration)
- [AI Features](#ai-features)
- [Deployment](#deployment)
- [Test Accounts](#test-accounts)
- [Screenshots](#screenshots)
- [Team](#team)

---

## 🌍 About the Project

**Farm2Feed** is a full-stack web application built for **Technovation Girls 2025** that connects Kenyan farmers directly with consumers. It eliminates exploitative middlemen who take 30–40% of farmers' income, integrates AI-powered crop disease detection and market intelligence, and uses Safaricom's M-Pesa Daraja API for real mobile payments sent directly to farmers' phones.

---

## ❗ Problem Statement

Kenyan smallholder farmers face three critical challenges:

1. **Middlemen** take 30–40% of farm gate prices — farmers earn far less than their produce is worth
2. **Crop diseases** destroy harvests because detection comes too late and treatment advice is inaccessible
3. **No market visibility** — farmers don't know which crops are in demand or what prices to charge

Meanwhile, urban consumers pay inflated prices for produce that has passed through multiple hands, reducing freshness.

---

## ✅ Solution

Farm2Feed solves all three problems:

| Problem | Solution |
|---------|----------|
| Middlemen stealing income | Direct farmer-to-consumer marketplace with M-Pesa payments |
| Crop disease losses | AI-powered crop disease detection with treatment advice |
| No market knowledge | Market Intelligence AI with demand prediction & price suggestions |

---

## 🌐 Live URLs

| Service | URL |
|---------|-----|
| 🌍 Frontend | https://farm2feed-ayrpccllu-ochiengclyntono-6558s-projects.vercel.app |
| 🚀 Backend API | https://farm2feed.onrender.com |
| ❤️ Health Check | https://farm2feed.onrender.com/api/health |
| 📦 GitHub Repo | https://github.com/Clyn1/Farm2feed |

---

## ✨ Features

### 🔐 Authentication System
- User registration and login with role selection
- Two roles: **Farmer** and **Consumer**
- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT tokens** for secure session management
- Role-based access control — each role sees different features

### 🧑‍🌾 Farmer Dashboard
- **Overview** — stats: products listed, earnings, total orders
- **Add Product** — list produce with name, price, quantity, category, image upload
- **Crop AI** — upload crop photo for instant disease detection
- **Orders** — view all incoming orders and payment status

### 🛒 Consumer Marketplace
- Browse all products in a responsive grid layout
- Search by product name, farmer name, or location
- Filter by category: Vegetables, Fruits, Grains, Poultry, Dairy, Others
- Sort by price (low/high) or rating
- Pagination (12 products per page)

### 🤖 AI Crop Disease Detection
- Upload any crop photo
- AI returns:
  - Disease name (e.g. Early Blight, Leaf Rust, Powdery Mildew)
  - Confidence percentage (0–100%)
  - Severity level (None / Low / Moderate / High)
  - Detailed treatment recommendations
- Scan history saved to database

### 📈 Market Intelligence AI
- Live demand scores for 8 major Kenyan crops
- AI-suggested selling prices based on market trends
- 7-day price forecast bar charts
- Competition analysis
- Best time to sell recommendations
- 7 personalized farming tips

### 💳 M-Pesa Daraja API Payments
- Real STK Push integration with Safaricom
- Consumer enters phone number → receives PIN prompt on phone
- Backend polls payment status automatically
- M-Pesa receipt number stored with order
- Payment flow: Pending → Paid / Failed

### 📦 Order Tracking
- 4-stage order progress tracker:
  - Order Placed → Payment Confirmed → Being Prepared → Delivered
- M-Pesa receipt number displayed
- Direct call-to-farmer button
- Full order history with filter tabs

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| Vite | 5.1.0 | Build Tool |
| React Router DOM | 6.22.1 | Client-side Routing |
| Tailwind CSS | 3.4.1 | Styling |
| Axios | 1.6.7 | HTTP Client |
| React Context API | Built-in | State Management |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime |
| Express | 4.18.3 | Web Framework |
| MongoDB | 8.0 | Database |
| Mongoose | 8.2.1 | ODM |
| bcryptjs | 2.4.3 | Password Hashing |
| jsonwebtoken | 9.0.2 | Authentication |
| Multer | 1.4.5 | File Uploads |
| Axios | 1.6.7 | M-Pesa API calls |
| Morgan | 1.10.0 | HTTP Logging |
| Nodemon | 3.1.0 | Dev Server |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Railway | Backend hosting + MongoDB |
| GitHub | Version control |

---

## 📁 Project Structure

```
farm2feed/
├── frontend/                          # React + Vite application
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── Navbar.jsx             # Navigation with role-based links
│   │   │   ├── ProductCard.jsx        # Product display card
│   │   │   ├── PaymentModal.jsx       # M-Pesa STK Push modal
│   │   │   ├── CropDetector.jsx       # AI crop analysis UI
│   │   │   ├── AddProductForm.jsx     # Farmer product listing form
│   │   │   ├── Spinner.jsx            # Loading spinner
│   │   │   └── Footer.jsx             # Site footer
│   │   ├── pages/                     # Full page components
│   │   │   ├── Home.jsx               # Landing page
│   │   │   ├── Login.jsx              # Authentication - login
│   │   │   ├── Register.jsx           # Authentication - register
│   │   │   ├── Products.jsx           # Product marketplace
│   │   │   ├── ProductDetail.jsx      # Single product + buy flow
│   │   │   ├── FarmerDashboard.jsx    # Farmer management dashboard
│   │   │   ├── ConsumerDashboard.jsx  # Consumer order history
│   │   │   ├── MarketAI.jsx           # AI market intelligence
│   │   │   ├── MyOrders.jsx           # Consumer order list
│   │   │   ├── OrderTracking.jsx      # Order progress tracker
│   │   │   └── NotFound.jsx           # 404 page
│   │   ├── services/
│   │   │   ├── api.js                 # All Axios API calls
│   │   │   └── mockData.js            # Sample data
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # Authentication state
│   │   │   └── ToastContext.jsx       # Toast notifications
│   │   ├── App.jsx                    # Router + protected routes
│   │   ├── main.jsx                   # React entry point
│   │   └── index.css                  # Tailwind CSS directives
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── backend/                           # Node.js + Express API
    ├── server.js                      # Express app entry point
    ├── seed.js                        # Database seeder
    ├── config/
    │   ├── db.js                      # MongoDB connection
    │   └── multer.js                  # File upload configuration
    ├── models/
    │   ├── User.js                    # User schema
    │   ├── Product.js                 # Product schema
    │   ├── Order.js                   # Order schema
    │   └── CropScan.js                # AI scan results schema
    ├── controllers/
    │   ├── authController.js          # Register, login, profile
    │   ├── productController.js       # CRUD operations
    │   ├── cropController.js          # AI disease detection
    │   └── paymentController.js       # M-Pesa Daraja API
    ├── routes/
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   ├── cropRoutes.js
    │   └── paymentRoutes.js
    ├── middleware/
    │   ├── auth.js                    # JWT verification
    │   └── errorHandler.js            # Global error handler
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local) or MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone https://github.com/Clyn1/Farm2feed.git
cd Farm2feed
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

### 4. Seed the Database

```bash
cd backend
node seed.js
```

This creates 6 farmer accounts, 1 consumer account, and 16 products.

### 5. Open the App

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000/api/health
```

---

## ⚙️ Environment Variables

### Backend `.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/farm2feed

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# M-Pesa Daraja API (get from developer.safaricom.co.ke)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/callback
MPESA_BASE_URL=https://sandbox.safaricom.co.ke

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | JWT |
| PUT | `/api/auth/me` | Update profile | JWT |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| GET | `/api/products/my` | Get my products | Farmer |
| POST | `/api/products` | Create product | Farmer |
| PUT | `/api/products/:id` | Update product | Farmer |
| DELETE | `/api/products/:id` | Delete product | Farmer |

### AI Crop Detection
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/crop/analyze` | Analyze crop image | Farmer |
| GET | `/api/crop/history` | Get scan history | Farmer |

### Payments (M-Pesa)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/payments/stk-push` | Initiate payment | Consumer |
| POST | `/api/payments/callback` | M-Pesa callback | Public |
| GET | `/api/payments/status/:id` | Check status | JWT |
| GET | `/api/payments/orders` | Get my orders | JWT |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

---

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: 'farmer' | 'consumer',
  phone: String,
  location: String,
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  unit: String,
  quantity: Number,
  category: String,
  image: String,
  farmer: ObjectId (ref: User),
  location: String,
  phone: String,
  rating: Number,
  isAvailable: Boolean
}
```

### Order
```javascript
{
  consumer: ObjectId (ref: User),
  product: ObjectId (ref: Product),
  farmer: ObjectId (ref: User),
  quantity: Number,
  totalAmount: Number,
  phone: String,
  status: 'pending' | 'paid' | 'failed' | 'cancelled',
  payment: {
    transactionId: String,
    mpesaReceiptNumber: String,
    checkoutRequestId: String,
    paidAt: Date
  }
}
```

### CropScan
```javascript
{
  farmer: ObjectId (ref: User),
  image: String,
  result: {
    disease: String,
    confidence: Number,
    severity: 'None' | 'Low' | 'Moderate' | 'High',
    treatment: String,
    modelVersion: String
  }
}
```

---

## 📱 M-Pesa Integration

Farm2Feed uses the **Safaricom Daraja API** for real STK Push payments.

### Payment Flow
```
1. Consumer clicks "Buy Now"
2. Frontend sends { productId, phone } to backend
3. Backend generates OAuth token from Daraja API
4. Backend sends STK Push request to Safaricom
5. Safaricom sends PIN prompt to consumer's phone
6. Consumer enters M-Pesa PIN
7. Safaricom calls backend callback URL with result
8. Backend updates order status to "paid"
9. Frontend polls status → shows success + receipt
10. Farmer receives money directly in M-Pesa wallet
```

### Getting Daraja Credentials
1. Go to [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create account → Create App
3. Enable **Lipa Na M-Pesa Sandbox**
4. Copy Consumer Key and Consumer Secret
5. For production: apply for Go-Live approval

---

## 🤖 AI Features

### Crop Disease Detection
The AI analyzes crop images and detects:
- Early Blight (Alternaria solani)
- Leaf Rust (Puccinia triticina)
- Powdery Mildew
- Bacterial Wilt
- Cassava Mosaic Virus
- Healthy plants (no disease)

> **Note:** Current implementation uses a structured response engine. The architecture is designed to be swapped with a real ML model (TensorFlow, PyTorch, or Google Vision API) by replacing the `analyzeWithAI()` function in `cropController.js`.

### Market Intelligence AI
Provides analysis for 8 major Kenyan crops:
- Tomatoes, Maize, Avocados, Sukuma Wiki
- Potatoes, Mangoes, Eggs, Beans

Each analysis includes demand score, price forecast, market insight, competition level, and farming tips.

---

## 🚀 Deployment

### Frontend → Vercel
```bash
# In Vercel dashboard:
# Root Directory: frontend
# Build Command: npm run build
# Output Directory: dist
# Environment Variable: VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Railway
```bash
# In Railway dashboard:
# Root Directory: backend
# Start Command: node server.js
# Add all environment variables from .env
```

### Database → Railway MongoDB
Railway provides a built-in MongoDB service.
Copy the `MONGO_URL` from Railway MongoDB service → paste as `MONGO_URI` in backend variables.

---

## 🔑 Test Accounts

After running `node seed.js`:

| Role | Email | Password |
|------|-------|----------|
| Farmer | john@farm.com | 123456 |
| Farmer | mary@farm.com | 123456 |
| Farmer | peter@farm.com | 123456 |
| Consumer | alice@test.com | 123456 |

---

## 🔒 Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** tokens with 7-day expiry
- Role-based route protection
- Mongoose schema validation
- CORS whitelist protection
- Multer file type and size validation
- Environment variables for all secrets
- Global error handler prevents stack trace leaks

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

**NexTech** — Technovation Girls 2025

| Role | Responsibility |
|------|---------------|
| Full-Stack Developer | React, Node.js, MongoDB, M-Pesa API |
| AI Integration | Crop detection, Market intelligence |
| UI/UX Design | Tailwind CSS, Mobile-first design |
| Business Strategy | Market research, Business canvas |

---

## 🙏 Acknowledgements

- [Safaricom Daraja API](https://developer.safaricom.co.ke) — M-Pesa integration
- [KALRO](https://www.kalro.org) — Agricultural disease data
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Database hosting
- [Vercel](https://vercel.com) — Frontend deployment
- [Railway](https://railway.app) — Backend deployment
- [Technovation Girls](https://technovationchallenge.org) — Program inspiration

---

<div align="center">

**🌱 Farm2Feed — Farm Fresh, Delivered to You**

Made with ❤️ for Kenyan farmers

[Live Demo](https://farm2feed-ayrpccllu-ochiengclyntono-6558s-projects.vercel.app) · [Report Bug](https://github.com/Clyn1/Farm2feed/issues) · [Request Feature](https://github.com/Clyn1/Farm2feed/issues)

</div>
