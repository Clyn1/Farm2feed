📌 Table of Contents

About the Project
Problem Statement
Solution
Live URLs
Features
Tech Stack
Project Structure
Getting Started
Environment Variables
API Endpoints
Database Models
M-Pesa Integration
AI Features
Deployment
Test Accounts
Screenshots
Team


🌍 About the Project
Farm2Feed is a full-stack web application built for Technovation Girls 2025 that connects Kenyan farmers directly with consumers. It eliminates exploitative middlemen who take 30–40% of farmers' income, integrates AI-powered crop disease detection and market intelligence, and uses Safaricom's M-Pesa Daraja API for real mobile payments sent directly to farmers' phones.

❗ Problem Statement
Kenyan smallholder farmers face three critical challenges:

Middlemen take 30–40% of farm gate prices — farmers earn far less than their produce is worth
Crop diseases destroy harvests because detection comes too late and treatment advice is inaccessible
No market visibility — farmers don't know which crops are in demand or what prices to charge

Meanwhile, urban consumers pay inflated prices for produce that has passed through multiple hands, reducing freshness.

✅ Solution
Farm2Feed solves all three problems:
ProblemSolutionMiddlemen stealing incomeDirect farmer-to-consumer marketplace with M-Pesa paymentsCrop disease lossesAI-powered crop disease detection with treatment adviceNo market knowledgeMarket Intelligence AI with demand prediction & price suggestions

🌐 Live URLs
ServiceURL🌍 Frontendhttps://farm2feed-ayrpccllu-ochiengclyntono-6558s-projects.vercel.app🚀 Backend APIhttps://farm2feed.onrender.com❤️ Health Checkhttps://farm2feed.onrender.com/api/health📦 GitHub Repohttps://github.com/Clyn1/Farm2feed

✨ Features
🔐 Authentication System

User registration and login with role selection
Two roles: Farmer and Consumer
Passwords hashed with bcrypt (12 salt rounds)
JWT tokens for secure session management
Role-based access control — each role sees different features

🧑‍🌾 Farmer Dashboard

Overview — stats: products listed, earnings, total orders
Add Product — list produce with name, price, quantity, category, image upload
Crop AI — upload crop photo for instant disease detection
Orders — view all incoming orders and payment status

🛒 Consumer Marketplace

Browse all products in a responsive grid layout
Search by product name, farmer name, or location
Filter by category: Vegetables, Fruits, Grains, Poultry, Dairy, Others
Sort by price (low/high) or rating
Pagination (12 products per page)

🤖 AI Crop Disease Detection

Upload any crop photo
AI returns:

Disease name (e.g. Early Blight, Leaf Rust, Powdery Mildew)
Confidence percentage (0–100%)
Severity level (None / Low / Moderate / High)
Detailed treatment recommendations


Scan history saved to database

📈 Market Intelligence AI

Live demand scores for 8 major Kenyan crops
AI-suggested selling prices based on market trends
7-day price forecast bar charts
Competition analysis
Best time to sell recommendations
7 personalized farming tips

💳 M-Pesa Daraja API Payments

Real STK Push integration with Safaricom
Consumer enters phone number → receives PIN prompt on phone
Backend polls payment status automatically
M-Pesa receipt number stored with order
Payment flow: Pending → Paid / Failed

📦 Order Tracking

4-stage order progress tracker:

Order Placed → Payment Confirmed → Being Prepared → Delivered


M-Pesa receipt number displayed
Direct call-to-farmer button
Full order history with filter tabs


🛠 Tech Stack
Frontend
TechnologyVersionPurposeReact18.2.0UI FrameworkVite5.1.0Build ToolReact Router DOM6.22.1Client-side RoutingTailwind CSS3.4.1StylingAxios1.6.7HTTP ClientReact Context APIBuilt-inState Management
Backend
TechnologyVersionPurposeNode.js20.xRuntimeExpress4.18.3Web FrameworkMongoDB8.0DatabaseMongoose8.2.1ODMbcryptjs2.4.3Password Hashingjsonwebtoken9.0.2AuthenticationMulter1.4.5File UploadsAxios1.6.7M-Pesa API callsMorgan1.10.0HTTP LoggingNodemon3.1.0Dev Server
Deployment
ServicePurposeVercelFrontend hostingRailwayBackend hosting + MongoDBGitHubVersion control

📁 Project Structure
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

🚀 Getting Started
Prerequisites

Node.js 18+
npm or yarn
MongoDB (local) or MongoDB Atlas account

1. Clone the Repository
bashgit clone https://github.com/Clyn1/Farm2feed.git
cd Farm2feed
2. Setup Backend
bashcd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
3. Setup Frontend
bashcd frontend
npm install
Create frontend/.env:
envVITE_API_URL=http://localhost:5000/api
bashnpm run dev
4. Seed the Database
bashcd backend
node seed.js
This creates 6 farmer accounts, 1 consumer account, and 16 products.
5. Open the App
Frontend: http://localhost:5173
Backend:  http://localhost:5000/api/health

⚙️ Environment Variables
Backend .env
env# Server
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
Frontend .env
envVITE_API_URL=http://localhost:5000/api

📡 API Endpoints
Authentication
MethodEndpointDescriptionAccessPOST/api/auth/registerRegister new userPublicPOST/api/auth/loginLogin userPublicGET/api/auth/meGet current userJWTPUT/api/auth/meUpdate profileJWT
Products
MethodEndpointDescriptionAccessGET/api/productsGet all productsPublicGET/api/products/:idGet single productPublicGET/api/products/myGet my productsFarmerPOST/api/productsCreate productFarmerPUT/api/products/:idUpdate productFarmerDELETE/api/products/:idDelete productFarmer
AI Crop Detection
MethodEndpointDescriptionAccessPOST/api/crop/analyzeAnalyze crop imageFarmerGET/api/crop/historyGet scan historyFarmer
Payments (M-Pesa)
MethodEndpointDescriptionAccessPOST/api/payments/stk-pushInitiate paymentConsumerPOST/api/payments/callbackM-Pesa callbackPublicGET/api/payments/status/:idCheck statusJWTGET/api/payments/ordersGet my ordersJWT
Health
MethodEndpointDescriptionGET/api/healthServer health check

🗄️ Database Models
User
javascript{
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: 'farmer' | 'consumer',
  phone: String,
  location: String,
  createdAt: Date
}
Product
javascript{
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
Order
javascript{
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
CropScan
javascript{
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

📱 M-Pesa Integration
Farm2Feed uses the Safaricom Daraja API for real STK Push payments.
Payment Flow
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
Getting Daraja Credentials

Go to developer.safaricom.co.ke
Create account → Create App
Enable Lipa Na M-Pesa Sandbox
Copy Consumer Key and Consumer Secret
For production: apply for Go-Live approval


🤖 AI Features
Crop Disease Detection
The AI analyzes crop images and detects:

Early Blight (Alternaria solani)
Leaf Rust (Puccinia triticina)
Powdery Mildew
Bacterial Wilt
Cassava Mosaic Virus
Healthy plants (no disease)


Note: Current implementation uses a structured response engine. The architecture is designed to be swapped with a real ML model (TensorFlow, PyTorch, or Google Vision API) by replacing the analyzeWithAI() function in cropController.js.

Market Intelligence AI
Provides analysis for 8 major Kenyan crops:

Tomatoes, Maize, Avocados, Sukuma Wiki
Potatoes, Mangoes, Eggs, Beans

Each analysis includes demand score, price forecast, market insight, competition level, and farming tips.

🚀 Deployment
Frontend → Vercel
bash# In Vercel dashboard:
# Root Directory: frontend
# Build Command: npm run build
# Output Directory: dist
# Environment Variable: VITE_API_URL=https://your-backend.onrender.com/api
Backend → Railway
bash# In Railway dashboard:
# Root Directory: backend
# Start Command: node server.js
# Add all environment variables from .env
Database → Railway MongoDB
Railway provides a built-in MongoDB service.
Copy the MONGO_URL from Railway MongoDB service → paste as MONGO_URI in backend variables.

🔑 Test Accounts
After running node seed.js:
RoleEmailPasswordFarmerjohn@farm.com123456Farmermary@farm.com123456Farmerpeter@farm.com123456Consumeralice@test.com123456

🔒 Security

Passwords hashed with bcrypt (12 salt rounds)
JWT tokens with 7-day expiry
Role-based route protection
Mongoose schema validation
CORS whitelist protection
Multer file type and size validation
Environment variables for all secrets
Global error handler prevents stack trace leaks


🤝 Contributing

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request


📄 License
This project is licensed under the MIT License.

👥 Team
NexTech — Technovation Girls 2025
RoleResponsibilityFull-Stack DeveloperReact, Node.js, MongoDB, M-Pesa APIAI IntegrationCrop detection, Market intelligenceUI/UX DesignTailwind CSS, Mobile-first designBusiness StrategyMarket research, Business canvas

🙏 Acknowledgements

Safaricom Daraja API — M-Pesa integration
KALRO — Agricultural disease data
MongoDB Atlas — Database hosting
Vercel — Frontend deployment
Railway — Backend deployment
Technovation Girls — Program inspiration


<div align="center">
🌱 Farm2Feed — Farm Fresh, Delivered to You
Made with ❤️ for Kenyan farmers
Live Demo · Report Bug · Request Feature
</div>
