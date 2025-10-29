import {
  AssetDataType,
  CompleteSheetData,
  formatCurrency,
  generateFirstSheetTable,
  generateSecondSheetTable,
  generateSummaryData,
} from "@/lib/utils";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface Step4Props {
  assets: AssetDataType[] | null;
  accordionValue: string;
  toNextStep: (assets: CompleteSheetData[]) => void;
}

export default function Step4(props: Step4Props) {
  const { assets, toNextStep, accordionValue } = props;
  const [draftSheetsData, setDraftSheetsData] = useState<CompleteSheetData[]>(
    []
  );

  useEffect(() => {
    if (assets === null || assets.length === 0) return;

    const workingSheetsData: CompleteSheetData[] = [];

    assets.forEach((asset) => {
      const firstTable = generateFirstSheetTable(asset);
      const secondTable = generateSecondSheetTable(asset);
      const summary = generateSummaryData(asset);

      workingSheetsData.push({
        sheetName: asset.identifier,
        data: [...firstTable, ...secondTable],
        summary,
      });
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftSheetsData(workingSheetsData);
  }, [assets]);

  const handleNextStep = () => {
    if (draftSheetsData.length === 0) return;

    toNextStep(draftSheetsData);
  };

  return (
    <AccordionItem value="item-4" className="border-0 mb-10">
      <AccordionTrigger>
        <h1
          className={`text-3xl font-bold text-white transition ${
            accordionValue === "item-4" ? "" : "opacity-50 scale-90"
          }`}
        >
          <span className="text-emerald-500">4.</span> Procesar datos de{" "}
          <span className="text-emerald-500">Excel</span>
        </h1>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col items-center gap-4">
          <div className="mt-4 rounded-lg bg-slate-800 p-6 text-white">
            {draftSheetsData.slice(0, 3).map((sheetData, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  index < 2 ? "border-b pb-4" : ""
                } border-slate-700`}
              >
                <p>
                  <strong>Matricula:</strong> {sheetData.sheetName}
                </p>
                <p>
                  <strong>Depreciación Acumulada:</strong>{" "}
                  {formatCurrency(sheetData.summary.accumulatedDepreciation)}
                </p>
                <p>
                  <strong>Valor neto en libros:</strong>{" "}
                  {formatCurrency(sheetData.summary.bookValue)}
                </p>
              </div>
            ))}
          </div>

          <Button
            className="bg-white text-black mx-auto px-8 py-6 hover:bg-gray-400"
            disabled={draftSheetsData.length === 0}
            onClick={handleNextStep}
          >
            <span>Continuar</span>
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
