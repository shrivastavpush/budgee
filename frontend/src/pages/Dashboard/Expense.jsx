import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useExpense } from '../../hooks/useExpense'

import ExpenseOverview from '../../components/Expense/ExpenseOverview'
import AddExpenseForm from '../../components/Expense/AddExpenseForm'
import ExpenseList from '../../components/Expense/ExpenseList'

import Modal from '../../components/Modal'
import DeleteAlert from '../../components/DeleteAlert'
import SkeletonCard from '../../components/Cards/SkeletonCard'

const Expense = () => {
  useUserAuth()

  const {
    expenseData,
    loading,
    fetchExpenseDetails,
    addExpense,
    editExpense,
    deleteExpense,
    downloadExpenseReport,
  } = useExpense()

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false)
  const [openEditExpenseModal, setOpenEditExpenseModal] = useState({
    show: false,
    data: null,
  })
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  })

  useEffect(() => {
    fetchExpenseDetails()
  }, [fetchExpenseDetails])

  const handleAddExpense = async (expense) => {
    const success = await addExpense(expense)
    if (success) setOpenAddExpenseModal(false)
  }

  const handleEditExpense = async (expense) => {
    const success = await editExpense(openEditExpenseModal.data._id, expense)
    if (success) setOpenEditExpenseModal({ show: false, data: null })
  }

  const handleDeleteExpense = async () => {
    const success = await deleteExpense(openDeleteAlert.data)
    if (success) setOpenDeleteAlert({ show: false, data: null })
  }

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            {loading ? (
              <SkeletonCard type="chart" />
            ) : (
              <ExpenseOverview
                transactions={expenseData}
                onAddExpense={() => setOpenAddExpenseModal(true)}
              />
            )}
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <SkeletonCard type="transaction" count={4} />
          ) : (
            <ExpenseList
              transactions={expenseData}
              onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
              onEdit={(expense) => {
                setOpenEditExpenseModal({
                  show: true,
                  data: expense,
                })
              }}
              onDownload={downloadExpenseReport}
            />
          )}
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openEditExpenseModal.show}
          onClose={() => setOpenEditExpenseModal({ show: false, data: null })}
          title="Edit Expense"
        >
          <AddExpenseForm
            key={openEditExpenseModal.data?._id}
            initialData={openEditExpenseModal.data}
            onAddExpense={handleEditExpense}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            message="Are you sure you want to delete this expense?"
            onDelete={handleDeleteExpense}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense
