import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { PWAError } from '@/lib/error';

type ResponseItem = {
  field: string;
  type: 'string' | 'number' | 'TEXT' | 'PDF';
  value: string | number;
};

type InputPayload = {
  responseItems: ResponseItem[];
};

export function useCreateInternalScholarshipMutation() {
  return useMutation({
    mutationFn: async ({ responseItems }: InputPayload) => {

      const response = await axios.post(
        '/api/scholarship',
        { responseItems },
        {
          withCredentials: true,
        }
      );

      return response.data;
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        throw new PWAError(err.response?.data?.error || err.message);
      }
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to create internal scholarship');
    },
  });
}
