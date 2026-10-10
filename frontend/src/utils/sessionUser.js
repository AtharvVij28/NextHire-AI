import { clearResumeAnalysis } from './resume';

const USER_KEY = 'nexthire_user';

export function loadSessionUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSessionUser(user) {
  if (!user) return null;
  const previous = loadSessionUser();
  const next = {
    ...(previous || {}),
    id: user.id ?? previous?.id ?? null,
    fullName: user.fullName || user.full_name || previous?.fullName || '',
    email: user.email || previous?.email || '',
    targetCareer: user.targetCareer ?? user.target_career ?? previous?.targetCareer ?? '',
    currentEducation:
      user.currentEducation ?? user.current_education ?? previous?.currentEducation ?? '',
    university: user.university ?? previous?.university ?? '',
    degree: user.degree ?? previous?.degree ?? '',
    semester: user.semester ?? previous?.semester ?? '',
    careerInterests: user.careerInterests ?? previous?.careerInterests ?? '',
    skills: user.skills ?? previous?.skills ?? [],
  };

  if (previous?.id && next.id && previous.id !== next.id) {
    clearResumeAnalysis();
    next.skills = user.skills ?? [];
  }

  sessionStorage.setItem(USER_KEY, JSON.stringify(next));
  return next;
}
