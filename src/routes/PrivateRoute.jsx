import { Navigate, useLocation } from "react-router"
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner"
import useAuth from "../hooks/useAuth"

const PrivateRoute = ({children}) => {
  const {loading,user} = useAuth()
  const {pathname} = useLocation()
  if (loading) {
    return <LoadingSpinner/>
  }
  if (!user) {
    return <Navigate to='/login' state={pathname} />
  }
  if (user) {
    return children
  }
}

export default PrivateRoute