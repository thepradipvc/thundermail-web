"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { trpc } from "@/trpc/react-client";
import { RouterOutputs } from "@/trpc/utils";
import { AlertTriangle, CopyIcon } from "lucide-react";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";

type Props = {
  gmailAccounts: RouterOutputs["gmailAccounts"]["getUserAccounts"];
};

const AddAPIKeyDialog = ({ gmailAccounts }: Props) => {
  const [name, setName] = useState("");
  const [gmailAccount, setGmailAccount] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = trpc.useUtils();

  const { mutate: addAPIKey, isLoading } =
    trpc.apiKeys.createAPIKey.useMutation({
      onSuccess: ({ apiKey }) => {
        setIsDialogOpen(false);
        setApiKey(apiKey);
        setName("");
        setGmailAccount("");
        utils.apiKeys.getUserAPIKeys.invalidate();
      },
      onError: ({ message }) => {
        toast({ description: message, variant: "destructive" });
      },
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name === "") {
      toast({ description: "Name is required" });
      return;
    }

    if (gmailAccount === "") {
      toast({ description: "Please select an account" });
      return;
    }

    addAPIKey({ name, gmailAccountId: gmailAccount });
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <LuPlus className="mr-2" /> Create API Key
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add API Key</DialogTitle>
            </DialogHeader>
            <div className="my-8 flex flex-col justify-center space-y-4">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your API Key name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid flex-1 gap-2">
                <Label htmlFor="account">Account</Label>
                <Select
                  defaultValue={gmailAccount}
                  onValueChange={(value) => setGmailAccount(value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pick account for API Key usage" />
                  </SelectTrigger>
                  <SelectContent>
                    {gmailAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 animate-spin" />}
                Add
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {apiKey && <ViewAPIKey apiKey={apiKey} onClose={() => setApiKey(null)} />}
    </div>
  );
};

export default AddAPIKeyDialog;

const ViewAPIKey = ({
  apiKey,
  onClose,
}: {
  apiKey: string;
  onClose: () => void;
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>View API Key</DialogTitle>
        </DialogHeader>
        <div className="my-2 flex flex-col justify-center space-y-8">
          <div className="flex items-center rounded-md border border-yellow-600 bg-gradient-to-r from-yellow-600/40 to-transparent to-40% p-2 text-sm">
            <AlertTriangle className="mr-4 text-yellow-300" /> You can only see
            this key once. Store it safely.
          </div>
          <div className="grid flex-1 gap-2">
            <Label htmlFor="name">API Key</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="name"
                placeholder="Your API Key name"
                value={apiKey}
                readOnly
              />
              <Button
                type="submit"
                size="sm"
                className="px-3"
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  toast({ description: "Copied to clipboard" });
                }}
              >
                <span className="sr-only">Copy</span>
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
