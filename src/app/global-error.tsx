"use client";

/* Replaces the root layout when it fails — keep it self-contained (no global CSS or fonts). */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en-PK">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#F2EFE9",
          color: "#101010",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "24px",
        }}
      >
        <title>Something went wrong — DIAMENTORY</title>
        <main style={{ maxWidth: 520 }}>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, letterSpacing: "0.34em", textTransform: "uppercase" }}>
            Diamentory
          </p>
          <h1 style={{ fontWeight: 400, fontSize: "clamp(2.25rem, 9vw, 3.5rem)", lineHeight: 1, margin: "24px 0 16px" }}>
            Something went <em>wrong.</em>
          </h1>
          <p style={{ fontFamily: "system-ui, sans-serif", color: "#33312F", lineHeight: 1.6 }}>
            Please try again. Your bag is saved on this device.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 24,
              minHeight: 48,
              padding: "0 28px",
              border: 0,
              background: "#101010",
              color: "#F2EFE9",
              fontFamily: "system-ui, sans-serif",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
