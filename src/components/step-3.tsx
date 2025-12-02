import {
  AssetDataType,
  cleanUpCurrencyString,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { useState, useEffect } from "react";
import readXlsxFile from "read-excel-file";
import { Button } from "./ui/button";

interface Step3Props {
  accordionValue: string;
  file: File | null;
  masterSheet: string | undefined;
  toNextStep: (assets: AssetDataType[]) => void;
}

export default function Step3(props: Step3Props) {
  const { accordionValue, file, masterSheet, toNextStep } = props;
  const [assetsDraft, setAssetsDraft] = useState<AssetDataType[]>([]);

  useEffect(() => {
    if (!file || !masterSheet) return;

    readXlsxFile(file, { sheet: masterSheet, dateFormat: "dd-mm-yyyy" }).then(
      (rows) => {
        const assets: AssetDataType[] = [];

        rows.forEach((row, index) => {
          if (index === 0) return; // skip header

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, identifier, address, __, assetValue, date] = row;

          if (!identifier) return;

          assets.push({
            identifier: identifier.toString(),
            address: address.toString(),
            assetValue: cleanUpCurrencyString(assetValue),
            date: formatDate(date as unknown as string | Date),
            identifierCellAddress: `='${masterSheet}'!B${index + 1}`,
            addressCellAddress: `='${masterSheet}'!C${index + 1}`,
            assetValueCellAddress: `='${masterSheet}'!E${index + 1}`,
            dateCellAddress: `='${masterSheet}'!F${index + 1}`,
          });
        });

        setAssetsDraft(assets);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterSheet]);

  const handleNextStep = () => {
    if (assetsDraft.length === 0) return;

    // Process the assetsDraft data
    toNextStep(assetsDraft);
  };

  return (
    <AccordionItem value="item-3" className="border-0 mb-10">
      <AccordionTrigger>
        <h1
          className={`text-3xl font-bold text-white transition ${
            accordionValue === "item-3" ? "" : "opacity-50 scale-90"
          }`}
        >
          <span className="text-emerald-500">3.</span> Verificar datos de{" "}
          <span className="text-emerald-500">Excel</span>
        </h1>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col items-center gap-4">
          <div className="mt-4 rounded-lg bg-slate-800 p-6 text-white">
            {assetsDraft.slice(0, 3).map((asset, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  index < 2 ? "border-b pb-4" : ""
                } border-slate-700`}
              >
                <p>
                  <strong>Matricula:</strong> {asset.identifier}
                </p>
                <p>
                  <strong>Dirección:</strong> {asset.address}
                </p>
                <p>
                  <strong>Valor del activo:</strong>{" "}
                  {formatCurrency(asset.assetValue)}
                </p>
                <p>
                  <strong>Fecha de compra:</strong> {asset.date}
                </p>
              </div>
            ))}
          </div>

          <Button
            className="bg-white text-black mx-auto px-8 py-6 hover:bg-gray-400"
            disabled={assetsDraft.length === 0}
            onClick={handleNextStep}
          >
            <span>Continuar</span>
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
