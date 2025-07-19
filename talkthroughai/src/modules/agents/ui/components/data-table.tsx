"use client"

import {
  ColumnDef,
  CellContext
} from "@tanstack/react-table"



interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  onRowClick?:(row:TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  // No need for useReactTable since we're not rendering a table

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.length ? (
        data.map((row, idx) => (
          <div
            key={idx}
            className="relative border rounded-md p-4 shadow-sm cursor-pointer hover:shadow-md transition group"
            onClick={() => onRowClick?.(row)}
            tabIndex={0}
            role="button"
            aria-label="View agent details"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onRowClick?.(row); }}
          >
            {/* L-shaped corners on hover */}
            <div className="pointer-events-none">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {columns.map((col, colIdx) => {
              // Render cell if present
              if (typeof col.cell === 'function') {
                // Create a minimal CellContext for the cell renderer
                const cellContext = { row: { original: row } } as Pick<CellContext<TData, TValue>, 'row'>;
                return (
                  <div key={colIdx} className="mb-1 last:mb-0">
                    {col.cell(cellContext as CellContext<TData, TValue>)}
                  </div>
                );
              }
              // Otherwise, use accessorKey if present
              if ('accessorKey' in col && typeof col.accessorKey === 'string') {
                return (
                  <div key={colIdx} className="mb-1 last:mb-0">
                    {row[col.accessorKey as keyof TData] as React.ReactNode}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-muted-foreground">No results.</div>
      )}
    </div>
  )
}