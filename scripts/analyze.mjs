import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { uniqueById, groupByCause, readAs } from '../src/lib/kb/causes.ts';

const data = fileURLToPath(new URL('../src/lib/data/', import.meta.url));
const load = p => JSON.parse(fs.readFileSync(data + p, 'utf8'));
const reports = load('reports-4471.json');
const tenants = fs.readdirSync(data + 'tenants').map(p => load('tenants/' + p));
const notes = load('desk-notes.json');
const merged = uniqueById(reports).filter(r => r.mergedInto === 4471);
const groups = groupByCause(merged, r => tenants.find(t => t.handle === r.tenant));
const summary = {
  rawRows: reports.length,
  distinctReports: merged.length,
  groups: groups.map(({ reports, ...group }) => ({
    ...group, count: reports.length,
    oneDayMoves: readAs({ reports }, notes.oneDayMove),
    reportIds: reports.map(r => r.id),
  })),
};
if (groups.reduce((n, g) => n + g.reports.length, 0) !== merged.length) throw Error('Count mismatch');
if (new Set(groups.flatMap(g => g.reports.map(r => r.id))).size !== merged.length) throw Error('Overlap');
console.log(JSON.stringify(summary, null, 2));
