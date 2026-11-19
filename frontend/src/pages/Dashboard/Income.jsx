import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useIncome } from '../../hooks/useIncome'

import IncomeOverview from '../../components/Income/IncomeOverview'
import AddIncomeForm from '../../components/Income/AddIncomeForm'
import IncomeList from '../../components/Income/IncomeList'

import Modal from '../../components/Modal'
import DeleteAlert from '../../components/DeleteAlert'
import SkeletonCard from '../../components/Cards/SkeletonCard'
import FloatingActionButton from '../../components/FloatingActionButton'

const Income = () => {
  useUserAuth()

  const {
    incomeData,
    loading,
    fetchIncomeDetails,
    addIncome,
    editIncome,
    deleteIncome,
    downloadIncomeReport,
    pagination,
  } = useIncome()

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false)
  const [openEditIncomeModal, setOpenEditIncomeModal] = useState({
    show: false,
    data: null,
  })
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  })

  useEffect(() => {
    fetchIncomeDetails()
  }, [fetchIncomeDetails])

  const handleAddIncome = async (income) => {
    const success = await addIncome(income)
    if (success) setOpenAddIncomeModal(false)
  }

  const handleEditIncome = async (income) => {
    const success = await editIncome(openEditIncomeModal.data._id, income)
    if (success) setOpenEditIncomeModal({ show: false, data: null })
  }

  const handleDeleteIncome = async () => {
    const success = await deleteIncome(openDeleteAlert.data)
    if (success) setOpenDeleteAlert({ show: false, data: null })
  }

  return (
    <DashboardLayout activeMenu="Income">
      <div className="space-y-6">
        <header className="page-heading">
          <p className="page-eyebrow">A closer look at your earnings</p>
          <h1 className="page-title">Income</h1>
          <p className="page-description">
            Keep all your income sources and trends in one place.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <div className="">
            {loading ? (
              <SkeletonCard type="chart" />
            ) : (
              <IncomeOverview transactions={incomeData} />
            )}
          </div>
        </div>

        <div>
          {loading ? (
            <SkeletonCard type="transaction" count={4} />
          ) : (
            <IncomeList
              transactions={incomeData}
              onDelete={(id) => {
                setOpenDeleteAlert({
                  show: true,
                  data: id,
                })
              }}
              onEdit={(income) => {
                setOpenEditIncomeModal({
                  show: true,
                  data: income,
                })
              }}
              onDownload={downloadIncomeReport}
              pagination={pagination}
              onPageChange={fetchIncomeDetails}
            />
          )}
        </div>

        <FloatingActionButton
          actions={[
            {
              label: 'Add income',
              onClick: () => setOpenAddIncomeModal(true),
            },
          ]}
        />

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openEditIncomeModal.show}
          onClose={() => setOpenEditIncomeModal({ show: false, data: null })}
          title="Edit Income"
        >
          <AddIncomeForm
            key={openEditIncomeModal.data?._id}
            initialData={openEditIncomeModal.data}
            onAddIncome={handleEditIncome}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            message="Are you sure you want to delete this income?"
            onDelete={handleDeleteIncome}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Income
