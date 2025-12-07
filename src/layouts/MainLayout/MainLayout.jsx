import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <>
        <div className="flex min-h-screen flex-col font-inter bg-slate-100">
            <Navbar/>
            <main className="flex-1">
                 <Outlet />
            </main>
            <Footer/>
        </div>
    </>
  )
}

export default MainLayout