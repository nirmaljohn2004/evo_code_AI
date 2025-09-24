import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePsychometric } from "../contexts/PsychometricContext.tsx";

// Firebase
import { User as FirebaseUser } from "firebase/auth";
import { db } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore";

type Q = { id: string; text: string; dimension: "analysis" | "creativity" | "patience" };

const QUESTIONS: Q[] = [
  { id: "q1", text: "Prefer step-by-step, logical explanations.", dimension: "analysis" },
  { id: "q2", text: "Enjoy exploring multiple approaches and examples.", dimension: "creativity" },
  { id: "q3", text: "Comfortable with slower, detailed walkthroughs.", dimension: "patience" },
  { id: "q4", text: "Like concise, to-the-point tips.", dimension: "analysis" },
  { id: "q5", text: "Like visual or story-based explanations.", dimension: "creativity" },
];

const scale = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

interface PsychometricTestProps {
  user: FirebaseUser | null;
}

const PsychometricTest: React.FC<PsychometricTestProps> = ({ user }) => {
  const nav = useNavigate();
  const { setScore } = usePsychometric();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState<number>(0);
  const [saving, setSaving] = useState<boolean>(false);

  const total = QUESTIONS.length;
  const current = QUESTIONS[step];

  const completed = useMemo(() => Object.keys(answers).length === total, [answers, total]);

  const computeScore = () => {
    const sum = Object.values(answers).reduce((a, b) => a + b, 0);
    const raw = (sum / (total * 5)) * 100;
    return Math.round(raw);
  };

  const choose = (value: number) => {
    setAnswers((p) => ({ ...p, [current.id]: value }));
  };

  const next = () => {
    if (step < total - 1) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const submit = async () => {
    const s = computeScore();
    setScore(s); // optional local update for instant UI

    if (user) {
      try {
        setSaving(true);
        await setDoc(doc(db, "users", user.uid), { psychometricScore: s }, { merge: true });
      } catch (e) {
        console.error("Failed to save psychometric score:", e);
      } finally {
        setSaving(false);
      }
    }
    nav("/profile");
  };

  const selected = answers[current?.id ?? ""] ?? 0;

  return (
    <section style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>Psychometric Test</h2>
      <p style={{ marginBottom: 16 }}>
        Question {step + 1} of {total}
      </p>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
        <div style={{ marginBottom: 12, fontWeight: 600 }}>{current.text}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {scale.map((label, idx) => {
            const value = idx + 1;
            const isSelected = selected === value;
            return (
              <button
                key={label}
                onClick={() => choose(value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: isSelected ? "2px solid #111827" : "1px solid #d1d5db",
                  background: isSelected ? "#eef2ff" : "#fff",
                }}
              >
                {value}. {label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <button onClick={prev} disabled={step === 0} style={{ padding: "10px 16px", borderRadius: 8 }}>
          Previous
        </button>

        {step < total - 1 ? (
          <button
            onClick={next}
            disabled={!answers[current.id]}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #111827",
              background: answers[current.id] ? "#111827" : "#6b7280",
              color: "#fff",
              cursor: answers[current.id] ? "pointer" : "not-allowed",
            }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!completed || saving}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #111827",
              background: completed && !saving ? "#111827" : "#6b7280",
              color: "#fff",
              cursor: completed && !saving ? "pointer" : "not-allowed",
            }}
          >
            {saving ? "Saving..." : "Submit"}
          </button>
        )}
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={() => nav("/profile")} style={{ padding: "8px 12px", borderRadius: 8 }}>
          Cancel
        </button>
      </div>
    </section>
  );
};

export default PsychometricTest;
