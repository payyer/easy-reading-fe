"use client";

import { useForm } from "react-hook-form";
// TODO: Why i can't import zodResolver from @hookform/resolvers/zod?
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadBooks } from "../hooks/useUpload";
import { bookFormSchema } from "../lib/validations/bookSchema";
interface UploadFormData {
  book: FileList;
}
export default function UploadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(bookFormSchema),
  });

  //   TODO: connect react Query
  const { mutate, isSuccess, isPending, isError } = useUploadBooks();

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    mutate(Array.from(data.book));
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="">Upload book</label>
        <input
          type="file"
          multiple
          {...register("book", { required: "Vui lòng chọn file" })}
        />
        {errors.book && <p style={{ color: "red" }}>{errors.book.message}</p>}
      </div>

      <button type="submit">Send</button>
    </form>
  );
}
