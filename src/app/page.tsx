"use client";

import Step1 from "@/components/step-1";
import Step2 from "@/components/step-2";
import Step3 from "@/components/step-3";
import Step4 from "@/components/step-4";
import Step5 from "@/components/step-5";
import { Accordion } from "@/components/ui/accordion";
import { AssetDataType, CompleteSheetData } from "@/lib/utils";
import { useState } from "react";
import { readSheetNames } from "read-excel-file";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [accordionValue, setAccordionValue] = useState<string>("item-1");
  const [allSheets, setAllSheets] = useState<string[] | null>(null);
  const [masterSheet, setMasterSheet] = useState<string | undefined>(undefined);
  const [assets, setAssets] = useState<AssetDataType[] | null>(null);
  const [sheetsData, setSheetsData] = useState<CompleteSheetData[] | null>(
    null
  );

  const acceptFile = async () => {
    if (!file) return;

    const sheetNames = await readSheetNames(file);
    setAllSheets(sheetNames);

    setMasterSheet(sheetNames[0]);
    if (sheetNames.length === 1) {
      setAccordionValue("item-3");
    } else {
      setAccordionValue("item-2");
    }
  };

  const handleAccordionValueChange = (value: string) => {
    // dont allow going forward
    switch (accordionValue) {
      case "item-1":
        // do nothing.
        break;
      case "item-2":
        if (value === "item-1") {
          setAccordionValue(value);
        }
        break;
      case "item-3":
        if (value === "item-2" || value === "item-1") {
          setAccordionValue(value);
        }
        break;
      case "item-4":
        if (value === "item-3" || value === "item-2" || value === "item-1") {
          setAccordionValue(value);
        }
        break;
      case "item-5":
        if (
          value === "item-4" ||
          value === "item-3" ||
          value === "item-2" ||
          value === "item-1"
        ) {
          setAccordionValue(value);
        }
        break;
      default:
        // setAccordionValue(value);
        break;
    }
  };

  const acceptAssets = (assets: AssetDataType[]) => {
    setAccordionValue("item-4");
    setAssets(assets);
  };

  const acceptSheetsData = (sheetsData: CompleteSheetData[]) => {
    setSheetsData(sheetsData);
    setAccordionValue("item-5");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center py-32 px-16 sm:items-start">
        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={handleAccordionValueChange}
          className="w-full"
        >
          <Step1
            accordionValue={accordionValue}
            file={file}
            setFile={setFile}
            toNextStep={acceptFile}
          />

          <Step2
            accordionValue={accordionValue}
            allSheets={allSheets}
            masterSheet={masterSheet}
            setMasterSheet={setMasterSheet}
            toNextStep={() => setAccordionValue("item-3")}
          />

          <Step3
            accordionValue={accordionValue}
            file={file}
            masterSheet={masterSheet}
            toNextStep={acceptAssets}
          />

          <Step4
            accordionValue={accordionValue}
            assets={assets!}
            toNextStep={acceptSheetsData}
          />

          <Step5
            accordionValue={accordionValue}
            sheetsData={sheetsData!}
            file={file}
            masterSheet={masterSheet}
          />
        </Accordion>
      </main>
    </div>
  );
}
