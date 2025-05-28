import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";

const useOnboarding = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Onboarding successful");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.log(error);
    },
  });
  return { onboardingMutation: mutate, isPending };
};

export default useOnboarding;
