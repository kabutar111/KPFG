import { cacheProtocol, getCachedProtocol } from './cache';
import { ExamProtocolSchema } from './jsonValidator';

export const loadProtocol = async (jsonData: unknown) => {
  try {
    // Validate JSON structure
    const validatedData = ExamProtocolSchema.parse(jsonData);
    
    // Transform and cache data
    await cacheProtocol(validatedData);
    
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    console.error('Invalid protocol data:', error);
    return {
      success: false,
      error: 'Invalid protocol format'
    };
  }
};

export const getProtocolQuestions = async (
  protocolId: string,
  filters?: {
    fach?: string;
    thema?: string;
    schwierigkeit?: string;
  }
) => {
  const cached = await getCachedProtocol(protocolId);
  if (!cached) return null;

  // Apply filters if any
  if (filters) {
    const { questionIndex, fachIndex, themenIndex } = cached;
    let questionIds = new Set<string>();

    if (filters.fach) {
      fachIndex[filters.fach]?.forEach(id => questionIds.add(id));
    }
    if (filters.thema) {
      themenIndex[filters.thema]?.forEach(id => questionIds.add(id));
    }

    return Array.from(questionIds).map(id => questionIndex[id]);
  }

  return cached;
};
