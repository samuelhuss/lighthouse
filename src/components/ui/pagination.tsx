import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination({ page, total, limit, onPageChange }: { page: number; total: number; limit: number; onPageChange: (page: number) => void }) {
  const pageCount = Math.max(1, Math.ceil(total / limit));
  if (pageCount <= 1) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">{total} {total === 1 ? "registro" : "registros"}</p>
      <div className="flex items-center gap-2">
        <Button variant="adminOutline" size="icon" aria-label="Página anterior" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={15} />
        </Button>
        <span className="min-w-20 text-center text-xs text-slate-600">Página {page} de {pageCount}</span>
        <Button variant="adminOutline" size="icon" aria-label="Próxima página" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          <ChevronRight size={15} />
        </Button>
      </div>
    </div>
  );
}
