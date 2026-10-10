/**
 * Resume Analyzer helpers (validation & formatting only — no AI logic).
 */

export const RESUME_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const RESUME_ACCEPT = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const RESUME_ANALYSIS_STORAGE_KEY = 'nexthire_resume_analysis';

const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getFileExtension(filename = '') {
  const idx = filename.lastIndexOf('.');
  return idx >= 0 ? filename.slice(idx).toLowerCase() : '';
}

/**
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateResumeFile(file) {
  if (!file) {
    return { valid: false, error: 'Please select a resume file to upload.' };
  }

  const ext = getFileExtension(file.name);
  const mimeOk = !file.type || ALLOWED_MIME_TYPES.includes(file.type);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  if (!extOk || (!mimeOk && file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a PDF or DOCX resume.',
    };
  }

  if (file.size <= 0) {
    return { valid: false, error: 'The selected file appears to be empty.' };
  }

  if (file.size > RESUME_MAX_BYTES) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${formatFileSize(RESUME_MAX_BYTES)}.`,
    };
  }

  return { valid: true };
}

/** Category weights used by the scoring model (for UI display). */
export const SCORE_WEIGHTS = {
  skills: 25,
  projects: 20,
  education: 15,
  experience: 15,
  keywords: 15,
  structure: 10,
};

export const BREAKDOWN_LABELS = {
  skills: 'Skills',
  projects: 'Projects',
  education: 'Education',
  experience: 'Experience',
  keywords: 'Keywords',
  structure: 'Structure',
};

/**
 * Normalize backend analysis payloads into a stable UI shape.
 * Accepts either the planned contract or light aliases.
 */
export function normalizeResumeAnalysis(raw = {}) {
  const breakdownSource = raw.breakdown || raw.scores || {};

  const breakdown = {
    skills: Number(breakdownSource.skills ?? 0),
    projects: Number(breakdownSource.projects ?? 0),
    education: Number(breakdownSource.education ?? 0),
    experience: Number(breakdownSource.experience ?? 0),
    keywords: Number(breakdownSource.keywords ?? 0),
    structure: Number(breakdownSource.structure ?? 0),
  };

  const infoSource = raw.info || raw.resume_info || raw.resumeInfo || {};

  return {
    resumeId: raw.resumeId || raw.resume_id || raw.id || null,
    overallScore: Number(raw.overallScore ?? raw.overall_score ?? raw.score ?? 0),
    breakdown,
    weights: raw.weights || SCORE_WEIGHTS,
    strengths: Array.isArray(raw.strengths) ? raw.strengths : [],
    improvements: Array.isArray(raw.improvements)
      ? raw.improvements
      : Array.isArray(raw.areas_to_improve)
        ? raw.areas_to_improve
        : Array.isArray(raw.areasToImprove)
          ? raw.areasToImprove
          : [],
    extractedSkills: Array.isArray(raw.extractedSkills)
      ? raw.extractedSkills
      : Array.isArray(raw.extracted_skills)
        ? raw.extracted_skills
        : Array.isArray(raw.skills)
          ? raw.skills
          : [],
    info: {
      name: infoSource.name || infoSource.full_name || infoSource.fullName || '',
      education: asList(infoSource.education),
      projects: asList(infoSource.projects),
      experience: asList(infoSource.experience),
      certifications: asList(infoSource.certifications),
    },
    filename: raw.filename || null,
    mock: Boolean(raw.mock),
  };
}

function asList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [String(value)];
}

export function saveResumeAnalysis(analysis) {
  sessionStorage.setItem(RESUME_ANALYSIS_STORAGE_KEY, JSON.stringify(analysis));
}

export function loadResumeAnalysis() {
  try {
    const raw = sessionStorage.getItem(RESUME_ANALYSIS_STORAGE_KEY);
    if (!raw) return null;
    return normalizeResumeAnalysis(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function clearResumeAnalysis() {
  sessionStorage.removeItem(RESUME_ANALYSIS_STORAGE_KEY);
}
