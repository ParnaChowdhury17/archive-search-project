/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { pipeline } from "@xenova/transformers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

let extractorPromise: any = null;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return extractorPromise;
}

async function getEmbedding(query: string): Promise<number[]> {
  const extractor = await getExtractor();

  const output = await extractor(query, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || !q.trim()) {
      return NextResponse.json({ results: [] });
    }

    const embedding = await getEmbedding(q);

    const { data, error } = await supabase.rpc("match_newspaper_chunks", {
      query_embedding: embedding,
      match_count: 10,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const results = (data || []).map((item: any) => ({
      id: item.id,
      issue: item.issue,
      page: item.page,
      date: item.date,
      headline: item.headline,
      snippet: item.chunk_text,
      image_path: item.image_path,
      image_url: item.image_url,
      similarity: item.similarity,
    }));

    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Search failed" },
      { status: 500 }
    );
  }
}