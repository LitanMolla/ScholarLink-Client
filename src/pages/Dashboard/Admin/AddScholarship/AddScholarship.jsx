import { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import uploadImageToImgBB from "../../../../utils/uploadImageToImgBB";

const AddScholarship = () => {
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const imageFile = data?.photo?.[0];

    if (!imageFile) {
      return Swal.fire("Error", "Please select an image", "error");
    }

    setLoading(true);

    try {
      const photoURL = await uploadImageToImgBB(imageFile);

      const scholarship = {
        scholarship_name: data.scholarship_name,
        university_name: data.university_name,
        country: data.country,
        city: data.city,
        degree: data.degree,
        subject_category: data.subject_category,
        scholarship_category: data.scholarship_category,
        applicationFees: Number(data.applicationFees),
        serviceCharge: Number(data.serviceCharge),
        tuition_fees: Number(data.tuition_fees),
        world_rank: Number(data.world_rank),
        image: photoURL,
      };
      const res = await axiosPublic.post("/scholarships", scholarship);
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Scholarship Added",
          timer: 1500,
          showConfirmButton: false,
        });
        reset();
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to add scholarship", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition";
  const labelClass = "text-xs font-medium text-slate-600";
  const errorClass = "text-[11px] text-red-500 mt-1";

  return (
    <section className="py-6 w-full">
      <h1 className="text-lg font-semibold text-secondary mb-4">
        Add Scholarship
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full rounded-xl border border-black/20 bg-white p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Scholarship Name */}
          <div className="space-y-1">
            <label className={labelClass}>Scholarship Name</label>
            <input
              placeholder="e.g. Global Merit Scholarship"
              className={inputClass}
              {...register("scholarship_name", { required: "Required" })}
            />
            {errors.scholarship_name && (
              <p className={errorClass}>{errors.scholarship_name.message}</p>
            )}
          </div>

          {/* University Name */}
          <div className="space-y-1">
            <label className={labelClass}>University Name</label>
            <input
              placeholder="e.g. University of XYZ"
              className={inputClass}
              {...register("university_name", { required: "Required" })}
            />
            {errors.university_name && (
              <p className={errorClass}>{errors.university_name.message}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-1">
            <label className={labelClass}>Country</label>
            <input
              placeholder="e.g. USA"
              className={inputClass}
              {...register("country", { required: "Required" })}
            />
            {errors.country && (
              <p className={errorClass}>{errors.country.message}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className={labelClass}>City</label>
            <input
              placeholder="e.g. New York"
              className={inputClass}
              {...register("city", { required: "Required" })}
            />
            {errors.city && <p className={errorClass}>{errors.city.message}</p>}
          </div>

          {/* Degree */}
          <div className="space-y-1">
            <label className={labelClass}>Degree</label>
            <input
              placeholder="e.g. Bachelor / Master"
              className={inputClass}
              {...register("degree", { required: "Required" })}
            />
            {errors.degree && (
              <p className={errorClass}>{errors.degree.message}</p>
            )}
          </div>

          {/* Subject Category */}
          <div className="space-y-1">
            <label className={labelClass}>Subject Category</label>
            <input
              placeholder="e.g. Computer Science"
              className={inputClass}
              {...register("subject_category", { required: "Required" })}
            />
            {errors.subject_category && (
              <p className={errorClass}>{errors.subject_category.message}</p>
            )}
          </div>

          {/* Scholarship Category */}
          <div className="space-y-1">
            <label className={labelClass}>Scholarship Category</label>
            <input
              placeholder="e.g. Full Fund / Partial"
              className={inputClass}
              {...register("scholarship_category", { required: "Required" })}
            />
            {errors.scholarship_category && (
              <p className={errorClass}>{errors.scholarship_category.message}</p>
            )}
          </div>

          {/* Application Fees */}
          <div className="space-y-1">
            <label className={labelClass}>Application Fees ($)</label>
            <input
              type="number"
              placeholder="e.g. 50"
              className={inputClass}
              {...register("applicationFees", { required: "Required", min: 0 })}
            />
            {errors.applicationFees && (
              <p className={errorClass}>Valid number required</p>
            )}
          </div>

          {/* Service Charge */}
          <div className="space-y-1">
            <label className={labelClass}>Service Charge ($)</label>
            <input
              type="number"
              placeholder="e.g. 10"
              className={inputClass}
              {...register("serviceCharge", { required: "Required", min: 0 })}
            />
            {errors.serviceCharge && (
              <p className={errorClass}>Valid number required</p>
            )}
          </div>

          {/* Tuition Fees */}
          <div className="space-y-1">
            <label className={labelClass}>Tuition Fees ($)</label>
            <input
              type="number"
              placeholder="e.g. 12000"
              className={inputClass}
              {...register("tuition_fees", { required: "Required", min: 0 })}
            />
            {errors.tuition_fees && (
              <p className={errorClass}>Valid number required</p>
            )}
          </div>

          {/* World Rank */}
          <div className="space-y-1">
            <label className={labelClass}>World Rank</label>
            <input
              type="number"
              placeholder="e.g. 120"
              className={inputClass}
              {...register("world_rank", { required: "Required", min: 1 })}
            />
            {errors.world_rank && (
              <p className={errorClass}>Valid number required</p>
            )}
          </div>

          {/* Photo (full width on lg) */}
          <div className="space-y-1 lg:col-span-2">
            <label className={labelClass}>Scholarship Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md"
              {...register("photo", { required: "Image is required" })}
            />
            {errors.photo && <p className={errorClass}>{errors.photo.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full mt-6"
        >
          {loading ? "Uploading..." : "Add Scholarship"}
        </button>
      </form>
    </section>
  );
};

export default AddScholarship;
