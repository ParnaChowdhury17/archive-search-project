import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const HF_TOKEN = process.env.HF_TOKEN;

function normalizeVector(vector: number[]) {
  const norm = Math.sqrt(vector.reduce((sum, x) => sum + x * x, 0));
  return vector.map((x) => x / norm);
}

function meanPool(tokenEmbeddings: number[][]) {
  const dim = tokenEmbeddings[0].length;
  const pooled = new Array(dim).fill(0);

  for (const token of tokenEmbeddings) {
    for (let i = 0; i < dim; i++) {
      pooled[i] += token[i];
    }
  }

  return pooled.map((x) => x / tokenEmbeddings.length);
}

async function getEmbedding(query: string): Promise<number[]> {
  if (!HF_TOKEN) {
    throw new Error("HF_TOKEN is missing");
  }

  const res = await fetch(
    "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: query,
        options: {
          wait_for_model: true,
        },
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Hugging Face embedding error: ${errorText}`);
  }

  const data = await res.json();

  let embedding: number[];

  if (Array.isArray(data[0]) && typeof data[0][0] === "number") {
    embedding = meanPool(data as number[][]);
  } else if (Array.isArray(data) && typeof data[0] === "number") {
    embedding = data as number[];
  } else {
    throw new Error("Unexpected embedding response format");
  }

  return normalizeVector(embedding);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q");
    const yearParam = searchParams.get("year");

    const selectedYear =
      yearParam && yearParam !== "all" ? Number(yearParam) : null;

    if (!q || !q.trim()) {
      return NextResponse.json({ results: [] });
    }

    if (selectedYear !== null && Number.isNaN(selectedYear)) {
      return NextResponse.json(
        { error: "Invalid year parameter" },
        { status: 400 }
      );
    }

    const embedding = await getEmbedding(q);

    const { data, error } = await supabase.rpc("match_newspaper_chunks", {
      query_embedding: embedding,
      match_count: 150, // Request more candidate matches to scan down to 25% accuracy
      filter_year: selectedYear,
    });

    if (error) {
      throw new Error(error.message);
    }

    const results = (data || [])
      .map((item: any) => ({
        id: item.id,
        page_id: item.page_id,
        year: item.year,
        issue: item.issue,
        page: item.page,
        date: item.date,
        headline: item.headline,
        snippet: item.chunk_text,
        image_path: item.image_path,
        image_url: item.image_url,
        similarity: item.similarity,
      }))
      .filter((item: any) => item.similarity >= 0.25); // Filter for matches with >= 25% accuracy

    return NextResponse.json({
      query: q,
      year: selectedYear,
      results,
    });
  } catch (err: any) {
    console.error("Search API error:", err);

    return NextResponse.json(
      { error: err.message || "Search failed" },
      { status: 500 }
    );
  }
}