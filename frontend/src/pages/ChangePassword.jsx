import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { axiosInstance } from '../lib/axios'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const ChangePassword = () => {
    const [searchParams] = useSearchParams()
    const tokenParamValue = searchParams.get("token")
    const navigate = useNavigate()

    const [password, setpassword] = useState("")
    const [confirmPassword, setConfrimPassword] = useState("")

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        if (password !== confirmPassword) {
            toast.error("Password don't match")
            return
        }
        if (!password || !confirmPassword) {
            toast.error("Password won't be empty")
            return
        }
        try {
            setLoading(true)
            const response = await axiosInstance.post("/auth/change", { password, confirmPassword, token: tokenParamValue })
            toast.success(response.data.message)
            navigate("/login")

        } catch (error) {
            toast.error(error.response.data.error || error.response.data.errors[0].msg)

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='h-screen flex flex-col justify-center items-center gap-5'>
            <h1 className='text-3xl'>Change Password</h1>
            <div className='w-[366px] sm:w-[400px] p-5 rounded-lg flex flex-col justify-center items-center gap-5'>
                <div className='w-full relative'>
                    <input value={password} onChange={(e) => setpassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder='Enter password' className='w-full rounded-full px-3 py-2 text-lg ring-2 ring-gray-500 bg-transparent focus:outline-none' />
                    <div onClick={() => { setShowPassword(!showPassword) }} className='absolute right-3 top-2 bg-black p-1 bg-opacity-50 rounded-full'>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</div>
                </div>
                <div className='w-full relative'>
                    <input value={confirmPassword} onChange={(e) => setConfrimPassword(e.target.value)} type={showConfirmPassword ? "text" : "password"} placeholder='Enter Confirm password' className='w-full rounded-full px-3 py-2 text-lg ring-2 ring-gray-500 bg-transparent focus:outline-none' />
                    <div onClick={() => { setShowConfirmPassword(!showConfirmPassword) }} className='absolute right-3 top-2 bg-black p-1 bg-opacity-50 rounded-full'>{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</div>
                </div>
                <div className='flex flex-col w-full'>
                    <Link to="/login" className='text-primary m-3'>Login</Link>
                    <button onClick={handleClick} disabled={loading} type='sumbit' className={`bg-primary text-black p-3 rounded-full text-lg w-full transition-all duration-300 ${loading ? "cursor-wait" : "cursor-pointer"}`}>{loading ? "Changing" : "Change"}</button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword