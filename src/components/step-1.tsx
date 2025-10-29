import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { FileSpreadsheetIcon, FileWarningIcon } from "lucide-react";
import { Dropzone } from "@/components/ui/shadcn-io/dropzone";
import { Button } from "./ui/button";
import { useState } from "react";

interface Step1Props {
  accordionValue: string;
  file: File | null;
  setFile: (file: File | null) => void;
  toNextStep: () => void;
}

export default function Step1(props: Step1Props) {
  const { accordionValue, file, setFile, toNextStep } = props;
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      setError("Por favor, sube solo un archivo a la vez.");
      return;
    }

    const [file] = acceptedFiles;

    if (
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      file.type !== "application/vnd.ms-excel"
    ) {
      setError("Tipo de archivo no válido. Por favor, sube un archivo Excel.");
      return;
    }

    setFile(file);
    setError(null);
  };

  return (
    <AccordionItem value="item-1" className="border-0 mb-10">
      <AccordionTrigger>
        <h1
          className={`text-3xl font-bold text-white transition ${
            accordionValue === "item-1" ? "" : "opacity-50 scale-90"
          }`}
        >
          <span className="text-emerald-500">1.</span> Ingrese un archivo{" "}
          <span className="text-emerald-500">Excel</span>
        </h1>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-4 items-center mt-8">
          <Dropzone
            maxFiles={1}
            onDrop={handleFileDrop}
            className="flex flex-row gap-4 "
          >
            <FileSpreadsheetIcon className="size-10 text-gray-300" />
            <span className="text-xl text-gray-300">
              {file ? file.name : "Arrastra y suelta tu archivo aquí"}
            </span>
          </Dropzone>

          {error && (
            <div className="gap-4 bg-red-300 border border-red-500 text-red-500 flex items-center justify-center mt-10 rounded-lg p-8">
              <FileWarningIcon className="size-8 text-red-500" />
              <span className="text-lg">{error}</span>
            </div>
          )}

          <Button
            className="bg-white text-black mx-auto px-8 py-6 hover:bg-gray-400"
            disabled={!file}
            onClick={toNextStep}
          >
            <span>Continuar</span>
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
