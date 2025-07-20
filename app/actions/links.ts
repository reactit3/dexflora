"use server";

import { createClient } from "@/supabase/server";

// Types
interface Link {
  id: string;
  name: string;
  url: string;
  created_at: string;
  document_id: string;
}

interface ServerResponse<T> {
  data: T | null;
  error: string | null;
}

export async function getFirstLinkAndDelete(): Promise<ServerResponse<Link>> {
  try {
    const supabase = await createClient();

    // Get the first link from "document 1"
    const { data: linkData, error: fetchError } = await supabase
      .from("links")
      .select("*")
      .eq("document_id", "document 1")
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (fetchError || !linkData) {
      return { data: null, error: "No link found" };
    }

    // Delete it after fetching
    const { error: deleteError } = await supabase
      .from("links")
      .delete()
      .eq("id", linkData.id);

    if (deleteError) {
      return { data: null, error: "Failed to delete link after fetching" };
    }

    return { data: linkData, error: null };
  } catch (error) {
    return { data: null, error: "Unexpected server error" };
  }
}
