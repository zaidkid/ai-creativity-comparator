import { useState } from "react";

const GEMINI_KEY = process.env.REACT_APP_GEMINI_KEY;

const TASKS = [
  {
    id: "story",
    icon: "✍️",
    name: "Short Story",
    desc: "Write a creative mini-story",
    prompt: (topic, humanText) => `A human wrote the following about "${topic}":\n\n"${humanText}"\n\nNow write your own version about "${topic}" in the SAME style and format as the human's text above. Match their approach — if they wrote an essay, write an essay; if they wrote a story, write a story. Keep a similar length (5-8 sentences). Be creative, insightful, and original.`,
    placeholder: "Once upon a time..."
  },
  {
    id: "essay",
    icon: "📝",
    name: "Essay Writing",
    desc: "Write a structured essay or opinion piece",
    prompt: (topic, humanText) => `A human wrote the following essay about "${topic}":\n\n"${humanText}"\n\nNow write your own essay about "${topic}" in a similar style and length. Present a clear argument or perspective, use supporting points, examples, and a strong conclusion. Keep it 5-10 sentences. Be thoughtful and articulate.`,
    placeholder: "In today's world..."
  },
  {
    id: "question",
    icon: "💬",
    name: "Answer a Question",
    desc: "Share your thoughts & perspective",
    prompt: (topic, humanText) => `A human wrote the following about "${topic}":\n\n"${humanText}"\n\nNow write your own version about "${topic}" in the SAME style and format as the human's text above. Match their approach — if they wrote an opinion, write an opinion; if they gave examples, give examples. Keep a similar length (5-8 sentences). Be thoughtful, creative, and use vivid examples.`,
    placeholder: "I think that..."
  },
  {
    id: "poster",
    icon: "🎨",
    name: "Design Description",
    desc: "Describe a poster or visual design",
    prompt: (topic, humanText) => `A human wrote the following about "${topic}":\n\n"${humanText}"\n\nNow write your own version about "${topic}" in the SAME style and format as the human's text above. Match their approach. Keep a similar length (5-8 sentences). Be creative and descriptive.`,
    placeholder: "The poster would feature..."
  }
];

function generateFallback(taskId, topic) {
  const t = topic || "this subject";
  if (taskId === "story") {
    return `In a world shaped by ${t}, everything changed the day someone dared to look at it differently. The air itself seemed to hum with possibility, carrying whispers of ideas yet to be born. A young dreamer stood at the crossroads of convention and imagination, choosing the path less traveled. With every step forward, the landscape of ${t} transformed — old walls crumbled, new bridges formed, and colors unseen before painted the horizon. The journey wasn't easy, but it was real, raw, and undeniably human. And in that authenticity lay the most powerful force of all: the courage to create something new from something familiar.`;
  }
  if (taskId === "poster") {
    return `The poster for "${t}" features a bold split-screen composition — one half rendered in clean, geometric AI-generated patterns of electric blue and silver, the other in warm, hand-painted textures of coral and gold. At the center, a large lightbulb icon merges both styles, symbolizing the fusion of human imagination and technological precision. The typography uses a modern sans-serif font for the title "${t}" in oversized white letters with a subtle gradient shadow. Surrounding the central image are floating icons — pencils, gears, neurons, and sparks — creating a dynamic border that draws the eye inward. The bottom section features a clean dark bar with event details in minimal white text, grounding the design with professionalism.`;
  }
  if (taskId === "essay") {
    return `${t} is one of the most important yet undervalued aspects of modern education. While traditional schooling emphasizes memorization and standardized testing, true learning happens when students are given the freedom to think independently and express their unique perspectives. Studies consistently show that students who engage in creative problem-solving develop stronger critical thinking skills and emotional intelligence. Consider how the greatest innovations — from the light bulb to the smartphone — were born not from following instructions, but from daring to ask "what if?" Furthermore, ${t} builds resilience, teaching students that failure is not an endpoint but a necessary step toward growth. In conclusion, nurturing ${t} in educational settings isn't optional — it's essential for preparing the next generation to tackle the complex challenges of tomorrow.`;
  }
  // Default: question/answer
  return `${t} is a multifaceted concept that goes far beyond surface-level understanding. At its core, it involves the ability to think divergently, challenge assumptions, and connect seemingly unrelated ideas into something meaningful. Research shows that fostering ${t} requires an environment where curiosity is encouraged and failure is seen as a stepping stone rather than an endpoint. The most impactful breakthroughs in history — from scientific discoveries to artistic masterpieces — have emerged when individuals dared to question the status quo. Ultimately, ${t} isn't just a skill; it's a mindset that transforms how we see and interact with the world around us.`;
}

export default function HomePage({ onSubmit, scoreText }) {
  const [task, setTask] = useState("story");
  const [topic, setTopic] = useState("");
  const [human, setHuman] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const currentTask = TASKS.find(t => t.id === task);

  const run = async () => {
    if (!topic.trim()) {
      setErr("Pick a topic first — what should we write about?");
      return;
    }
    if (!human.trim()) {
      setErr("Write your version first — even a few lines count!");
      return;
    }

    setErr("");
    setLoading(true);

    let aiText = "";
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: currentTask.prompt(topic, human) }]
            }]
          })
        }
      );

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) throw new Error("No AI response received");
    } catch (e) {
      console.error("API Error:", e);
      setErr("⚠️ AI API couldn't respond — showing a demo response instead. Try again later for a live AI response.");
      aiText = generateFallback(task, topic);
    }

    const humanScore = scoreText(human);
    const aiScore = scoreText(aiText);

    onSubmit({
      task: currentTask.name,
      taskId: task,
      topic,
      human,
      aiOut: aiText,
      scores: { human: humanScore, ai: aiScore }
    });

    setLoading(false);
  };

  return (
    <div className="page-home">
      <div className="wrap">
        {/* Navigation */}
        <nav className="nav">
          <div className="nav-logo">Creativity<span>Lab</span></div>
          <div className="nav-steps">
            <span className="step-indicator active">1</span>
            <span className="step-line" />
            <span className="step-indicator">2</span>
          </div>
        </nav>

        {/* Header */}
        <header className="header">
          <div className="eyebrow">Step 1 of 2</div>
          <h1 className="headline">
            Your words vs<br /><em>AI's words</em>
          </h1>
          <p className="sub">
            Pick a task, choose a topic, write your version — then see how
            your creativity compares to artificial intelligence.
          </p>
        </header>

        {/* Task Selector */}
        <div className="task-section">
          <div className="task-label">Choose your challenge</div>
          <div className="task-grid">
            {TASKS.map(t => (
              <div
                key={t.id}
                className={`task-card ${task === t.id ? 'selected' : ''}`}
                onClick={() => setTask(t.id)}
                id={`task-${t.id}`}
              >
                <span className="task-icon">{t.icon}</span>
                <div className="task-name">{t.name}</div>
                <div className="task-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Input */}
        <div className="topic-section">
          <div className="topic-label">What's the topic?</div>
          <input
            id="topic-input"
            className="topic-input"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. Space exploration, Friendship, Climate change..."
          />
        </div>

        {/* Writing Panels */}
        <div className="cols">
          <div className="panel panel-human">
            <div className="panel-head">
              <span className="pdot pdot-h" />
              <span className="ptitle">Your answer</span>
              <span className="ptag ptag-h">Human</span>
            </div>
            <textarea
              id="human-input"
              className="textarea"
              value={human}
              onChange={e => setHuman(e.target.value)}
              placeholder={currentTask.placeholder}
            />
          </div>

          <div className="panel panel-ai">
            <div className="panel-head">
              <span className="pdot pdot-a" />
              <span className="ptitle">AI's answer</span>
              <span className="ptag ptag-a">AI</span>
            </div>
            <div className="ai-idle">
              {loading ? (
                <>
                  <div className="ldots"><span /><span /><span /></div>
                  <div className="ai-idle-text">AI is thinking...</div>
                </>
              ) : (
                <>
                  <div className="ai-orb">◈</div>
                  <div className="ai-idle-text">AI will respond after you submit</div>
                </>
              )}
            </div>
          </div>
        </div>

        {err && <div className="err">{err}</div>}

        <button
          id="btn-compare"
          className="btn-run"
          onClick={run}
          disabled={loading}
        >
          {loading ? "✨ Generating AI response…" : "See the comparison →"}
        </button>
      </div>
    </div>
  );
}