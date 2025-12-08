import React from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router'

const ScholarshipCard = ({scholarship}) => {
    const {id,deadline,fee,level,country,title} = scholarship || {}
    return (
        <>
            <div
                className="flex h-full flex-col rounded-xl border border-black/10 bg-white/90 p-4 hover:border-primary/40 hover:bg-white duration-300"
            >
                {/* Title + meta */}
                <div className="mb-3 space-y-1">
                    <h3 className="text-sm sm:text-base font-semibold text-secondary leading-snug line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                        {country} • {level}
                    </p>
                </div>

                {/* Info rows */}
                <div className="space-y-1 text-xs text-slate-600 mb-4">
                    <p>
                        <span className="font-medium text-secondary">
                            Application Fee:
                        </span>{" "}
                        {fee}
                    </p>
                    <p>
                        <span className="font-medium text-secondary">Deadline:</span>{" "}
                        {deadline}
                    </p>
                </div>

                {/* Footer button */}
                <div className="mt-auto pt-2">
                    <Link
                        to={`/scholarships/${id}`}
                        className="btn btn-secondary w-full text-xs sm:text-sm inline-flex items-center justify-center gap-2 duration-300"
                    >
                        <span>View Details</span>
                        <FiArrowRight className="text-sm" />
                    </Link>
                </div>
            </div>
        </>
    )
}

export default ScholarshipCard