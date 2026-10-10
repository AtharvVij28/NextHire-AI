/**
 * API service layer for NextHire AI.
 *
 * All backend communication should go through these functions.
 *
 * Resume Analyzer (live HTTP):
 *   POST /api/resume/upload          multipart field: "file"
 *   POST /api/resume/{id}/analyze
 *
 * In Vite dev, requests default to same-origin `/api` and are proxied
 * to FastAPI (see vite.config.js). Override with VITE_API_BASE_URL.
 *
 * Job matching, career recommendations, and interview practice also call the API.
 * Dashboard statistics still use local placeholders until that endpoint exists.
 */

import {
  mockDashboard,
  mockProfile,
} from '../data/mockData';
import { normalizeResumeAnalysis } from '../utils/resume';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

/** Simulated network delay for demo UX (non-resume mocks only) */
function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildUrl(path) {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
}

async function parseErrorMessage(response) {
  try {
    const data = await response.json();
    if (typeof data?.detail === 'string') return data.detail;
    if (Array.isArray(data?.detail)) {
      return data.detail.map((item) => item.msg || JSON.stringify(item)).join(' ');
    }
    if (data?.message) return data.message;
    if (data?.error) return data.error;
  } catch {
    // ignore JSON parse errors
  }
  return `Request failed (${response.status})`;
}

/**
 * Shared HTTP helper for JSON and multipart requests.
 */
async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let response;
  try {
    response = await fetch(buildUrl(path), {
      ...options,
      headers,
    });
  } catch {
    const error = new Error(
      'Cannot reach the NextHire AI API. Make sure the FastAPI server is running.'
    );
    error.status = 0;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(await parseErrorMessage(response));
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

// ---- Auth (placeholders) ----

export async function registerUser(userData) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      targetCareer: userData.targetCareer || null,
      currentEducation: userData.currentEducation || null,
    }),
  });
}

export async function loginUser(credentials) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });
}

// ---- Profile ----

export async function getProfile() {
  // TODO: GET /api/profile
  await delay(300);
  return { ...mockProfile, mock: true };
}

export async function updateProfile(profileData) {
  // TODO: PUT /api/profile
  await delay();
  return { ...mockProfile, ...profileData, mock: true };
}

// ---- Resume (requires FastAPI endpoints — see module docstring) ----

/**
 * Upload a resume file.
 * Expected: POST /api/resume/upload
 * Body: multipart/form-data with field name "file"
 * Response: { id: string, filename?: string, size?: number }
 */
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);

  const data = await request('/api/resume/upload', {
    method: 'POST',
    body: formData,
  });

  const id = data?.id || data?.resume_id || data?.resumeId;
  if (!id) {
    const error = new Error('Upload succeeded but no resume id was returned by the API.');
    error.status = 500;
    throw error;
  }

  return {
    id,
    filename: data.filename || file?.name || 'resume',
    size: data.size ?? file?.size ?? 0,
    ...data,
  };
}

/**
 * Analyze an uploaded resume.
 * Expected: POST /api/resume/{id}/analyze
 * Response: analysis object (normalized by normalizeResumeAnalysis)
 */
export async function analyzeResume(resumeId) {
  if (!resumeId) {
    const error = new Error('Missing resume id for analysis.');
    error.status = 400;
    throw error;
  }

  const data = await request(`/api/resume/${encodeURIComponent(resumeId)}/analyze`, {
    method: 'POST',
  });

  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
    const error = new Error('Analysis returned an empty response.');
    error.status = 502;
    throw error;
  }

  return normalizeResumeAnalysis({ ...data, resumeId });
}

/**
 * Convenience: upload then analyze in one frontend orchestration step.
 * Still uses the two backend endpoints above (no client-side AI).
 */
export async function uploadAndAnalyzeResume(file, { onProgress } = {}) {
  if (onProgress) onProgress('uploading');
  const uploaded = await uploadResume(file);

  if (onProgress) onProgress('analyzing');
  const analysis = await analyzeResume(uploaded.id);

  return {
    upload: uploaded,
    analysis: {
      ...analysis,
      filename: analysis.filename || uploaded.filename,
    },
  };
}

// ---- Job Matcher ----

export async function matchJob({ profile, jobDescription }) {
  return request('/api/job-matcher', {
    method: 'POST',
    body: JSON.stringify({ profile, jobDescription }),
  });
}

// ---- Career Mentor ----

export async function getCareerRecommendations(profile) {
  return request('/api/career/recommendations', {
    method: 'POST',
    body: JSON.stringify({ profile }),
  });
}

// ---- Interview Coach ----

export async function startInterview({ profile, role, difficulty, interviewType }) {
  return request('/api/interview/start', {
    method: 'POST',
    body: JSON.stringify({ profile, role, difficulty, interviewType }),
  });
}

export async function submitInterviewAnswer({ role, question, answer }) {
  return request('/api/interview/answer', {
    method: 'POST',
    body: JSON.stringify({ role, question, answer }),
  });
}

// ---- Dashboard ----

export async function getDashboard() {
  // TODO: GET /api/dashboard
  await delay(400);
  return { ...mockDashboard, mock: true };
}

// Exported for optional direct use / testing
export { API_BASE_URL, request };
