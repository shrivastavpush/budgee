import React, { lazy, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom'
import UserProvider from '../features/auth/context/UserContext'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '../features/theme/context/ThemeProvider'

const Landing = lazy(() => import('../features/landing/pages/Landing'))
const Home = lazy(() => import('../features/dashboard/pages/Home'))
const Income = lazy(() => import('../features/income/pages/Income'))
const Expense = lazy(() => import('../features/expense/pages/Expense'))

const hasToken = () => Boolean(localStorage.getItem('token'))

const PrivateRoute = ({ children }) => {
  return hasToken() ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  return hasToken() ? <Navigate to="/dashboard" replace /> : children
}

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
      <Link className="font-medium text-teal-500 underline" to="/">
        Go home
      </Link>
    </div>
  )
}

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
    Loading...
  </div>
)

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route
                element={
                  <PublicRoute>
                    <Landing />
                  </PublicRoute>
                }
              >
                <Route path="/" />
                <Route path="/login" />
                <Route path="/signup" />
              </Route>
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/income"
                element={
                  <PrivateRoute>
                    <Income />
                  </PrivateRoute>
                }
              />
              <Route
                path="/expense"
                element={
                  <PrivateRoute>
                    <Expense />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>

        <Toaster
          toastOptions={{
            className: '',
            style: {
              fontSize: '13px',
            },
          }}
        />
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
