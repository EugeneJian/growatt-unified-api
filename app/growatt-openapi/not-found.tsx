import Link from "next/link";
import "./docs.css";

export default function GrowattDocsNotFoundPage() {
  return (
    <div className="growatt-docs-page">
      <div className="growatt-docs-shell">
        <main className="growatt-docs-main">
          <header className="growatt-docs-header">
            <h2>Document Not Found</h2>
            <p>The requested API document does not exist in the current OPENAPI set.</p>
          </header>
          <p>
            Return to{" "}
            <Link href="/growatt-openapi">
              /growatt-openapi
            </Link>{" "}
            to browse available documents.
          </p>
        </main>
      </div>
    </div>
  );
}
