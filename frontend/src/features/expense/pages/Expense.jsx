import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../auth/hooks/useUserAuth'
import DashboardLayout from '../../../shared/layouts/DashboardLayout'
import { useExpense } from '../hooks/useExpense'

import ExpenseOverview from '../components/ExpenseOverview'
import AddExpenseForm from '../components/AddExpenseForm'
import ExpenseList from '../components/ExpenseList'

import Modal from '../../../shared/ui/Modal'
import DeleteAlert from '../../../shared/ui/DeleteAlert'
import SkeletonCard from '../../../shared/ui/cards/SkeletonCard'
import FloatingActionButton from '../../../shared/ui/FloatingActionButton'

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
    pagination,
    overview,
    fetchExpenseOverview,
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
    fetchExpenseOverview()
  }, [fetchExpenseDetails, fetchExpenseOverview])

  const handleAddExpense = async (expense) => {
    const success = await addExpense(expense)
    if (success) {
      setOpenAddExpenseModal(false)
      fetchExpenseDetails(1) // new items sort first
      fetchExpenseOverview()
    }
  }

  const handleEditExpense = async (expense) => {
    const success = await editExpense(openEditExpenseModal.data._id, expense)
    if (success) {
      setOpenEditExpenseModal({ show: false, data: null })
      fetchExpenseOverview()
    }
  }

  const handleDeleteExpense = async () => {
    const success = await deleteExpense(openDeleteAlert.data)
    if (success) {
      setOpenDeleteAlert({ show: false, data: null })
      fetchExpenseOverview()
    }
  }

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="space-y-6">
        <header className="page-heading">
          <p className="page-eyebrow">Understand where it all goes</p>
          <h1 className="page-title">Expenses</h1>
          <p className="page-description">
            Track everyday spending and spot patterns over time.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <div className="">
            {loading && expenseData.length === 0 ? (
              <SkeletonCard type="chart" />
            ) : (
              <ExpenseOverview data={overview} />
            )}
          </div>
        </div>

        <div>
          {loading && expenseData.length === 0 ? (
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
              pagination={pagination}
              onPageChange={fetchExpenseDetails}
            />
          )}
        </div>

        <FloatingActionButton
          actions={[
            {
              label: 'Add expense',
              onClick: () => setOpenAddExpenseModal(true),
            },
          ]}
        />

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
