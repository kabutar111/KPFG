import { z } from "zod"; // Add zod for runtime type checking

// Define the schema for validation
const QuestionSchema = z.object({
  id: z.string(),
  fach: z.string(),
  fachgebiet: z.string(),
  thema: z.string(),
  question: z.string(),
  answer: z.string(),
  idealAnswer: z.string(),
  tags: z.array(z.string()),
  schwierigkeit: z.string(),
  kommentar: z.string()
});

const TeilSchema = z.object({
  id: z.string(),
  inhalt: z.string(),
  schwierigkeit: z.string(),
  questions: z.array(QuestionSchema).optional()
});

export const ExamProtocolSchema = z.object({
  id: z.string(),
  state: z.string(),
  examYear: z.string(),
  examMonth: z.string(),
  fach: z.string(),
  fachgebiet: z.string(),
  thema: z.string(),
  kategorie: z.string(),
  teil1: TeilSchema.extend({ questions: z.array(QuestionSchema) }),
  teil2: TeilSchema,
  teil3: TeilSchema.extend({ questions: z.array(QuestionSchema) }),
  kommentar: z.string(),
  schlagwoerter: z.string(),
  schwierigkeit: z.string(),
  pruefungskompetenz: z.string(),
  verbundenThemen: z.string()
});
