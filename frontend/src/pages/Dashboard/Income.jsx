import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
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
    useUserAuth()

    const [incomeData, setIncomeData] = useState([])
    const [loading, setLoading] = useState(false)
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false)
    const [openEditIncomeModal, setOpenEditIncomeModal] = useState({
        show: false,
        data: null
    })
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null
    })

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

    // Handle Edit Income
    const handleEditIncome = async (income) => {
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
            const response = await axiosInstance.patch(
                `${API_PATHS.INCOME.UPDATE_INCOME(openEditIncomeModal.data._id)}`,
                { source, amount, date, icon }
            )

            if (response.data) {
                setOpenEditIncomeModal({ show: false, data: null })
                toast.success("Income updated successfully")
                fetchIncomeDetails()
            }
        } catch (error) {
            console.log("Error while updating income", error.response?.data?.message || error.message);
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
    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME_EXCEL, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'income-details.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log("Error while downloading income details", error.response?.data?.message || error.message);
            toast.error("Failed to download income details. Try again.");
        }
    }

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
                    onEdit={(income) => {
                        setOpenEditIncomeModal({
                            show: true,
                            data: income
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
                    isOpen={openEditIncomeModal.show}
                    onClose={() => setOpenEditIncomeModal({ show: false, data: null })}
                    title="Edit Income">
                    <AddIncomeForm
                        initialData={openEditIncomeModal.data}
                        onAddIncome={handleEditIncome}
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