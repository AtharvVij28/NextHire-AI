import { useId, useRef, useState } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import Button from './Button';
import { formatFileSize, RESUME_ACCEPT, validateResumeFile } from '../utils/resume';

/**
 * Drag-and-drop resume picker. Validation only — no upload logic here.
 */
export default function ResumeUpload({
  file,
  onFileSelect,
  onFileRemove,
  disabled = false,
  error = '',
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState('');

  function applyFile(nextFile) {
    const result = validateResumeFile(nextFile);
    if (!result.valid) {
      setLocalError(result.error);
      return;
    }
    setLocalError('');
    onFileSelect?.(nextFile);
  }

  function handleInputChange(e) {
    const selected = e.target.files?.[0];
    if (selected) applyFile(selected);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) applyFile(dropped);
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  }

  const displayError = error || localError;

  return (
    <div className="resume-upload">
      <div
        className={`resume-dropzone ${dragActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`.trim()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-describedby={displayError ? `${inputId}-error` : `${inputId}-hint`}
        aria-label="Resume upload dropzone"
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
      >
        <div className="resume-dropzone-icon" aria-hidden="true">
          <Upload size={28} />
        </div>
        <p className="resume-dropzone-title">Drag & drop your resume here</p>
        <p id={`${inputId}-hint`} className="resume-dropzone-hint">
          PDF or DOCX · Max 5 MB
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Choose Resume
        </Button>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          accept={RESUME_ACCEPT}
          disabled={disabled}
          onChange={handleInputChange}
          aria-label="Choose resume file"
        />
      </div>

      {file && (
        <div className="resume-file-chip" aria-live="polite">
          <div className="resume-file-meta">
            <span className="resume-file-icon" aria-hidden="true">
              <FileText size={18} />
            </span>
            <div>
              <p className="resume-file-name">{file.name}</p>
              <p className="resume-file-size">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Remove selected resume"
            disabled={disabled}
            onClick={onFileRemove}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {displayError && (
        <p id={`${inputId}-error`} className="form-error" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}
