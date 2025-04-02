import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash, } from 'react-icons/lu'

const ProfilePhotoSelector = ({ image, setImage }) => {

    const inputRef = useRef(null)
    const [prevURL, setPrevURL] = useState(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        //updaing image
        setImage(file)

        //generating preview url
        const preview = URL.createObjectURL(file)
        setPrevURL(preview)
    }

    const handleRemoveImage = () => {
        setImage(null)
        setPrevURL(null)
    }

    const onChooseFile = () => { inputRef.current.click() }

    return (
        <div className='flex justify-center mb-6'>
            <input
                type="file"
                accept='image/*'
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden' />

            {!image ? (
                <div className='w-20 h-20 flex items-center justify-center bg-teal-100 rounded-full relative'>
                    <LuUser className='text-4xl text-teal-400' />

                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-teal-500 rounded-full text-white absolute cursor-pointer -bottom-1 -right-1'
                        onClick={onChooseFile}>
                        <LuUpload />
                    </button>
                </div>
            ) : (
                <div className='relative'>
                    <img src={prevURL}
                        alt="profile photo"
                        className='w-20 h-20 rounded-full object-cover
                        ' />

                    <button
                        type="button"
                        className='w-8 h-8 flex items-center justify-center bg-red-500 rounded-full text-white absolute cursor-pointer -bottom-1 -right-1'
                        onClick={handleRemoveImage}>
                        <LuTrash />
                    </button>
                </div>)}
        </div>
    )
}

export default ProfilePhotoSelector
