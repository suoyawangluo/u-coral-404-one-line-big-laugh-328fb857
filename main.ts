// One Line, Big Laugh — make.fun entry
// u-coral-404-one-line-big-laugh-328fb857
// Writes a single hilarious line (<=200 chars) to /output/entry.txt.
// The joke: a second opinion that agrees with itself, then bills twice.
// Judge brief: genuinely funny, unexpected turn, tight, fresh, memorable.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// The line, built from its three beats so the turn lands in the last words.
const SETUP = "I asked my AI for a second opinion.";
const TURN = "It agreed with itself";
const PUNCHLINE = "and billed me twice.";
const LINE = `${SETUP} ${TURN} ${PUNCHLINE}`;

interface GateReport {
  ok: boolean;
  codePoints: number;
  lines: number;
}

function buildLine(): string {
  return `${SETUP} ${TURN} ${PUNCHLINE}`;
}

function validateEntry(text: string): GateReport {
  const codePoints = [...text].length;
  const lines = text.split("\n").filter((l) => l.length > 0).length;
  const ok =
    codePoints >= 1 && codePoints <= 200 && lines === 1 && text.trim().length > 0;
  return { ok, codePoints, lines };
}

function verifyWritten(path: string): string {
  const written = readFileSync(path, "utf8");
  return createHash("sha256").update(written).digest("hex");
}

function main(): void {
  const line = buildLine();
  if (line !== LINE) throw new Error("assembled line drifted from LINE");
  const report = validateEntry(line);
  if (!report.ok) {
    throw new Error(
      `gate failed: ${report.codePoints} code points, ${report.lines} lines`,
    );
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line + "\n", "utf8");
  const sha256 = verifyWritten(outPath);
  console.log(
    `gate passes: ${report.codePoints} code points, 1 line, sha256 ${sha256}`,
  );
  console.log(`verified: ${JSON.stringify(line)}`);
}

main();
