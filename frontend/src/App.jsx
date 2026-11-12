import React, { lazy, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom'
import UserProvider from './context/UserContext'
import { Toaster } from 'react-hot-toast'
import GithubStarButton from './components/GithubStarButton'

const Login = lazy(() => import('./pages/Auth/Login'))
const SignUp = lazy(() => import('./pages/Auth/SignUp'))
const Home = lazy(() => import('./pages/Dashboard/Home'))
const Income = lazy(() => import('./pages/Dashboard/Income'))
const Expense = lazy(() => import('./pages/Dashboard/Expense'))

const hasToken = () => Boolean(localStorage.getItem('token'))

const Root = () => {
  return <Navigate to={hasToken() ? '/dashboard' : '/login'} replace />
}

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
    <UserProvider>
      <Router>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
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
        <GithubStarButton />
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
  )
}

export default App
