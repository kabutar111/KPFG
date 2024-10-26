export const generateMarkdownTemplates = {
  teil1: (data: any) => `# ${data.fach} - ${data.fachgebiet}
## Überblick
${data.teil1.inhalt}

### Kernpunkte
- Punkt 1
- Punkt 2
- Punkt 3

### Fragen
${data.teil1.questions.map((q: any, i: number) => `
#### Frage ${i + 1}: ${q.question}
**Antwort:** ${q.answer}

**Ideale Antwort:**
${q.idealAnswer}

**Kommentar:**
${q.kommentar}
`).join('\n')}
`,

  teil2: (data: any) => `## Untersuchungsergebnisse
${data.teil2.inhalt}

### Wichtige Befunde
- Befund 1
- Befund 2
- Befund 3

### Differentialdiagnosen
1. Diagnose 1
2. Diagnose 2
3. Diagnose 3
`,

  teil3: (data: any) => `## Therapie und Management
${data.teil3.inhalt}

### Behandlungsplan
1. Schritt 1
2. Schritt 2
3. Schritt 3

### Fragen
${data.teil3.questions.map((q: any, i: number) => `
#### Frage ${i + 1}: ${q.question}
**Antwort:** ${q.answer}

**Ideale Antwort:**
${q.idealAnswer}

**Kommentar:**
${q.kommentar}
`).join('\n')}
`
};
