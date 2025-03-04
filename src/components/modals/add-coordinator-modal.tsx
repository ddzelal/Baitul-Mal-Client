import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserQueries } from "@/api/queries/user.queries";
import { useInView } from "react-intersection-observer";
import { MultiSelectSearch } from "@/components/common/selects/multi-select-search";
import { OrganizationDomainQueries } from "@/api/queries/organization.domain.queries";
import {
  Coordinator as SectorCoordinator,
  Sector,
} from "@/api/types/sector.types";
import {
  IProject,
  Coordinator as ProjectCoordinator,
} from "@/api/types/project.types";
import { IUser } from "@/interfaces/auth.interface.ts";
import { X, MinusCircle } from "lucide-react";

interface AddCoordinatorModalProps {
  trigger?: React.ReactNode;
  organizationDomainId: string;
  organizationDomainType: "project" | "sector";
  item?: Sector | IProject;
  onSuccess?: () => void;
}

const addCoordinatorSchema = z.object({
  coordinatorIds: z.array(z.string()).optional(),
});

type AddCoordinatorFormValues = z.infer<typeof addCoordinatorSchema>;

export function AddCoordinatorModal({
  trigger,
  organizationDomainId,
  organizationDomainType,
  item,
  onSuccess,
}: AddCoordinatorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coordinatorsToRemove, setCoordinatorsToRemove] = useState<string[]>(
    []
  );
  const [currentCoordinators, setCurrentCoordinators] = useState<
    (SectorCoordinator | ProjectCoordinator)[]
  >([]);

  useEffect(() => {
    if (item?.currentCoordinators) {
      setCurrentCoordinators(item.currentCoordinators);
    }
  }, [item]);

  const form = useForm<AddCoordinatorFormValues>({
    resolver: zodResolver(addCoordinatorSchema),
    defaultValues: {
      coordinatorIds: [],
    },
  });

  const { mutate: addCoordinator, isPending } =
    OrganizationDomainQueries.useAddCoordinatorDomain(organizationDomainType);

  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = UserQueries.useGetAllInfinite({ PageSize: 10 });

  const filteredUsers = usersData?.pages
    .flatMap((page) => page.items)
    .filter(
      (user: IUser) =>
        !currentCoordinators.some(
          (coordinator) =>
            ("userId" in coordinator ? coordinator.userId : coordinator.id) ===
              user.id &&
            !coordinatorsToRemove.includes(
              "userId" in coordinator ? coordinator.userId : coordinator.id
            )
        )
    );

  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: "50px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRemoveCoordinator = (coordinatorId: string) => {
    setCoordinatorsToRemove([...coordinatorsToRemove, coordinatorId]);
  };

  const handleUndoRemoveCoordinator = (coordinatorId: string) => {
    setCoordinatorsToRemove(
      coordinatorsToRemove.filter((id) => id !== coordinatorId)
    );
  };

  const onSubmit = (values: AddCoordinatorFormValues) => {
    const finalUserIds = [
      ...currentCoordinators
        .filter(
          (coord) =>
            !coordinatorsToRemove.includes(
              "userId" in coord ? coord.userId : coord.id
            )
        )
        .map((coord) => ("userId" in coord ? coord.userId : coord.id)),
      ...(values.coordinatorIds || []),
    ];

    addCoordinator(
      {
        organizationDomainId,
        data: { userIds: finalUserIds },
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          form.reset();
          setCoordinatorsToRemove([]);
          onSuccess?.();
        },
      }
    );
  };

  const hasChanges = () => {
    return (
      form.getValues()?.coordinatorIds?.length ||
      0 > 0 ||
      coordinatorsToRemove.length > 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add Coordinators</Button>}
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-[425px] p-6">
        <DialogHeader className="mb-4">
          <DialogTitle>Manage Coordinators</DialogTitle>
          <DialogDescription>
            Add new or remove existing coordinators
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentCoordinators.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Current Coordinators:</h4>
                <div className="space-y-2">
                  {currentCoordinators.map((coordinator) => {
                    const coordId =
                      "userId" in coordinator
                        ? coordinator.userId
                        : coordinator.id;
                    const isMarkedForRemoval =
                      coordinatorsToRemove.includes(coordId);

                    return (
                      <div
                        key={coordId}
                        className={`flex items-center justify-between p-2 rounded-md ${
                          isMarkedForRemoval
                            ? "bg-red-50 line-through text-gray-400"
                            : "bg-gray-50"
                        }`}
                      >
                        <span>{coordinator.name}</span>
                        {isMarkedForRemoval ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUndoRemoveCoordinator(coordId)}
                            className="h-8 w-8 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCoordinator(coordId)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="coordinatorIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Coordinators</FormLabel>
                  <FormControl>
                    <MultiSelectSearch
                      value={field.value}
                      onValueChange={field.onChange}
                      options={
                        filteredUsers?.map((user) => ({
                          id: user.id,
                          label: `${user.name} ${user.lastName}`,
                        })) || []
                      }
                      placeholder="Select coordinators"
                      searchPlaceholder="Search users"
                      noOptionsMessage="No users found"
                      isLoading={isFetchingNextPage}
                      onLoadMore={fetchNextPage}
                      hasMore={hasNextPage || false}
                    />
                  </FormControl>
                  {hasNextPage && <div ref={ref} className="h-4" />}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setCoordinatorsToRemove([]);
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !hasChanges()}
                className="w-full sm:w-auto"
              >
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
