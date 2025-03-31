import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'

import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'

import IncomeOverview from '../../components/Income/IncomeOverview'
import AddIncomeForm from '../../components/Income/AddIncomeForm'
import IncomeList from '../../components/Income/IncomeList'

import Modal from '../../components/Modal'
import DeleteAlert from '../../components/DeleteAlert'
import { toast } from 'react-hot-toast'


const Income = () => {

    const [incomeData, setIncomeData] = useState([])
    const [loading, setLoading] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null
    })

    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false)

    // Get all Income Details
    const fetchIncomeDetails = async () => {
        if (loading) return

        setLoading(true)

        try {
            const response = await axiosInstance.get(
                `${API_PATHS.INCOME.GET_ALL_INCOME}`
            )

            if (response.data) {
                setIncomeData(response.data)
            }
        } catch (error) {
            console.log("Something went wrong. Please try again.", error);
        } finally {
            setLoading(false)
        }
    }

    // Handle Add Income
    const handleAddIncome = async (income) => {
        const { source, amount, date, icon } = income

        if (!source.trim()) {
            toast.error("Source is required")
            return
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0")
            return
        }

        if (!date) {
            toast.error("Date is required")
            return
        }

        try {
            const response = await axiosInstance.post(
                `${API_PATHS.INCOME.ADD_INCOME}`,
                { source, amount, date, icon }
            )

            if (response.data) {
                setOpenAddIncomeModal(false)
                fetchIncomeDetails()
                toast.success("Income added successfully")
            }
        } catch (error) {
            console.log("Error while adding income", error.response?.data?.message || error.message);
        }
    }

    // Delete Income
    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))

            setOpenDeleteAlert({ show: false, data: null })
            toast.success("Income deleted successfully")
            fetchIncomeDetails()
        } catch (error) {
            console.log("Error while deleting income", error.response?.data?.message || error.message)
            toast.error("Failed to delete income. Try again.")
        }
    }

    //Handle Download income details
    const handleDownloadIncomeDetails = async () => { }

    useEffect(() => {
        fetchIncomeDetails()

        return () => { }
    }, [])

    return (
        <DashboardLayout activeMenu="Income">
            <div className='my-5 mx-auto'>
                <div className='grid grid-cols-1 gap-6'>
                    <div className=''>
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={() => setOpenAddIncomeModal(true)}
                        />
                    </div>
                </div>

                <IncomeList
                    transactions={incomeData}
                    onDelete={(id) => {
                        setOpenDeleteAlert({
                            show: true,
                            data: id
                        })
                    }}
                    onDownload={handleDownloadIncomeDetails}
                />

                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => setOpenAddIncomeModal(false)}
                    title="Add Income">
                    <AddIncomeForm
                        onAddIncome={handleAddIncome}
                    />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Income">

                    <DeleteAlert
                        message="Are you sure you want to delete this income?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                    />

                </Modal>
            </div>
        </DashboardLayout>
    )
}

export default Income