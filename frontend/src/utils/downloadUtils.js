import axiosInstance from './axiosInstance'
import toast from 'react-hot-toast'

export const downloadFile = async (url, filename) => {
  try {
    const response = await axiosInstance.get(url, { responseType: 'blob' })

    const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)

    return true
  } catch (error) {
    console.error('Error downloading file:', error)
    toast.error('Failed to download file. Try again.')
    return false
  }
}
