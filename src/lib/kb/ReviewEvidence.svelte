<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, readAs, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const merged = uniqueById(reports as Report[]).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const duplicates = reports.length - uniqueById(reports as Report[]).length;
  const backlog = merged.filter(r => r.mergedAt?.startsWith('2026-07-02'));
  const earlier = backlog.filter(r => r.receivedAt.slice(0, 10) < '2026-07-02');
  const flagged = merged.filter(r => notes.oneDayMove.includes(r.id));
</script>

<p><strong>{merged.length} distinct reports</strong> in #{4471}, classified into <strong>{groups.length} causes</strong>.
The export has {reports.length} rows; {duplicates} overlapping rows do not add reports.</p>

<table>
  <thead><tr><th>Problem</th><th>Reports</th><th>Tenants</th><th>Received</th><th>Flagged one-day moves</th></tr></thead>
  <tbody>
    {#each groups as group}
      <tr><td>{group.cause}</td><td>{group.reports.length}</td><td>{group.tenants}</td><td>{group.firstSeen} to {group.lastSeen}</td><td>{readAs(group, notes.oneDayMove)}</td></tr>
    {/each}
  </tbody>
</table>

<p>On 2026-07-02 the desk merged {backlog.length} reports; {earlier.length} had arrived before that date.
The merge spike measures desk processing, not incident onset. Use the received series to assess report timing.</p>

<details>
  <summary>Reports the desk read as one-day moves</summary>
  <p>These remain counted in their tenant-based cause. Their wording is evidence to investigate;
  it does not independently confirm a timezone defect or a third cause.</p>
  <ul>{#each flagged as report}<li><code>{report.id}</code> · {report.tenant} · {report.channel}: {report.body}</li>{/each}</ul>
</details>
