import { useEffect, useState } from "react";

export default function ResultsPage({ data, onBack, generateInsights }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { task, topic, human, aiOut, scores } = data;
  const hs = scores.human;
  const as_ = scores.ai;

  const winner = hs.total > as_.total ? "human" : as_.total > hs.total ? "ai" : "tie";
  const insights = generateInsights(hs, as_);

  const metrics = [
    { name: "Creativity", humanVal: hs.creativity, aiVal: as_.creativity },
    { name: "Originality", humanVal: hs.originalityPct, aiVal: as_.originalityPct },
    { name: "Quality", humanVal: hs.qualityPct, aiVal: as_.qualityPct },
    { name: "Expression", humanVal: Math.round((hs.expression / 3) * 100), aiVal: Math.round((as_.expression / 3) * 100) },
    { name: "Vocabulary", humanVal: Math.round((hs.vocab / 3) * 100), aiVal: Math.round((as_.vocab / 3) * 100) },
  ];

  return (
    <div className="page-results">
      <div className="wrap">
        {/* Navigation */}
        <nav className="nav">
          <div className="nav-logo">Creativity<span>Lab</span></div>
          <div className="nav-steps">
            <span className="step-indicator done">✓</span>
            <span className="step-line active" />
            <span className="step-indicator active">2</span>
          </div>
        </nav>

        <button id="btn-back" className="btn-back" onClick={onBack}>
          ← Try another
        </button>

        {/* Results Header */}
        <header className="results-header">
          <div className="eyebrow">Analysis Complete</div>
          <div className="results-task-badge">{task}</div>
          <h1 className="headline">
            The <em>Results</em> are in
          </h1>
          <div className="results-topic">"{topic}"</div>
        </header>

        {/* Winner Banner */}
        <div className="winner-banner">
          <div className="winner-trophy">
            {winner === "tie" ? "🤝" : "🏆"}
          </div>
          <div className={`winner-text ${
            winner === "human" ? "human-wins" :
            winner === "ai" ? "ai-wins" : "tie-result"
          }`}>
            {winner === "human" ? "You Won!" :
             winner === "ai" ? "AI Takes This Round" :
             "It's a Tie!"}
          </div>
          <div className="winner-sub">
            {winner === "human"
              ? "Your creativity outshone artificial intelligence!"
              : winner === "ai"
              ? "AI scored higher, but human creativity is irreplaceable."
              : "Human and AI creativity are neck and neck!"}
          </div>
        </div>

        {/* Score Overview */}
        <div className="scores-overview">
          <div className={`score-big-card human-card ${winner === "human" ? "winner-card" : ""}`}>
            <div className="score-label">👤 You</div>
            <div className="score-number">
              {animated ? hs.total : 0}
              <span className="score-max">/{hs.maxScore}</span>
            </div>
          </div>

          <div className="vs-divider">
            <div className="vs-circle">VS</div>
          </div>

          <div className={`score-big-card ai-card ${winner === "ai" ? "winner-card" : ""}`}>
            <div className="score-label">🤖 AI</div>
            <div className="score-number">
              {animated ? as_.total : 0}
              <span className="score-max">/{as_.maxScore}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{hs.words}</div>
            <div className="stat-label">Your Words</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">{as_.words}</div>
            <div className="stat-label">AI Words</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{Math.abs(hs.total - as_.total)}</div>
            <div className="stat-label">Score Diff</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="breakdown-section">
          <div className="section-title">
            <span className="icon">📊</span> Detailed Breakdown
          </div>
          {metrics.map((m, i) => (
            <div className="metric-row" key={m.name}>
              <div className="metric-name">{m.name}</div>
              <div className="metric-bar-wrap">
                <div
                  className="metric-bar human-bar"
                  style={{
                    width: animated ? `${m.humanVal}%` : '0%',
                    transitionDelay: `${i * 0.15}s`
                  }}
                />
              </div>
              <div className="metric-value human-val">{m.humanVal}%</div>
              <div className="metric-bar-wrap">
                <div
                  className="metric-bar ai-bar"
                  style={{
                    width: animated ? `${m.aiVal}%` : '0%',
                    transitionDelay: `${i * 0.15 + 0.08}s`
                  }}
                />
              </div>
              <div className="metric-value ai-val">{m.aiVal}%</div>
            </div>
          ))}
        </div>

        {/* Response Previews */}
        <div className="responses-section">
          <div className="section-title">
            <span className="icon">📄</span> Side-by-Side Responses
          </div>
          <div className="response-grid">
            <div className="response-card human-response">
              <div className="response-header">
                <span className="pdot pdot-h" />
                <span className="ptitle">Your Response</span>
                <span className="ptag ptag-h">Human</span>
              </div>
              <div className="response-body">{human}</div>
            </div>
            <div className="response-card ai-response">
              <div className="response-header">
                <span className="pdot pdot-a" />
                <span className="ptitle">AI's Response</span>
                <span className="ptag ptag-a">AI</span>
              </div>
              <div className="response-body">{aiOut}</div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="insights-section">
          <div className="section-title">
            <span className="icon">💡</span> Key Insights
          </div>
          {insights.map((insight, i) => (
            <div className="insight-card" key={i}>
              <span className="insight-icon">{insight.icon}</span>
              <div
                className="insight-text"
                dangerouslySetInnerHTML={{ __html: insight.text }}
              />
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button className="btn-run" onClick={onBack} style={{ maxWidth: '400px' }}>
            🔄 Try Another Challenge
          </button>
        </div>
      </div>
    </div>
  );
}