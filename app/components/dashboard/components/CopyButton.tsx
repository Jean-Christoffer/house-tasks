import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      disabled={copied}
      className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition-colors cursor-pointer mb-1"
    >
      {copied ? "Koden er kopiert til utklippstavlen!" : "Kopier kode"}
    </Button>
  );
}
