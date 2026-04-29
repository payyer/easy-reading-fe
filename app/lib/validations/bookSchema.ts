import { z } from "zod";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ["application/pdf", "application/epub+zip"];

export const bookFormSchema = z.object({
  book: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Please select a file")
    .refine((files) => files.length <= 5, "Max 5 files")
    .refine(
      (files) => Array.from(files).every(f => ALLOWED_TYPES.includes(f.type)),
      "Only PDF and EPUB files"
    )
    .refine(
      (files) => Array.from(files).every(f => f.size <= MAX_FILE_SIZE),
      "Each file max 50MB"
    ),
});