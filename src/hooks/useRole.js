import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  const { data, isPending } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user.email}`);
      return res.data.data?.role || "Student";
    },
  });

  return { role: data, roleLoading: isPending || loading };
};

export default useRole;
