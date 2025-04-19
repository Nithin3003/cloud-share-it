
import { Tables } from "@/integrations/supabase/types";

export type SharedFile = Tables<"shared_files">;

export interface FileWithURL extends SharedFile {
  url: string;
}
