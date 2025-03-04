import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Check } from "lucide-react";
import { useInView } from "react-intersection-observer";

interface Option {
  id: string;
  label: string;
}

interface MultiSelectSearchProps {
  value?: string[];
  onValueChange: (value: string[]) => void;
  options: Option[];
  placeholder: string;
  searchPlaceholder: string;
  noOptionsMessage: string;
  label?: string;
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function MultiSelectSearch({
  value = [],
  onValueChange,
  options,
  placeholder,
  searchPlaceholder,
  noOptionsMessage,
  isLoading,
  onLoadMore,
  hasMore,
}: MultiSelectSearchProps) {
  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: "50px",
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  return (
    <Select
      onValueChange={(newValue) => {
        const currentValue = value || [];
        if (!currentValue.includes(newValue)) {
          onValueChange([...currentValue, newValue]);
        }
      }}
    >
      <SelectTrigger className="min-h-[40px] h-auto">
        <div className="flex gap-1 flex-wrap py-1">
          {(!value || value.length === 0) && (
            <SelectValue placeholder={placeholder} />
          )}
          {value?.map((id) => {
            const option = options.find((opt) => opt.id === id);
            return option ? (
              <Badge key={id} variant="secondary" className="mr-1 mb-1">
                {option.label}
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onValueChange(value.filter((v) => v !== id));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      onValueChange(value.filter((v) => v !== id));
                    }
                  }}
                ></span>
              </Badge>
            ) : null;
          })}
        </div>
      </SelectTrigger>
      <SelectContent>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{noOptionsMessage}</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[200px]">
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.label}
                  className="flex items-center justify-between"
                  onSelect={() => {
                    if (value.includes(option.id)) {
                      onValueChange(value.filter((v) => v !== option.id));
                    } else {
                      onValueChange([...value, option.id]);
                    }
                  }}
                >
                  <span>{option.label}</span>
                  {value.includes(option.id) ? (
                    <X
                      color="red"
                      className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive transition-colors mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onValueChange(value.filter((v) => v !== option.id));
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2 mr-2">
                      <Check
                        className={`h-4 w-4 ${value.includes(option.id) ? "opacity-100" : "opacity-0"}`}
                      />
                      <Plus
                        color="green"
                        className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!value.includes(option.id)) {
                            onValueChange([...value, option.id]);
                          }
                        }}
                      />
                    </div>
                  )}
                </CommandItem>
              ))}
              <div ref={ref} className="h-[20px] w-full" aria-hidden="true" />
            </ScrollArea>
          </CommandGroup>
        </Command>
      </SelectContent>
    </Select>
  );
}
