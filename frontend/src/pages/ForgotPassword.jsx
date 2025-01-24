import React, { useState } from 'react'
import {axiosInstance} from '../lib/axios'
import toast from 'react-hot-toast'


const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.post("/auth/forgot", { email })
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response.data.error || error.response.data.errors[0].msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='h-screen flex justify-center items-center flex-col gap-5'>
            <h1 className='text-3xl'>Forgot passoword </h1>
            <div className='flex justify-center gap-4 items-center flex-col p-5 rounded-xl w-[366px] sm:w-[500px]'>
                <div className='w-full'>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Enter email' className='w-full rounded-full px-5 py-2 text-lg ring-2 ring-gray-500 bg-transparent focus:outline-none' />
                </div>
                <button onClick={handleClick} disabled={loading} type='sumbit' className={`bg-primary text-black p-2 rounded-full text-lg w-full hover:bg-blue-500 transition-all duration-300 ${loading ? "cursor-wait" : "cursor-pointer"}`}>{loading ? "Submiting" : "Submit"}</button>

            </div>

        </div>
    )
}

export default ForgotPassword