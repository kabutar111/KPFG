import { z } from "zod"; // Add zod for runtime type checking

interface IndexedQuestion {
  [key: string]: {
    question: Question;
    teilId: string;
    protokollId: string;
  }
}

export const transformProtocolData = (protocol: z.infer<typeof ExamProtocolSchema>) => {
  const questionIndex: IndexedQuestion = {};
  const fachIndex: { [key: string]: string[] } = {};
  const themenIndex: { [key: string]: string[] } = {};

  // Index questions for O(1) lookup
  const indexQuestions = (teil: typeof protocol.teil1, teilId: string) => {
    teil.questions?.forEach(q => {
      questionIndex[q.id] = {
        question: q,
        teilId,
        protokollId: protocol.id
      };

      // Index by fach
      if (!fachIndex[q.fach]) fachIndex[q.fach] = [];
      fachIndex[q.fach].push(q.id);

      // Index by thema
      if (!themenIndex[q.thema]) themenIndex[q.thema] = [];
      themenIndex[q.thema].push(q.id);
    });
  };

  indexQuestions(protocol.teil1, 'teil1');
  indexQuestions(protocol.teil3, 'teil3');

  return {
    questionIndex,
    fachIndex,
    themenIndex,
    metadata: {
      id: protocol.id,
      fach: protocol.fach,
      thema: protocol.thema,
      schwierigkeit: protocol.schwierigkeit
    }
  };
};
