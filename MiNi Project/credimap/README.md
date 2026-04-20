# Credimap

Credimap is an advanced AI-powered fraud detection and financial risk analysis platform designed to identify fraudulent transactions and provide actionable insights through intuitive visualizations and comprehensive reports.

## 🚀 Features

- **Real-time Fraud Detection**: Leveraging machine learning models to analyze transactions instantly.
- **Risk Analysis**: Detailed risk scoring and explanation for each transaction.
- **Data Visualization**: Interactive dashboards and charts for monitoring financial patterns.
- **Portfolio Management**: Tools to track and manage financial projects and certifications.
- **Document Processing**: Automated PDF parsing and data extraction for financial reports.
- **Secure Authentication**: JWT-based user authentication and role-based access control.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Visuals**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Machine Learning**: [TensorFlow.js](https://www.tensorflow.org/js)
- **Security**: JWT, Bcrypt.js
- **File Handling**: Multer, PDF-parse

## 📂 Project Structure

```text
credimap/
├── client/          # React frontend (Vite)
│   ├── src/         # UI components, pages, and logic
│   └── public/      # Static assets
└── server/          # Node.js backend
    ├── controllers/ # Request handlers
    ├── models/      # MongoDB schemas
    ├── routes/      # API endpoints
    ├── services/    # Business logic and ML services
    └── scripts/     # Utility and training scripts
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Running instance)

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` root:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🧪 Verification & Debugging
- Use `server/verify-model.js` to test the fraud detection model integration.
- Check `server/output.log` and `server/error.txt` for backend logs.
