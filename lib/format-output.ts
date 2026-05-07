export type ResumeRewriteOutput = {
  matchSummary: string;
  missingKeywords: string[];
  rewrittenSummary: string;
  rewrittenExperienceBullets: string[];
  skillsToHighlight: string[];
  warnings: string[];
};

function formatList(items: string[]) {
  if (!items.length) {
    return "None provided.";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

export function formatResumeRewriteOutput(output: ResumeRewriteOutput) {
  return [
    "Match summary",
    output.matchSummary,
    "",
    "Missing keywords",
    formatList(output.missingKeywords),
    "",
    "Rewritten professional summary",
    output.rewrittenSummary,
    "",
    "Rewritten experience bullets",
    formatList(output.rewrittenExperienceBullets),
    "",
    "Skills to highlight",
    formatList(output.skillsToHighlight),
    "",
    "Warning notes",
    formatList(output.warnings),
  ].join("\n");
}
