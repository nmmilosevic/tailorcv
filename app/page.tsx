"use client";

import { FormEvent, useMemo, useState } from "react";
import { formatResumeRewriteOutput, ResumeRewriteOutput } from "@/lib/format-output";

const sampleWarnings = [
  "Do not claim experience you do not have.",
  "Keep metrics only when they are already true or can be verified.",
  "Use the rewritten bullets as a draft and adjust details before applying.",
];

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-200">
        {title}
      </h3>
      <div className="mt-3 text-sm leading-6 text-slate-200">{children}</div>
    </section>
  );
}

function TextAreaField({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-h-[360px] flex-col rounded-lg border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/20">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-white">
          {label}
        </label>
        <span className="text-xs tabular-nums text-slate-500">
          {value.length} chars
        </span>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-0 flex-1 resize-none rounded-md border border-white/10 bg-slate-900/80 p-4 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
      />
    </div>
  );
}

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobOffer, setJobOffer] = useState("");
  const [result, setResult] = useState<ResumeRewriteOutput | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const canSubmit = resume.trim().length >= 100 && jobOffer.trim().length >= 100;
  const formattedOutput = useMemo(
    () => (result ? formatResumeRewriteOutput(result) : ""),
    [result],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopied(false);
    setResult(null);

    if (!canSubmit) {
      setError("Resume and job offer must each be at least 100 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/rewrite-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume, jobOffer }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to rewrite the resume.");
      }

      setResult(data);
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Unable to rewrite the resume.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!formattedOutput) return;
    await navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32rem),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,1))]" />
      <div className="relative z-10">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
          <a href="#" className="text-lg font-semibold tracking-tight text-white">
            TailorCV
          </a>
          <a
            href="#tool"
            className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-300/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Open tool
          </a>
        </header>

        <section className="mx-auto grid min-h-[70dvh] w-full max-w-7xl items-center gap-10 px-5 pb-14 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-md border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-sm font-medium text-sky-100">
              Truthful resume alignment for real applications
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Tailor your resume to any job offer in seconds
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Paste your resume, paste the job offer, and get a clearer, more
              relevant, ATS-friendly version without inventing fake experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#tool"
                className="inline-flex h-12 items-center justify-center rounded-md bg-sky-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Rewrite my resume
              </a>
              <span className="inline-flex h-12 items-center text-sm text-slate-400">
                Local MVP. No login. No database.
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30">
            <div className="grid gap-3">
              {[
                "Find relevant overlap",
                "Surface missing keywords",
                "Rewrite content clearly",
                "Flag claims to avoid",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-md bg-slate-900/70 p-4 text-sm text-slate-200"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tool" className="border-t border-white/10 bg-slate-950/95">
          <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
            <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h2 className="text-3xl font-semibold tracking-normal text-white">
                  Resume rewrite tool
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Add your current resume and the job offer. The rewrite stays
                  grounded in your real background and focuses on relevance.
                </p>
              </div>
              <div className="text-sm text-slate-500">
                Minimum 100 characters per field
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 lg:grid-cols-2">
                <TextAreaField
                  id="resume"
                  label="Your current resume"
                  value={resume}
                  onChange={setResume}
                  placeholder="Paste your resume text here..."
                />
                <TextAreaField
                  id="job-offer"
                  label="Job offer"
                  value={jobOffer}
                  onChange={setJobOffer}
                  placeholder="Paste the job description here..."
                />
              </div>

              {error ? (
                <div className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-sky-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isLoading ? "Rewriting..." : "Rewrite my resume"}
              </button>
            </form>

            <div className="mt-9">
              {isLoading ? (
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
                  <div className="h-4 w-48 animate-pulse rounded bg-slate-700" />
                  <div className="mt-5 space-y-3">
                    <div className="h-3 animate-pulse rounded bg-slate-800" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-slate-800" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-800" />
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <h2 className="text-2xl font-semibold text-white">
                      Tailored output
                    </h2>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-medium text-slate-200 transition hover:border-sky-300/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      {copied ? "Copied" : "Copy output"}
                    </button>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <SectionBlock title="Match summary">
                      <p>{result.matchSummary}</p>
                    </SectionBlock>

                    <SectionBlock title="Missing keywords">
                      <ul className="space-y-2">
                        {result.missingKeywords.map((keyword) => (
                          <li key={keyword}>{keyword}</li>
                        ))}
                      </ul>
                    </SectionBlock>

                    <SectionBlock title="Rewritten professional summary">
                      <p>{result.rewrittenSummary}</p>
                    </SectionBlock>

                    <SectionBlock title="Skills to highlight">
                      <ul className="space-y-2">
                        {result.skillsToHighlight.map((skill) => (
                          <li key={skill}>{skill}</li>
                        ))}
                      </ul>
                    </SectionBlock>

                    <SectionBlock title="Rewritten experience bullets">
                      <ul className="list-disc space-y-2 pl-5">
                        {result.rewrittenExperienceBullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </SectionBlock>

                    <SectionBlock title="Warning notes">
                      <ul className="list-disc space-y-2 pl-5">
                        {(result.warnings.length ? result.warnings : sampleWarnings).map(
                          (warning) => (
                            <li key={warning}>{warning}</li>
                          ),
                        )}
                      </ul>
                    </SectionBlock>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-6 text-sm text-slate-400">
                  Your structured rewrite will appear here after analysis.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
