import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { BadgeCheck, ShieldX } from 'lucide-react'


const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const tokenParamValue = searchParams.get("token")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const verifyUser = async () => {
    try {
      const response = await axiosInstance.post("/auth/verifyemail", { token: tokenParamValue })
      setSuccess(true)
      setError(false)
      toast.success(response.data.message)
    } catch (error) {
      setError(true)
      setSuccess(false)
      toast.error(error.response.data.error || error.response.data.errors[0].msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyUser()
  }, [tokenParamValue])


  if (loading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <div className='w-28 h-28 rounded-full flex justify-center items-center border-e-4 border-l-4 border-e-emerald-500 border-l-yellow-500 animate-spin duration-75'>
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen flex justify-center items-center'>
      {error && (
        <div className='bg-red-600 p-3 rounded-lg flex justify-center items-center flex-col'>
          <div>
            <ShieldX size={220} className='animate-pulse duration-75' />
          </div>
          <div className='flex justify-center flex-col items-center'>
            <p className='text-xl font-semibold'>Error verifying Email or Token Invalid</p>
            <Link to={"/login"} className='mt-2 p-2 bg-blue-600 rounded-lg text-lg'>Login</Link>

          </div>
        </div>
      )}

      {success && (
        <div className='bg-green-400 p-3 rounded-lg flex justify-center items-center flex-col'>
          <div>
            <BadgeCheck size={220} className='animate-pulse duration-75' />
          </div>
          <div className='flex justify-center flex-col items-center'>
            <p className='text-2xl font-semibold'>Verified Email</p>
            <Link to={"/login"} className='mt-2 p-2 bg-blue-600 rounded-lg text-lg'>Login</Link>
          </div>
        </div>
      )}

    </div>
  )
}

export default VerifyEmail