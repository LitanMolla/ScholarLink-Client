import React from 'react'
import { PiGraduationCapLight } from 'react-icons/pi'

const Spinner = () => {
    return (
        <>
            <div className="flex justify-center items-center flex-col">
                <div className="relative h-12 w-12">
                    {/* Outer soft ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>

                    {/* Rotating ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>

                    {/* Center education logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <PiGraduationCapLight className="text-primary text-2xl animate-pulse" />
                    </div>
                </div>

                {/* Brand Text */}
                <p className="text-sm font-semibold text-secondary tracking-tight animate-pulse mt-3">
                    Loading...
                </p>
            </div>
        </>
    )
}

export default Spinner