import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  targetGuid: string | null;
};

export default function Html5ConnectionModal({ open, setOpen, targetGuid }: Props) {
  const url = useMemo(() => {
    if (!targetGuid) return "";
    // In real integration, construct the tsplus endpoint URL for the given VM
    return `https://tsplus.example.com/connect?vm=${encodeURIComponent(targetGuid)}`;
  }, [targetGuid]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl w-[900px] h-[600px] p-0">
        <DialogHeader>
          <DialogTitle>HTML5 Remote Connection</DialogTitle>
        </DialogHeader>

        <div className="w-full h-[520px] bg-black">
          {url ? (
            // Use iframe to point to tsplus endpoint (CORS and embedding must be allowed)
            <iframe src={url} title="html5-connection" className="w-full h-full border-0" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No target selected</div>
          )}
        </div>

        <div className="p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
