import { loadResumeAnalysis } from './resume';
import { loadSessionUser } from './sessionUser';

export const ANALYSIS_GATED_PATHS = ['/job-matcher', '/career-mentor', '/interview', '/settings'];

export function hasResumeAnalysis() {
  return Boolean(loadResumeAnalysis());
}

export function buildResumeProfile() {
  const analysis = loadResumeAnalysis();
  const user = loadSessionUser() || {};
  const info = analysis?.info || {};

  return {
    name: info.name || user.fullName || '',
    targetCareer: user.targetCareer || '',
    skills: analysis?.extractedSkills || [],
    education: info.education || [],
    projects: info.projects || [],
    experience: info.experience || [],
    certifications: info.certifications || [],
    strengths: analysis?.strengths || [],
    improvements: analysis?.improvements || [],
  };
}
