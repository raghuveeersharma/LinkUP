import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccout } from "../lib/api";

const useDelete = () => {
  const queryClient = useQueryClient();
  // Custom hook for deleting user account
  // It uses react-query's useMutation to handle the mutation
  const { mutate, isPending, error } = useMutation({
    mutationFn: deleteAccout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  return { deleteMutation: mutate, isPending, error };
};

export default useDelete;
