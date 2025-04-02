# Budgee - Personal Finance Management Application

<div align="center">

![Budgee Logo](budgee.webp)

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, secure, and intuitive personal finance management application that helps users track their income, expenses, and financial goals.

[Live Demo](https://budgee-rho.vercel.app) · [Report Bug](https://github.com/yourusername/budgee/issues) · [Request Feature](https://github.com/yourusername/budgee/issues)

</div>

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About The Project

Budgee is a comprehensive personal finance management application designed to help users take control of their financial life. Built with modern technologies and best practices, it offers a secure and intuitive platform for managing financial transactions, tracking expenses, and visualizing financial data through interactive dashboards.

### Key Highlights

- 🔒 **Secure Authentication**: JWT-based authentication system
- 📱 **Responsive Design**: Works seamlessly across all devices
- 📊 **Data Visualization**: Interactive charts and graphs
- 💾 **Data Export**: Excel export functionality
- 🔄 **Real-time Updates**: Instant data synchronization

## ✨ Features

### Core Features

- 🔐 **Secure User Authentication**
  - JWT-based authentication
  - Protected routes
  - Secure password handling
- 👤 **Profile Management**
  - Custom profile image upload
  - User information management
- 💰 **Income Management**
  - Add, edit, and delete income entries
  - Categorize income sources
  - Track recurring income
- 💸 **Expense Tracking**
  - Category-based expense tracking
  - Custom categories support
  - Expense analytics
- 📊 **Interactive Dashboard**
  - Bar Charts for Monthly Comparisons
  - Pie Charts for Category Distribution
  - Line Charts for Trend Analysis
  - Customizable date ranges
- 📥 **Data Export**
  - Excel export for income
  - Excel export for expenses
  - Custom date range selection

### Dashboard Features

- 📈 **Quick Insights**
  - Total Balance Overview
  - Income Summary
  - Expense Summary
  - Monthly Trends
- 📋 **Transaction Management**
  - Recent Transactions List
  - Transaction Search
  - Filter by Date/Category
- 🎯 **Financial Goals**
  - Set and track financial goals
  - Progress visualization
  - Goal notifications

### Management Features

- ➕ **Transaction Management**
  - Add New Income/Expense Entries
  - Bulk Import Support
  - Transaction Categories
- 📊 **Reporting**
  - Monthly Reports
  - Category-wise Analysis
  - Custom Date Range Reports
- 🔒 **Security**
  - Encrypted Data Storage
  - Secure API Endpoints
  - Regular Security Updates

## 🛠️ Tech Stack

### Frontend

- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Visualization**:
  - Recharts
  - Chart.js
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **UI Components**:
  - React Icons
  - Custom Components
- **Date Handling**: Moment.js
- **Authentication**: JWT

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer
- **Data Export**: XLSX
- **Security**:
  - CORS
  - Helmet
  - Rate Limiting
- **Environment**: dotenv

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/budgee.git
   cd budgee
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   BACKEND_URL=http://localhost:8000
   PORT=8000
   NODE_ENV=development
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```

   Create `.env` file:

   ```
   VITE_API_URL=http://localhost:8000
   ```

### Running the Application

1. **Start Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Development Server**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| POST   | `/api/v1/auth/register`     | Register a new user  |
| POST   | `/api/v1/auth/login`        | Authenticate user    |
| GET    | `/api/v1/auth/getUser`      | Get user information |
| POST   | `/api/v1/auth/upload-image` | Upload profile image |

### Income Endpoints

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| POST   | `/api/v1/income/add`           | Add new income           |
| GET    | `/api/v1/income/get`           | Get all income entries   |
| DELETE | `/api/v1/income/:id`           | Delete income entry      |
| GET    | `/api/v1/income/downloadexcel` | Download income as Excel |

### Expense Endpoints

| Method | Endpoint                        | Description                |
| ------ | ------------------------------- | -------------------------- |
| POST   | `/api/v1/expense/add`           | Add new expense            |
| GET    | `/api/v1/expense/get`           | Get all expense entries    |
| DELETE | `/api/v1/expense/:id`           | Delete expense entry       |
| GET    | `/api/v1/expense/downloadexcel` | Download expenses as Excel |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Test your changes thoroughly

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGithub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
