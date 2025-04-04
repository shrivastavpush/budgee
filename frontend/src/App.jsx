import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Dashboard/Home'
import Income from './pages/Dashboard/Income'
import Expense from './pages/Dashboard/Expense'
import UserProvider from './context/UserContext'
import { Toaster } from 'react-hot-toast'
import GithubStarButton from './components/GithubStarButton'

const Root = () => {
    const isAuthenticated = true

    return !isAuthenticated ?
        <Navigate to='/login' />
        :
        <Navigate to='/dashboard' />
}

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Root />} />
                    <Route path='/login' exact element={<Login />} />
                    <Route path='/signup' exact element={<SignUp />} />
                    <Route path='/dashboard' exact element={<Home />} />
                    <Route path='/income' exact element={<Income />} />
                    <Route path='/expense' exact element={<Expense />} />
                </Routes>
                <GithubStarButton />
            </Router>

            <Toaster
                toastOptions={{
                    className: '',
                    style: {
                        fontSize: '13px',
                    }
                }}
            />
        </UserProvider>
    )
}

export default App