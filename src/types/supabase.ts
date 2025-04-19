
import { Tables } from "@/integrations/supabase/types";
import { File } from "@/types";

export type SharedFile = Tables<"shared_files">;

export interface FileWithURL extends SharedFile {
  url: string;
}

// Helper function to convert a SharedFile to the expected File format
export const mapSharedFileToFile = (file: FileWithURL): File => {
  return {
    id: file.id,
    name: file.filename,
    size: file.size,
    type: file.type,
    url: file.url,
    shareUrl: file.share_url,
    uploadedAt: new Date(file.created_at),
    userId: file.user_id
  };
};
