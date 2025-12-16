import { useState } from "react";

export default function Home() {
  const [examText, setExamText] = useState("");
  const [studyText, setStudyText] = useState("");
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examText, studyText }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>📘 Exam Paper Analyzer</h1>
      <p>
        Compare exam paper with study material and get priority levels for study.
      </p>

      <textarea
        rows={8}
        placeholder="Paste Exam Paper Here"
        style={{ width: "100%", marginBottom: 10 }}
        value={examText}
        onChange={(e) => setExamText(e.target.value)}
      />

      <textarea
        rows={8}
        placeholder="Paste Study Material Here"
        style={{ width: "100%", marginBottom: 10 }}
        value={studyText}
        onChange={(e) => setStudyText(e.target.value)}
      />

      <button onClick={analyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      <hr />

      {result.length > 0 && (
        <div>
          <h3>📊 Priority Output</h3>
          {result.map((r, i) => (
            <div key={i}>
              <b>{r.topic}</b> → <b>{r.level}</b>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
