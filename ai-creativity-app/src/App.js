import { useState } from "react";
import "./App.css";
import HomePage from "./pages/Home";
import ResultsPage from "./pages/Result";

/* ── Scoring Engine ──────────────────────────────── */
function scoreText(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const lower = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const uniqueWords = new Set(lower.split(/\s+/).map(w => w.replace(/[^a-z]/g, '')).filter(Boolean));

  // Length score (0-3)
  let length = 0;
  if (words > 100) length = 3;
  else if (words > 60) length = 2;
  else if (words > 20) length = 1;

  // Vocabulary richness (0-3)
  const ratio = words > 0 ? uniqueWords.size / words : 0;
  let vocab = 0;
  if (ratio > 0.7) vocab = 3;
  else if (ratio > 0.5) vocab = 2;
  else if (ratio > 0.3) vocab = 1;

  // Expressiveness (0-3)
  const expressiveWords = [
    "imagine", "feel", "believe", "wonder", "dream", "passion",
    "beautiful", "amazing", "incredible", "fascinating", "remarkable",
    "however", "although", "nevertheless", "furthermore", "therefore",
    "vibrant", "illuminate", "transform", "inspire", "captivate"
  ];
  let expression = Math.min(
    Math.floor(expressiveWords.filter(w => lower.includes(w)).length * 0.8),
    3
  );

  // Originality (0-3)
  const clichés = ["in conclusion", "first of all", "in my opinion", "it is important",
                   "as we all know", "at the end of the day", "last but not least"];
  const clicheCount = clichés.filter(c => lower.includes(c)).length;
  let originality = Math.max(3 - clicheCount, 0);

  // Structure bonus (0-3) - sentence variety
  let structure = 0;
  if (sentences > 1) {
    const avgLen = words / sentences;
    if (avgLen > 8 && avgLen < 25) structure = 3;
    else if (avgLen > 5 && avgLen < 35) structure = 2;
    else structure = 1;
  }

  const total = length + vocab + expression + originality + structure;
  const maxScore = 15;

  return {
    total,
    maxScore,
    percentage: Math.round((total / maxScore) * 100),
    creativity: Math.round(((expression + originality) / 6) * 100),
    originalityPct: Math.round((originality / 3) * 100),
    qualityPct: Math.round(((length + vocab + structure) / 9) * 100),
    length, vocab, expression, originality, structure,
    words, sentences,
    uniqueWordCount: uniqueWords.size
  };
}

function generateInsights(humanScore, aiScore) {
  const insights = [];

  if (humanScore.creativity > aiScore.creativity) {
    insights.push({ icon: "🎨", text: "<strong>Your creative flair shines!</strong> You used more expressive and original language than the AI. Human creativity often brings emotional depth that AI struggles to match." });
  } else if (aiScore.creativity > humanScore.creativity) {
    insights.push({ icon: "🤖", text: "<strong>AI shows creative range.</strong> The AI used a wider variety of expressive words. However, AI creativity is pattern-based — it remixes training data rather than generating truly novel ideas." });
  }

  if (humanScore.words > aiScore.words) {
    insights.push({ icon: "📝", text: `<strong>You wrote more!</strong> ${humanScore.words} words vs AI's ${aiScore.words}. More words don't always mean better quality, but it shows dedication.` });
  } else {
    insights.push({ icon: "⚡", text: `<strong>AI was more verbose.</strong> ${aiScore.words} words vs your ${humanScore.words}. AI tends to generate longer responses by default — conciseness can be a strength!` });
  }

  if (humanScore.originalityPct > aiScore.originalityPct) {
    insights.push({ icon: "💡", text: "<strong>More original!</strong> Your writing avoided common clichés. True originality is a uniquely human trait that AI finds hard to replicate." });
  }

  if (humanScore.vocab > aiScore.vocab) {
    insights.push({ icon: "📚", text: "<strong>Richer vocabulary.</strong> You used a more diverse set of words, showing linguistic range and depth." });
  }

  insights.push({ icon: "🧠", text: "<strong>Key takeaway:</strong> AI excels at structure and fluency, while humans bring authenticity, emotion, and lived experience. The best results often come from human-AI collaboration!" });

  return insights;
}

export default function App() {
  const [page, setPage] = useState("home");
  const [results, setResults] = useState(null);

  const handleSubmit = (data) => {
    setResults(data);
    setPage("results");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setPage("home");
    setResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {page === "home"
        ? <HomePage onSubmit={handleSubmit} scoreText={scoreText} />
        : <ResultsPage
            data={results}
            onBack={handleBack}
            generateInsights={generateInsights}
          />
      }
    </div>
  );
}