import * as cheerio from "cheerio";

export interface RawDocument {
  title: string;
  url: string;
  date: string;
  source: string;
  sector: string;
  content: string;
}

export async function ingestRBICirculars(): Promise<RawDocument[]> {
  const url = "https://www.rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const documents: RawDocument[] = [];

  $("table.tablebg tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length >= 3) {
      const link = cells.eq(1).find("a");
      const title = link.text().trim();
      const href = link.attr("href");
      const date = cells.eq(0).text().trim();

      if (title && href) {
        documents.push({
          title,
          url: href.startsWith("http")
            ? href
            : `https://www.rbi.org.in${href}`,
          date,
          source: "RBI",
          sector: "BFSI",
          content: "",
        });
      }
    }
  });

  return documents.slice(0, 20);
}

export async function ingestSEBICirculars(): Promise<RawDocument[]> {
  const url = "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=2&smid=0";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const documents: RawDocument[] = [];

  $(".list-items li, table tr").each((_, el) => {
    const link = $(el).find("a").first();
    const title = link.text().trim();
    const href = link.attr("href");

    if (title && href && title.length > 10) {
      documents.push({
        title,
        url: href.startsWith("http")
          ? href
          : `https://www.sebi.gov.in${href}`,
        date: new Date().toISOString().split("T")[0],
        source: "SEBI",
        sector: "BFSI",
        content: "",
      });
    }
  });

  return documents.slice(0, 20);
}

export async function fetchDocumentContent(
  doc: RawDocument
): Promise<string> {
  try {
    const res = await fetch(doc.url);
    const html = await res.text();
    const $ = cheerio.load(html);
    $("script, style, nav, header, footer").remove();
    return $("body").text().replace(/\s+/g, " ").trim().slice(0, 10000);
  } catch {
    return "";
  }
}
