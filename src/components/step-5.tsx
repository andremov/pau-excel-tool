import {
  getAssetDataColumns,
  CompleteSheetData,
  getCoverSheetColumns,
  generateSummarySheetData,
  SheetData,
  getSummarySheetColumns,
  formatDate,
  cleanUpCurrencyString,
} from "@/lib/utils";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import writeXlsxFile from "write-excel-file";
import readXlsxFile from "read-excel-file";

interface Step5Props {
  sheetsData: CompleteSheetData[] | null;
  masterSheet: string | undefined;
  accordionValue: string;
  file: File | null;
}

export default function Step5(props: Step5Props) {
  const { sheetsData, accordionValue, file, masterSheet } = props;
  const [fileCoverSheetData, setFileCoverSheetData] =
    useState<SheetData | null>(null);

  useEffect(() => {
    if (!file || !masterSheet) return;

    const draftCoverSheetData: SheetData = [];

    readXlsxFile(file, { sheet: masterSheet, dateFormat: "dd-mm-yyyy" }).then(
      (rows) => {
        rows.forEach((row, idx) => {
          const [colA, colB, colC, colD, colE, colF, colG, colH] = row;

          if (idx === 0) {
            draftCoverSheetData.push([
              { value: colA ? colA.toString() : "" },
              { value: colB ? colB.toString() : "" },
              { value: colC ? colC.toString() : "" },
              { value: colD ? colD.toString() : "" },
              { value: colE ? colE.toString() : "" },
              { value: colF ? colF.toString() : "" },
              { value: colG ? colG.toString() : "" },
              { value: colH ? colH.toString() : "" },
            ]);
            return;
          }

          draftCoverSheetData.push([
            { value: colA ? colA.toString() : "" },
            { value: colB ? colB.toString() : "" },
            { value: colC ? colC.toString() : "" },
            {
              value: colD ? cleanUpCurrencyString(colD) : 0,
              type: Number as never,
              format: "$ #,##0.00",
            },
            {
              value: colE ? cleanUpCurrencyString(colE) : 0,
              type: Number as never,
              format: "$ #,##0.00",
            },
            { value: colF ? formatDate(colF as unknown as string | Date) : "" },
            { value: colG ? colG.toString() : "" },
            { value: colH ? colH.toString() : "" },
            // { value: colI ? colI.toString() : "" },
          ]);
        });
      }
    );

    setFileCoverSheetData(draftCoverSheetData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterSheet]);

  const downloadFinalFile = () => {
    if (
      sheetsData === null ||
      sheetsData.length === 0 ||
      file === null ||
      fileCoverSheetData === null ||
      masterSheet === undefined
    )
      return;

    const writeFile = async () => {
      const data = sheetsData.map((sheet) => sheet.data);
      const sheetNames = sheetsData.map((sheet) => sheet.sheetName);
      const summarySheetData = generateSummarySheetData(
        sheetsData.map((sheet) => sheet.summary)
      );

      const cleanedName = file.name.split(".").slice(0, -1).join(".");

      await writeXlsxFile([fileCoverSheetData, summarySheetData, ...data], {
        columns: [
          getCoverSheetColumns(),
          getSummarySheetColumns(),
          ...data.map(() => getAssetDataColumns()),
        ],
        sheets: [masterSheet, "Resumen", ...sheetNames],
        fileName: `${cleanedName}-resultado.xlsx`,
      });
    };

    writeFile();
  };

  return (
    <AccordionItem value="item-5" className="border-0 mb-10">
      <AccordionTrigger>
        <h1
          className={`text-3xl font-bold text-white transition ${
            accordionValue === "item-5" ? "" : "opacity-50 scale-90"
          }`}
        >
          <span className="text-emerald-500">5.</span> Descargar{" "}
          <span className="text-emerald-500">resultado</span>
        </h1>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col items-center gap-4">
          <div className="mt-4 rounded-lg bg-slate-800 p-6 text-white">
            Listo cuando quieras, haz click en el botón de descargar para
            obtener tu archivo procesado.
          </div>

          <Button
            className="bg-white text-black mx-auto px-8 py-6 hover:bg-gray-400"
            onClick={downloadFinalFile}
          >
            <span>Descargar</span>
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
