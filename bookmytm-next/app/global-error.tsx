'use client';

/**
 * Last-resort boundary for errors thrown in the root layout itself. It replaces
 * <html>/<body>, so it cannot rely on the layout's fonts or the site chrome —
 * everything here is inline and self-contained.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 10% 10%, #1e5e3f 0%, #0a351f 45%, #021a0f 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.75rem' }}>Something went wrong</h1>
          <p style={{ color: '#bbf7d0', margin: '0 0 1.75rem', lineHeight: 1.7 }}>
            BookMyTM hit an unexpected error. Please try again, or reach us on +91 809 809 0880.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#3d6f2e',
              color: '#ffffff',
              border: 0,
              borderRadius: '9999px',
              padding: '0.9rem 2.25rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
