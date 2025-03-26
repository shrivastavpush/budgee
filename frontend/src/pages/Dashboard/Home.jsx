import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    useUserAuth()

    const navigate = useNavigate()

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className='my-5 mx-auto'>Home</div>
        </DashboardLayout>
    )
}

export default Home