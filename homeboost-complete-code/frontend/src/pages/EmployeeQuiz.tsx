import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardShell } from '../components/DashboardShell';

type Option = { id: number; option_text: string };
type Question = { id: number; question_text: string; options: Option[] };
type QuizData = { quiz: { id: number; title: string; description: string }; questions: Question[] };

export function EmployeeQuiz() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  useEffect(() => { api<QuizData>('/quizzes/active').then(setQuiz).catch((err) => setStatus(err instanceof Error ? err.message : 'No active quiz')); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quiz) return;
    const form = new FormData(event.currentTarget);
    const answers = quiz.questions.map((question) => ({ questionId: question.id, optionId: Number(form.get(String(question.id))) }));
    try {
      const result = await api<{ submissionId: number; score: number }>(`/quizzes/${quiz.quiz.id}/submit`, { method: 'POST', body: JSON.stringify({ answers }) });
      setStatus(`Submitted. Readiness score: ${result.score}. Your team can follow up with next steps.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Quiz submit failed');
    }
  }

  return (
    <DashboardShell title="Readiness Quiz">
      <form onSubmit={submit} className="card max-w-3xl space-y-6">
        <div>
          <p className="kicker">Assessment</p>
          <h2 className="mt-2 text-2xl font-black">{quiz?.quiz.title || 'Loading quiz...'}</h2>
          <p className="mt-2 text-slate-600">{quiz?.quiz.description}</p>
        </div>
        {quiz?.questions.map((question) => (
          <fieldset key={question.id} className="rounded-2xl border border-slate-200 p-4">
            <legend className="px-2 font-bold">{question.question_text}</legend>
            <div className="mt-3 space-y-2">
              {question.options.map((option) => (
                <label className="flex items-center gap-2 text-sm text-slate-700" key={option.id}>
                  <input required type="radio" name={String(question.id)} value={option.id} />
                  {option.option_text}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button className="btn-primary" disabled={!quiz}>Submit quiz</button>
        {status ? <p className="rounded-xl bg-brand-50 p-3 text-sm font-semibold text-brand-700">{status}</p> : null}
      </form>
    </DashboardShell>
  );
}
