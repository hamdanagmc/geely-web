import {
  SparePartsModel,
  ServiceCostModel,
  ServiceCost,
  SparePart,
} from "@/sanity.types";

interface TableRow {
  _key: string;
  cells: string[];
}

interface DataTableProps {
  data: ServiceCost | SparePart | undefined;
  model: string;
  myModel: SparePartsModel | ServiceCostModel;
}

export function ShowTableData({ data, model, myModel }: DataTableProps) {
  if (!data) {
    return null;
  }

  let rows: TableRow[] = [];

  // Correct narrowing based on sanity _type
  if (data?._type === "sparePart") {
    rows = (data.sparePartTable?.rows as TableRow[] | undefined) ?? [];
  } else if (data?._type === "serviceCost") {
    rows = (data.serviceCostTable?.rows as TableRow[] | undefined) ?? [];
  }

  const [headerRow, ...bodyRows] = rows;

  return (
    <div className="my-16">
      <p className="text-[22px] text-[#999999] mb-[6px]">
        {myModel?.displayDataText}
      </p>

      <span className="text-[30px] font-medium mb-6 block uppercase">
        {model}
      </span>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse bg-white overflow-x-auto">
          {/* Header */}
          <thead className="bg-[#eae9e8] text-lg font-medium">
            <tr>
              {headerRow?.cells?.map((cell, index) => (
                <th key={index} className="p-4 text-center text-lg font-medium">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {bodyRows?.map((row) => (
              <tr
                key={row._key}
                className="border-b text-[15px] even:bg-[#eae9e8]"
              >
                {row.cells.map((cell, i) => {
                  const isLastColumn = i === row.cells.length - 1

                  return (
                    <td
                      key={i}
                      className="py-[10px] px-[15px] md:py-[15px] md:px-[25px] text-center border text-[14px] leading-[20px] md:text-[15px] md:leading-[25px] border-[#e6eef3]"
                    >
                      {/* Last column = Image */}
                      {isLastColumn ? (
                        <div className="flex gap-2 justify-center items-center">
                          <img
                          src={"/images/uae_Dirham_Symbol.svg"}
                          alt={"Service Image"}
                          className="mx-w-3 max-h-3 object-contain"
                        />{cell}</div>
                      ) : (
                        cell || "—"
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
