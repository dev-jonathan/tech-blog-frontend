import { useState, useMemo, type ReactNode } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginatedListProps<T> {
  items: T[];
  itemsPerPage: number;
  renderItem: (item: T) => ReactNode;
  emptyMessage?: string;
}

export function PaginatedList<T>({
  items,
  itemsPerPage,
  renderItem,
  emptyMessage = 'Nenhum item encontrado',
}: PaginatedListProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Reset para página 1 quando items mudam
  useMemo(() => {
    setCurrentPage(1);
  }, [items]);

  return (
    <>
      {/* Items List */}
      <div className="flex w-full flex-col">
        {currentItems.length > 0 ? (
          currentItems.map((item, index) => (
            <div key={index}>{renderItem(item)}</div>
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <p className="text-muted-foreground text-base font-normal">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {pageNumbers.map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <span className="text-muted-foreground flex h-9 w-9 items-center justify-center">
                      ...
                    </span>
                  ) : (
                    <PaginationLink
                      onClick={() => setCurrentPage(page as number)}
                      isActive={currentPage === page}
                      className={
                        currentPage === page
                          ? 'bg-accent border-primary'
                          : 'hover:bg-accent/50'
                      }
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
