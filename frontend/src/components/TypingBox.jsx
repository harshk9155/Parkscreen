// Pure UI component — exposes onKeyDown and onKeyUp as props.
// The actual keystroke logic lives in useKeystroke hook (not here).

export default function TypingBox({ onKeyDown, onKeyUp, onInput, isRecording }) {
  return (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
      <textarea
        style={{
          width: '100%',
          minHeight: '100px',
          padding: '16px 18px',
          border: `2px solid ${isRecording ? 'var(--teal)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          fontSize: '16px',
          fontFamily: 'DM Sans, sans-serif',
          color: 'var(--text)',
          resize: 'vertical',
          transition: 'border-color 0.2s',
          outline: 'none',
          background: 'var(--white)',
        }}
        placeholder="Click here and start typing the sentence above..."
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onInput={onInput}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      {/* Recording indicator */}
      <div style={{
        position: 'absolute', bottom: '14px', right: '14px',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '12px', color: 'var(--text-light)',
        pointerEvents: 'none',
      }}>
        {isRecording && (
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--teal)',
            animation: 'blink 1s infinite',
          }}/>
        )}
        <span>{isRecording ? 'Recording...' : 'Ready to record'}</span>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}