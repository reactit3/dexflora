"use server";

import { createClient as c0 } from "@/supabase/server";

interface X1 {
  id: string;
  name: string;
  url: string;
  created_at: string;
  document_id: string;
}

interface R<T> {
  data: T | null;
  error: string | null;
}   

export async function opX(d1: string): Promise<R<X1>> {
  try {
    const sb = await c0();

    if (!d1) {
      return { data: null, error: "Invalid input" };
    }

    const { data: x, error: e1 } = await sb
      .from("links")
      .select("*")
      .eq("document_id", d1)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (e1 || !x) {
      return { data: null, error: "Not found" };
    }


    return { data: x, error: null };
  } catch {
    return { data: null, error: "Server error" };
  }
}
