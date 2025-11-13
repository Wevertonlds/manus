import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials for storage operations");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sanitize filename to remove special characters and accents
function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9.-]/g, "-") // Replace special chars with dash
    .replace(/-+/g, "-") // Replace multiple dashes with single dash
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

export const storageRouter = router({
  uploadFile: protectedProcedure
    .input(
      z.object({
        bucket: z.enum(["carrossel", "investimentos", "config"]),
        filename: z.string(),
        fileBase64: z.string(), // Base64 encoded file content
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        const sanitizedFilename = sanitizeFilename(input.filename);
        const timestamp = Date.now();
        const path = `${timestamp}-${sanitizedFilename}`;

        // Convert base64 to buffer
        const buffer = Buffer.from(input.fileBase64, "base64");

        // Upload to Supabase
        const { data, error } = await supabase.storage
          .from(input.bucket)
          .upload(path, buffer, {
            cacheControl: "3600",
            upsert: true,
            contentType: "image/png", // Adjust based on file type if needed
          });

        if (error) {
          console.error("Upload error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Upload failed: ${error.message}`,
          });
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(input.bucket).getPublicUrl(data.path);

        return {
          url: publicUrl,
          path: data.path,
        };
      } catch (error) {
        console.error("Storage operation failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file",
        });
      }
    }),
});
