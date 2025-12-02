import { clsx, type ClassValue } from "clsx";
import { CellValue } from "read-excel-file";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AssetDataType = {
  identifier: string;
  address: string;
  assetValue: number;
  date: string;
  identifierCellAddress: string;
  addressCellAddress: string;
  assetValueCellAddress: string;
  dateCellAddress: string;
};

export function formatDate(dateValue: string | Date): string {
  let dateString = "";

  if (typeof dateValue === "string") {
    dateString = dateValue;
  } else {
    const extractedDate = dateValue.toISOString().split("T")[0]; // YYYY-MM-DD
    const [year, month, day] = extractedDate.split("-");
    dateString = `${day}-${month}-${year}`;
  }

  const [day, month, year] = dateString.split("-");

  return `${day}-${Number(month).toString().padStart(2, "0")}-${year}`;
}

export function cleanUpCurrencyString(value: string | CellValue): number {
  if (typeof value !== "string") {
    value = value.toString();
  }
  const cleanedString = value.replace(/[^0-9.-]+/g, "");
  return Number(cleanedString);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export type SheetCell = {
  value: string | number | Date;
  type?: never;
  format?: string;
};

export type SheetRow = SheetCell[];

export type SheetData = SheetRow[];

export type SheetDataSummary = {
  identifier: string;
  accumulatedDepreciation: number;
  bookValue: number;
};

export type CompleteSheetData = {
  sheetName: string;
  data: SheetData;
  summary: SheetDataSummary;
};

export function generateFirstSheetTable(asset: AssetDataType): SheetData {
  const tableSpacing = [
    {
      value: "",
    },
    {
      value: "",
    },
  ];

  return [
    [
      {
        value: "Matricula",
      },
      {
        value: asset.identifierCellAddress,
        type: "Formula" as never,
      },
      ...tableSpacing,
    ],
    [
      {
        value: "Dirección",
      },
      {
        value: asset.addressCellAddress,
        type: "Formula" as never,
      },
      ...tableSpacing,
    ],
    [
      {
        value: "Fecha de compra",
      },
      {
        value: asset.dateCellAddress,
        type: "Formula" as never,
      },
      ...tableSpacing,
    ],
    [
      {
        value: "Valor del activo",
      },
      {
        value: asset.assetValueCellAddress,
        type: "Formula" as never,
        format: "$ #,##0.00",
      },
      ...tableSpacing,
    ],
    [
      {
        value: "Valor residual",
      },
      {
        value: "=B4*10%",
        type: "Formula" as never,
        format: "$ #,##0.00",
      },
      ...tableSpacing,
    ],
    [
      {
        value: "Vida útil (años)",
      },
      {
        value: 20,
      },
      ...tableSpacing,
    ],
    [
      {
        value: "Vida útil (meses)",
      },
      {
        value: 240,
      },
      ...tableSpacing,
    ],
  ];
}

export function generateSecondSheetTable(asset: AssetDataType): SheetData {
  const firstRow = [
    { value: "Depreciación por linea recta" },
    { value: "" },
    { value: "" },
    { value: "" },
  ];
  const secondRow = [
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
  ];

  const thirdRow = [
    { value: "Fecha" },
    { value: "Cuota de depreciación" },
    { value: "Depreciación acumulada" },
    { value: "Valor neto en libros" },
  ];

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [_, purchaseMonth, purchaseYear] = asset.date.split("-").map(Number);

  const monthsUsed =
    (currentYear - purchaseYear) * 12 + (currentMonth - purchaseMonth);

  const tableRows = Array.from({ length: monthsUsed }, (_, index) => {
    const month = ((purchaseMonth - 1 + index) % 12) + 1;
    const year = purchaseYear + Math.floor((purchaseMonth - 1 + index) / 12);

    return [
      {
        value: new Date(`01-${month}-${year}`),
        type: Date as never,
        format: "dd/mm/yyyy",
      },
      {
        value: "=SLN($B$4,$B$5,$B$7)",
        type: "Formula" as never,
        format: "$ #,##0.00",
      },
      {
        value: `=B${index + 11}*(${index + 1})`,
        type: "Formula" as never,
        format: "$ #,##0.00",
      },
      {
        value: `=$B$4-C${index + 11}`,
        type: "Formula" as never,
        format: "$ #,##0.00",
      },
    ];
  });

  return [firstRow, secondRow, thirdRow, ...tableRows];
}

export function generateSummaryData(asset: AssetDataType): SheetDataSummary {
  const cost = asset.assetValue;
  const salvage = asset.assetValue * 0.1;
  const life = 240;
  const sln = (cost - salvage) / life;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [_, purchaseMonth, purchaseYear] = asset.date.split("-").map(Number);

  const monthsUsed =
    (currentYear - purchaseYear) * 12 + (currentMonth - purchaseMonth);

  const accumulatedDepreciation = sln * monthsUsed;
  const bookValue = cost - accumulatedDepreciation;

  return {
    identifier: asset.identifier,
    accumulatedDepreciation,
    bookValue,
  };
}

export function generateSummarySheetData(
  summaries: SheetDataSummary[]
): SheetData {
  return [
    [
      { value: "Matricula" },
      { value: "Depreciación Acumulada" },
      { value: "Valor neto en libros" },
    ],
    ...summaries.map((summary) => [
      { value: summary.identifier },
      {
        value: summary.accumulatedDepreciation,
        type: Number as never,
        format: "$ #,##0.00",
      },
      { value: summary.bookValue, type: Number as never, format: "$ #,##0.00" },
    ]),
  ];
}

export function getCoverSheetColumns() {
  return [
    { width: 10 },
    { width: 15 },
    { width: 94 },
    { width: 32 },
    { width: 18 },
    { width: 14 },
    { width: 15 },
    { width: 21 },
    { width: 21 },
  ];
}

export function getSummarySheetColumns() {
  return [{ width: 15 }, { width: 22 }, { width: 22 }];
}

export function getAssetDataColumns() {
  return [{ width: 25 }, { width: 60 }, { width: 22 }, { width: 22 }];
}
