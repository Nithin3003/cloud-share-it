
import { Tables } from "@/integrations/supabase/types";

export type SharedFile = Tables<"shared_files">;

export interface FileWithURL extends SharedFile {
  url: string;
  // Add these fields to match what our components expect
  name?: string;
  shareUrl?: string;
  uploadedAt?: Date;
  userId?: string;
  size?: number;
  type?: string;
}

// Helper function to convert a SharedFile to the expected File format
export const mapSharedFileToFile = (file: FileWithURL): File => {
  return {
    id: file.id,
    name: file.filename, // Map from filename
    size: file.size,
    type: file.type,
    url: file.url,
    shareUrl: file.share_url, // Map from share_url
    uploadedAt: new Date(file.created_at), // Map from created_at
    userId: file.user_id // Map from user_id
  };
};
