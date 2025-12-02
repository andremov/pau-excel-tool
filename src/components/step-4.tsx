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
  const [targetMonth, setTargetMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [targetYear, setTargetYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    if (assets === null || assets.length === 0) return;

    const targetDate = new Date(targetYear, targetMonth - 1, 1);

    const workingSheetsData: CompleteSheetData[] = [];

    assets.forEach((asset) => {
      const firstTable = generateFirstSheetTable(asset);
      const secondTable = generateSecondSheetTable(asset, targetDate);
      const summary = generateSummaryData(asset, targetDate);

      workingSheetsData.push({
        sheetName: asset.identifier,
        data: [...firstTable, ...secondTable],
        summary,
      });
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftSheetsData(workingSheetsData);
  }, [assets, targetMonth, targetYear]);

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
          <div className="flex flex-row gap-4 mt-4 ">
            <div className="rounded-lg bg-slate-800 p-6 text-white">
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
            <div className="rounded-lg bg-slate-800 p-6 flex flex-col gap-2">
              <p className="text-white max-w-70 text-center">
                Se generará la depreciación hasta el primero del mes
                seleccionado.
              </p>
              <div className="flex gap-1 w-full">
                <select
                  className="bg-white text-black rounded-md p-2 flex-1"
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i;
                    return (
                      <option key={month} value={month + 1}>
                        {
                          [
                            "Enero",
                            "Febrero",
                            "Marzo",
                            "Abril",
                            "Mayo",
                            "Junio",
                            "Julio",
                            "Agosto",
                            "Septiembre",
                            "Octubre",
                            "Noviembre",
                            "Diciembre",
                          ][month]
                        }
                      </option>
                    );
                  })}
                </select>
                <select
                  className="bg-white text-black rounded-md p-2 flex-1"
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - 5 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <p className="text-neutral-300 text-center">
                ({targetYear}/{targetMonth.toString().padStart(2, "0")}/01)
              </p>
            </div>
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
