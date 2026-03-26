import { ingestRBICirculars, ingestSEBICirculars, fetchDocumentContent } from "../src/lib/ingestion";
import { summarizeDocument } from "../src/lib/summarizer";
import fs from "fs/promises";
import path from "path";

async function main() {
  console.log("=== PolicyAI Ingestion Pipeline ===\n");

  console.log("Fetching RBI circulars...");
  const rbiDocs = await ingestRBICirculars();
  console.log(`  Found ${rbiDocs.length} RBI documents`);

  console.log("Fetching SEBI circulars...");
  const sebiDocs = await ingestSEBICirculars();
  console.log(`  Found ${sebiDocs.length} SEBI documents`);

  const allDocs = [...rbiDocs, ...sebiDocs];
  console.log(`\nTotal documents: ${allDocs.length}`);

  console.log("\nFetching document content...");
  for (const doc of allDocs.slice(0, 5)) {
    doc.content = await fetchDocumentContent(doc);
    console.log(`  Fetched: ${doc.title.slice(0, 60)}...`);
  }

  const docsWithContent = allDocs.filter((d) => d.content.length > 100);
  console.log(`\nDocuments with content: ${docsWithContent.length}`);

  if (docsWithContent.length === 0) {
    console.log("No documents with content to summarize. Saving raw list.");
    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(
      path.join(dataDir, "raw-documents.json"),
      JSON.stringify(allDocs, null, 2)
    );
    console.log("Saved to data/raw-documents.json");
    return;
  }

  console.log("\nSummarizing with Claude AI...");
  const summaries = [];
  for (const doc of docsWithContent.slice(0, 5)) {
    try {
      console.log(`  Summarizing: ${doc.title.slice(0, 60)}...`);
      const summary = await summarizeDocument({
        title: doc.title,
        content: doc.content,
        source: doc.source,
        sector: doc.sector,
      });
      summaries.push(summary);
    } catch (err) {
      console.error(`  Failed: ${err}`);
    }
  }

  const dataDir = path.join(process.cwd(), "data");
  await fs.mkdir(dataDir, { recursive: true });

  await fs.writeFile(
    path.join(dataDir, "raw-documents.json"),
    JSON.stringify(allDocs, null, 2)
  );
  await fs.writeFile(
    path.join(dataDir, "summaries.json"),
    JSON.stringify(summaries, null, 2)
  );

  console.log(`\nDone! ${summaries.length} summaries saved to data/summaries.json`);
}

main().catch(console.error);
