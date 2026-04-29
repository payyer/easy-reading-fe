import { useMutation } from "@tanstack/react-query";
import { apiPost } from "../lib/api";

export function useUploadBooks() {
    return useMutation({
    mutationFn: async (books: File[]) => {  
      const formData = new FormData();
      books.forEach((book) => {
        formData.append("books", book);
      });
      return apiPost("/upload/books", formData);
    }
  });
}