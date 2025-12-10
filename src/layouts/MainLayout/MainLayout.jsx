import { useEffect } from 'react';
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import { Outlet, useLocation } from "react-router";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import useAuth from '../../hooks/useAuth';

const MainLayout = () => {
  const { pathname } = useLocation()
  const { loading } = useAuth()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return (
    <>
      <div className="flex min-h-screen flex-col font-inter bg-slate-100">
        <Navbar />
        <main className="flex-1">
          <Outlet />
          {loading && <LoadingSpinner />}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default MainLayout