import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import ExpenseOverview from '../../components/Expense/ExpenseOverview'
import AddExpenseForm from '../../components/Expense/AddExpenseForm'
import Modal from '../../components/Modal'
import DeleteAlert from '../../components/DeleteAlert'
import ExpenseList from '../../components/Expense/ExpenseList'

const Expense = () => {
    useUserAuth()

    const [expenseData, setExpenseData] = useState([])
    const [loading, setLoading] = useState(false)
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null
    })

    const fetchExpenseDetails = async () => {
        if (loading) return

        setLoading(true)

        try {
            const response = await axiosInstance.get(
                `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
            )

            if (response.data) {
                setExpenseData(response.data)
            }
        } catch (error) {
            console.log("Something went wrong. Please try again.", error);
        } finally {
            setLoading(false)
        }
    }

    // Handle Add Expense
    const handleAddExpense = async (expense) => {
        const { category, amount, date, icon } = expense

        if (!category.trim()) {
            toast.error("Category is required")
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
                `${API_PATHS.EXPENSE.ADD_EXPENSE}`,
                { category, amount, date, icon }
            )

            if (response.data) {
                setOpenAddExpenseModal(false)
                fetchExpenseDetails()
                toast.success("Expense added successfully")
            }
        } catch (error) {
            console.log("Error while adding expense", error.response?.data?.message || error.message);
        }
    }

    // Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Expense deleted successfully");
            fetchExpenseDetails();
        } catch (error) {
            console.log("Error while deleting expense", error.response?.data?.message || error.message);
            toast.error("Failed to delete expense. Try again.");
        }
    }

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE_EXCEL, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'expense-details.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log("Error while downloading expense details", error.response?.data?.message || error.message);
            toast.error("Failed to download expense details. Try again.");
        }
    }

    useEffect(() => {
        fetchExpenseDetails()

        return () => { }
    }, [])

    return (
        <DashboardLayout activeMenu="Expense">
            <div className='my-5 mx-auto'>
                <div className='grid grid-cols-1 gap-6'>
                    <div className=''>
                        <ExpenseOverview
                            transactions={expenseData}
                            onAddExpense={() => setOpenAddExpenseModal(true)}
                        />
                    </div>
                </div>

                <ExpenseList
                    transactions={expenseData}
                    onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                    onDownload={handleDownloadExpenseDetails}
                />

                <Modal
                    isOpen={openAddExpenseModal}
                    onClose={() => setOpenAddExpenseModal(false)}
                    title="Add Expense">
                    <AddExpenseForm
                        onAddExpense={handleAddExpense}
                    />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Expense">

                    <DeleteAlert
                        message="Are you sure you want to delete this expense?"
                        onDelete={() => deleteExpense(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    )
}

export default Expense