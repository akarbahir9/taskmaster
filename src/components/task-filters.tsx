"use client";

import type { FilterType } from "@/types";
import { Button } from "@/components/ui/button";

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps) {
  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="flex justify-center gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentFilter === filter.value ? "default" : "outline"}
          onClick={() => onFilterChange(filter.value)}
          className={
            currentFilter === filter.value && filter.value === 'completed' 
            ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
            : (currentFilter === filter.value ? 'bg-primary text-primary-foreground' : '')
          }
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
