export default function InterviewQuestion({
  question,
  questionNumber,
  totalQuestions,
  children,
}) {
  return (
    <div className="interview-question">
      <p className="interview-question-meta">
        Question {questionNumber} of {totalQuestions}
      </p>
      <h2 className="interview-question-text">{question}</h2>
      {children}
    </div>
  );
}
