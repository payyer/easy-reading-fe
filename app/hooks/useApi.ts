import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/app/lib/api";

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await apiGet("/health-check");

      if (!response.success) {
        throw new Error(response.error || "Health check failed");
      }

      return response.data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

