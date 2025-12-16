import type { NextApiRequest, NextApiResponse } from "next";
import natural from "natural";
import { removeStopwords } from "stopword";

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

function clean(text: string): string[] {
  const tokens = tokenizer.tokenize((text || "").toLowerCase());
  const cleaned = tokens.map(t => t.replace(/[^a-z]/g, ""));
  return removeStopwords(cleaned)
    .map(t => stemmer.stem(t))
    .filter(t => t.length > 2);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { examText = "", studyText = "" } = req.body || {};

  const examWords = clean(examText);
  const studyWords = clean(studyText);

  const freq: Record<string, number> = {};
  examWords.forEach(w => (freq[w] = (freq[w] || 0) + 1));

  const topics = Object.keys(freq)
    .sort((a, b) => freq[b] - freq[a])
    .slice(0, 8);

  const result = topics.map(t => {
    const examScore = freq[t];
    const studyScore = studyWords.filter(w => w === t).length;
    const gap = Math.max(0, examScore - studyScore);
    const level = gap >= 3 ? "HIGH" : gap >= 1 ? "MEDIUM" : "LOW";
    return { topic: t, level };
  });

  return res.status(200).json(result);
}
