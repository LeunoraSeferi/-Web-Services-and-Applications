/**
 * clean_sample_data.js
 * --------------------
 * Cleans EconBiz-style JSONL data so it can be indexed
 * safely into Apache Solr 9.x default managed schema.
 *
 * Output: sample_data_final.json (JSONL format)
 */

const fs = require("fs");

const INPUT_FILE = "sample_data.json";
const OUTPUT_FILE = "sample_data_final.json";

// Read file (JSON Lines format)
const lines = fs
  .readFileSync(INPUT_FILE, "utf8")
  .split(/\r?\n/)
  .filter(l => l.trim());

const cleaned = lines.map((line, index) => {
  const d = JSON.parse(line);

  //  Remove fields that break Solr numeric/date parsing
  delete d.classification_ddc;        // contains values like 305/.01
  delete d.source_id;                 // contains values like 01001473X

  // contributor_personal[].gnd_id → alphanumeric (breaks numeric parsing)
  if (Array.isArray(d.contributor_personal)) {
    d.contributor_personal = d.contributor_personal.map(p => {
      if (p && typeof p === "object") {
        delete p.gnd_id;
      }
      return p;
    });
  }

  // conference.date → values like "1983.04.11-16"
  if (d.conference && typeof d.conference === "object") {
    delete d.conference.date;
  }

  // Ensure Solr-safe ID
  if (!d.id && d.econbiz_id) {
    d.id = String(d.econbiz_id);
  }
  if (!d.id) {
    d.id = `doc-${index}`;
  }

  return JSON.stringify(d);
});

// Write cleaned JSONL
fs.writeFileSync(OUTPUT_FILE, cleaned.join("\n"), "utf8");

console.log(
  ` Cleaning complete.\n` +
  `   Input file : ${INPUT_FILE}\n` +
  `   Output file: ${OUTPUT_FILE}\n` +
  `   Documents  : ${cleaned.length}`
);
