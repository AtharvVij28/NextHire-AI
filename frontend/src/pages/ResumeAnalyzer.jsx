import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Button from '../components/Button';
import ResumeUpload from '../components/ResumeUpload';
import { uploadAndAnalyzeResume } from '../services/api';
import { saveResumeAnalysis, validateResumeFile } from '../utils/resume';

const STATUS = {
  idle: 'idle',
  uploading: 'uploading',
  analyzing: 'analyzing',
};

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(STATUS.idle);
  const [error, setError] = useState('');

  const busy = status === STATUS.uploading || status === STATUS.analyzing;

  function handleFileSelect(nextFile) {
    setError('');
    setFile(nextFile);
  }

  function handleFileRemove() {
    setFile(null);
    setError('');
  }

  async function handleAnalyze() {
    if (busy) return;

    const validation = validateResumeFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError('');
    setStatus(STATUS.uploading);

    try {
      const { analysis } = await uploadAndAnalyzeResume(file, {
        onProgress: (phase) => {
          setStatus(phase === 'analyzing' ? STATUS.analyzing : STATUS.uploading);
        },
      });

      saveResumeAnalysis(analysis);
      navigate('/resume/results', { state: { analysis } });
    } catch (err) {
      setError(err?.message || 'Unable to analyze resume. Please try again.');
      setStatus(STATUS.idle);
    }
  }

  return (
    <div className="resume-page">
      <div className="page-header">
        <h1>AI Resume Analyzer</h1>
        <p>Upload your resume and discover how job-ready it is.</p>
      </div>

      <div className="dash-panel resume-analyzer-card">
        <ResumeUpload
          file={file}
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          disabled={busy}
          error=""
        />

        {busy && (
          <div className="resume-processing" role="status" aria-live="polite">
            <Loader2 className="resume-spin" size={22} aria-hidden="true" />
            <div>
              <p className="resume-processing-title">
                {status === STATUS.uploading ? 'Uploading your resume...' : 'Analyzing your resume...'}
              </p>
              <p className="resume-processing-text">
                {status === STATUS.uploading
                  ? 'Sending your file securely to the NextHire AI API.'
                  : 'The backend is scoring skills, projects, education, and structure.'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="form-error resume-page-error" role="alert">
            {error}
          </p>
        )}

        <div className="resume-actions">
          <Button
            type="button"
            size="lg"
            block
            disabled={!file || busy}
            onClick={handleAnalyze}
          >
            {busy ? 'Please wait...' : 'Analyze Resume'}
          </Button>
          <p className="form-hint" style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            Analysis runs on the FastAPI backend — this page does not run AI in the browser.
          </p>
        </div>
      </div>
    </div>
  );
}
