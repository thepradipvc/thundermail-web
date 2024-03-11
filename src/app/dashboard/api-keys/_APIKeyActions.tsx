"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { trpc } from "@/trpc/react-client";
import { RouterOutputs } from "@/trpc/utils";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import React, { useRef, useState } from "react";

type APIKey = RouterOutputs["apiKeys"]["getUserAPIKeys"][number];

export const APIKeyActions = ({ apiKey }: { apiKey: APIKey }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState<null | "edit" | "revoke">(
    null,
  );
  const dropdownTriggerRef = useRef(null);
  const focusRef = useRef(null);

  function handleDialogItemSelect() {
    focusRef.current = dropdownTriggerRef.current;
  }

  function handleDialogItemOpenChange(open: typeof hasOpenDialog) {
    setHasOpenDialog(open);
    if (open === null) {
      setDropdownOpen(false);
    }
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          ref={dropdownTriggerRef}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        hidden={hasOpenDialog !== null}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            // @ts-expect-error
            focusRef.current.focus();
            focusRef.current = null;
            event.preventDefault();
          }
        }}
      >
        <DialogItem
          triggerChildren={
            <>
              <Edit className="mr-2 h-4 w-4" /> Edit API Key
            </>
          }
          isDialogOpen={hasOpenDialog === "edit"}
          onSelect={handleDialogItemSelect}
          onOpenChange={(open) =>
            handleDialogItemOpenChange(open ? "edit" : null)
          }
        >
          <EditAction
            apiKey={apiKey}
            onAPIUpdate={() => {
              setHasOpenDialog(null);
              setDropdownOpen(false);
            }}
          />
        </DialogItem>

        <DialogItem
          // @ts-expect-error
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
          isDialogOpen={hasOpenDialog === "revoke"}
          triggerChildren={
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Revoke API Key
            </>
          }
          onSelect={handleDialogItemSelect}
          onOpenChange={(open) =>
            handleDialogItemOpenChange(open ? "revoke" : null)
          }
        >
          <RevokeAction
            apiKey={apiKey}
            onAPIRevoke={() => {
              setHasOpenDialog(null);
              setDropdownOpen(false);
            }}
          />
        </DialogItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default APIKeyActions;

const RevokeAction = ({
  apiKey,
  onAPIRevoke,
}: {
  apiKey: APIKey;
  onAPIRevoke: () => void;
}) => {
  const { id: apiKeyId, name: apiName } = apiKey;
  const [confirm, setConfirm] = useState("");

  const utils = trpc.useUtils();

  const { mutate: revokeAPIKey, isLoading } =
    trpc.apiKeys.revokeAPIKey.useMutation({
      onSuccess: ({ message }) => {
        console.log("wait baby");
        toast({ description: message, variant: "success" });
        utils.apiKeys.getUserAPIKeys.invalidate();
        onAPIRevoke();
      },
      onError: ({ message }) => {
        toast({ description: message, variant: "destructive" });
      },
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await revokeAPIKey({ id: apiKeyId });
  };

  return (
    <>
      <DialogHeader className="space-y-4">
        <DialogTitle>Revoke API Key</DialogTitle>
        <DialogDescription>
          Are you sure you want to revoke &apos;{apiName}&apos; API Key?
          <br />
          <span className="text-destructive">This can not be undone.</span>
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mt-4 grid flex-1 gap-2">
          <Label className="text-muted-foreground" htmlFor="confirm">
            Type <span className="font-bold text-white">REVOKE</span> to
            confirm.
          </Label>
          <Input
            autoComplete="off"
            id="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            type="submit"
            variant="destructive"
            disabled={confirm !== "REVOKE" || isLoading}
          >
            {isLoading && <Icons.spinner className="mr-2 animate-spin" />}
            Revoke
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </>
  );
};

const EditAction = ({
  apiKey,
  onAPIUpdate,
}: {
  apiKey: APIKey;
  onAPIUpdate: () => void;
}) => {
  const { id: apiKeyId, name: apiName } = apiKey;
  const [name, setName] = useState(apiName);

  const utils = trpc.useUtils();

  const { mutate: editAPIKey, isLoading } = trpc.apiKeys.editAPIKey.useMutation(
    {
      onSuccess: ({ message }) => {
        toast({ description: message, variant: "success" });
        utils.apiKeys.getUserAPIKeys.invalidate();
        onAPIUpdate();
      },
      onError: ({ message }) => {
        toast({ description: message, variant: "destructive" });
      },
    },
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name === "") {
      toast({ description: "Name is required" });
      return;
    }

    await editAPIKey({ id: apiKeyId, name });
  };

  return (
    <>
      <DialogHeader className="space-y-4">
        <DialogTitle>Edit API Key</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mt-4 grid flex-1 gap-2">
          <Label className="text-muted-foreground" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isLoading || name === ""}>
            {isLoading && <Icons.spinner className="mr-2 animate-spin" />}
            Edit
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </>
  );
};

type DialogItemProps = {
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  onSelect?: () => void;
  isDialogOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DialogItem = React.forwardRef<HTMLDivElement, DialogItemProps>(
  (props, forwardedRef) => {
    const {
      triggerChildren,
      isDialogOpen,
      children,
      onSelect,
      onOpenChange,
      ...itemProps
    } = props;

    return (
      <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            {...itemProps}
            ref={forwardedRef}
            onSelect={(event) => {
              event.preventDefault();
              onSelect && onSelect();
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent>{children}</DialogContent>
        </DialogPortal>
      </Dialog>
    );
  },
);

DialogItem.displayName = "DialogItem";
