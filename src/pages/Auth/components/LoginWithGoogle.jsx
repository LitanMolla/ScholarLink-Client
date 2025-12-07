
import { FcGoogle } from 'react-icons/fc'
import useAuth from '../../../hooks/useAuth'
import errorToast from '../../../utils/errorToast'
import successAlert from '../../../utils/successToast'
import { useState } from 'react'

const LoginWithGoogle = () => {
    const [pending, setPending] = useState(false)
    const { googleLogin } = useAuth()
    const handleLogin = async () => {
        setPending(true)
        try {
            const result = await googleLogin()
            if (result.user) {
                successAlert('Login Successful!', 'Welcome back! You’re now logged in.')
                setPending(false)
            }
        } catch (error) {
            errorToast(error)
            setPending(false)
        }
    }
    return (
        <>
            <button
                onClick={handleLogin}
                className="w-full border border-black/10 rounded-md py-2.5 flex items-center justify-center gap-2 hover:bg-slate-50 duration-300 cursor-pointer"
            >

                {
                    pending ?
                        <span className="animate-pulse">Loading...</span>
                        :
                        <>
                            <FcGoogle className="text-xl" />
                            <span className="text-sm font-medium text-secondary">Continue with Google</span>
                        </>
                }
            </button>
        </>
    )
}

export default LoginWithGoogle