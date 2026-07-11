export function DataTable({ rows, showReasonColumn }) {
  const baseHeaders = Object.keys(rows[0] || {});
  const headers = showReasonColumn ? ['Reason', ...baseHeaders.filter((key) => key !== 'reason')] : baseHeaders;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-sm">
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="border-b border-border/70 px-3 py-3 text-left font-semibold text-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="px-3 py-8 text-center text-muted-foreground">
                    No records to display.
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => {
                  const visibleValues = showReasonColumn
                    ? baseHeaders.filter((key) => key !== 'reason').map((key) => row[key])
                    : baseHeaders.map((key) => row[key]);

                  return (
                    <tr key={`${rowIndex}-${JSON.stringify(row)}`} className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/40'}>
                      {showReasonColumn ? (
                        <>
                          <td className="max-w-[220px] border-b border-border/60 px-3 py-3 text-foreground">
                            <div className="truncate">{row.reason || '-'}</div>
                          </td>
                          {visibleValues.map((value, index) => (
                            <td key={`${rowIndex}-${baseHeaders.filter((key) => key !== 'reason')[index]}`} className="max-w-[220px] border-b border-border/60 px-3 py-3 text-foreground">
                              <div className="truncate">{value ?? ''}</div>
                            </td>
                          ))}
                        </>
                      ) : (
                        baseHeaders.map((key) => (
                          <td key={`${rowIndex}-${key}`} className="max-w-[220px] border-b border-border/60 px-3 py-3 text-foreground">
                            <div className="truncate">{row[key] ?? ''}</div>
                          </td>
                        ))
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
