import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxEmpty,
  ComboboxList,
  ComboboxGroup,
  ComboboxItem,
} from "./ui/shadcn-io/combobox";
import { useMemo } from "react";
import { Button } from "./ui/button";

interface Step2Props {
  accordionValue: string;
  allSheets: string[] | null;
  masterSheet: string | undefined;
  setMasterSheet: (sheet: string | undefined) => void;
  toNextStep: () => void;
}

export default function Step2(props: Step2Props) {
  const { accordionValue, allSheets, masterSheet, setMasterSheet, toNextStep } =
    props;

  const parsedAllSheets = useMemo(() => {
    if (!allSheets) return [];
    return allSheets.map((sheet) => ({
      value: sheet,
      label: sheet,
    }));
  }, [allSheets]);

  return (
    <AccordionItem value="item-2" className="border-0 mb-10">
      <AccordionTrigger>
        <h1
          className={`text-3xl font-bold text-white transition ${
            accordionValue === "item-2" ? "" : "opacity-50 scale-90"
          }`}
        >
          <span className="text-emerald-500">2.</span> Seleccione la hoja{" "}
          <span className="text-emerald-500">maestra</span>
        </h1>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-4 items-center mt-8">
          <Combobox
            type={"sheet"}
            value={masterSheet}
            data={parsedAllSheets}
            onValueChange={(newValue) => setMasterSheet(newValue)}
          >
            <ComboboxTrigger className="text-white hover:text-white w-48" />
            <ComboboxContent>
              <ComboboxInput />
              <ComboboxEmpty />
              <ComboboxList>
                <ComboboxGroup>
                  {parsedAllSheets.map((sheet) => (
                    <ComboboxItem key={sheet.value} value={sheet.value}>
                      <span>{sheet.label}</span>
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <Button
            className="bg-white text-black mx-auto px-8 py-6 hover:bg-gray-400"
            disabled={!masterSheet}
            onClick={toNextStep}
          >
            <span>Continuar</span>
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
