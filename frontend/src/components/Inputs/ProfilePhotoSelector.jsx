import React, { useRef, useState, useEffect } from 'react'
import { LuUser, LuUpload, LuTrash, } from 'react-icons/lu'
import { toast } from 'react-hot-toast'

const ProfilePhotoSelector = ({ image, setImage }) => {
  const [prevURL, setPrevURL] = useState(null);

  /* Safe URL generation and cleanup */
  useEffect(() => {
    return () => {
      if (prevURL && typeof prevURL === 'string' && prevURL.startsWith('blob:')) {
        URL.revokeObjectURL(prevURL);
      }
    };
  }, [prevURL]);

  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only allow image files
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, JPG and PNG images are allowed.')
      return;
    }

    setImage(file);
    const url = URL.createObjectURL(file);
    setPrevURL(url);
  }

  const handleRemoveImage = () => {
    setImage(null);
    setPrevURL(null);

    // Reset file input value so the same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
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
          <img src={prevURL || (typeof image === 'string' ? image : null)}
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
