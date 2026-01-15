"use client"
import { getAllModels, getAllSparePartsForModel, getSparePartsTable } from "@/app/actions/common/sanityData"
import type { Models, SparePartsModel } from "@/sanity.types"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ShowTableData } from "./ShowTableData"
import Select from "react-select"
import useDeviceDetection from "@/app/hooks/useDeviceDetection"

type SpareModelProps = {
  block: SparePartsModel
  data: SparePart
}

interface OptionType {
  value: string
  label: string
}

interface SparePart {
  _id: string
  hasTrim: boolean
  trimName?: string
}

export default function SpareModel({ block, data }: SpareModelProps) {
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const [selectedTrim, setSelectedTrim] = useState<OptionType | null>(null)
  const [spareModels, setSpareModels] = useState<Models[]>([])
  const [availableSpareParts, setAvailableSpareParts] = useState<SparePart[]>([])
  const [sparePartsTable, setSparePartsTable] = useState()
  const [showResults, setShowResults] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(true)
  const [isLoadingTrims, setIsLoadingTrims] = useState(false)
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const { isMobileDevice } = useDeviceDetection()

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: "transparent",
      boxShadow: "none",
      fontSize: "16px",
      borderRadius: "0",
      border: 0,
      padding: isMobileDevice ? "4px 10px" : "8px 15px",
      "&:hover": {
        borderColor: "transparent",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "gray",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      padding: "8px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      cursor: "pointer",
      outline: 0,
    }),
  }

  const modelOptions: OptionType[] = spareModels.map((item) => ({
    value: item.modelName || "",
    label: item.modelName || "",
  }))

  const trimOptions: OptionType[] = availableSpareParts
    .filter((part) => part.hasTrim && part.trimName)
    .map((part) => ({
      value: part.trimName || "",
      label: part.trimName || "",
    }))

  const hasTrims = trimOptions.length > 0

  const pathname = usePathname()
  const pathSegments = pathname.split("/")
  const currentLocale = pathSegments[1] || "en"

  console.log("Spare Parts Table:", sparePartsTable)

  const handleCheck = async () => {
    if (hasTrims && !selectedTrim) {
      alert(
        block?.selectTrimPlaceholder
          ? `Please select ${block.selectTrimPlaceholder.toLowerCase()}`
          : "Please select a trim",
      )
      return
    }
    setSelectedOption(selectedModel)
    setIsLoadingTable(true)
    try {
      const data = await getSparePartsTable(currentLocale, selectedModel)
      setSparePartsTable(data)
      setShowResults(true)
      setTimeout(() => {
        const tableElement = document.getElementById("spare-parts-table-results")
        if (tableElement) {
          tableElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    } finally {
      setIsLoadingTable(false)
    }
  }

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true)
      try {
        const data = await getAllModels(currentLocale)
        setSpareModels(data || [])
      } finally {
        setIsLoadingModels(false)
      }
    }
    fetchModels()
  }, [currentLocale])

  useEffect(() => {
    if (!selectedModel) {
      setAvailableSpareParts([])
      setSelectedTrim(null)
      setShowResults(false)
      return
    }

    const fetchSpareParts = async () => {
      setIsLoadingTrims(true)
      try {
        const data = await getAllSparePartsForModel(currentLocale, selectedModel)
        setAvailableSpareParts(data || [])
        setSelectedTrim(null)
        setShowResults(false)
        setSparePartsTable(undefined)
      } finally {
        setIsLoadingTrims(false)
      }
    }
    fetchSpareParts()
  }, [selectedModel, currentLocale])

  return (
    <div className="px-[20px] md:px-[80px] xl:px-[60px]">
      <section
        className="relative rounded-[5px] py-[40px] lg:py-[60px] flex-col md:px-5 lg:px-5 flex lg:flex-row items-center justify-center mb-16"
        style={{
          backgroundImage: "url('/images/network_form_bg.webp')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center gap-5 lg:gap-6">
          <h3 className="text-[20px] lg:text-3xl font-semibold text-black uppercase">{block?.title}</h3>

          <div className="flex flex-col md:flex-row md:flex-wrap xl:flex-nowrap items-center gap-4 lg:gap-[30px] w-full justify-center">
            <div className="flex flex-col md:flex-row gap-5">
              <div className={`w-[260px] md:w-[300px] lg:w-[350px] transition-all`}>
                <Select
                  instanceId="model-select"
                  options={modelOptions}
                  value={modelOptions.find((o) => o.value === selectedModel) || null}
                  onChange={(option) => setSelectedModel(option?.value ?? "")}
                  placeholder={block?.selectModelPlaceholder || "Select Model"}
                  styles={customStyles}
                  isSearchable={false}
                  isDisabled={isLoadingModels}
                  isLoading={isLoadingModels}
                />
              </div>

              {hasTrims && (
                <div className="w-[260px] md:w-[300px] lg:w-[350px] transition-all">
                  <Select
                    instanceId="trim-select"
                    options={trimOptions}
                    value={selectedTrim}
                    onChange={(option) => {
                      setSelectedTrim(option)
                      setShowResults(false)
                    }}
                    placeholder={block?.selectTrimPlaceholder || "Select Trim"}
                    styles={customStyles}
                    isSearchable={false}
                    isDisabled={isLoadingTrims}
                    isLoading={isLoadingTrims}
                  />
                </div>
              )}
            </div>

            <div className="w-max">
              <button
                onClick={handleCheck}
                disabled={isLoadingTable || !selectedModel || isLoadingTrims}
                className="text-base py-[10px] min-w-[260px] leading-[24px]  cursor-pointer md:w-max rounded md:text-[16px] md:leading-[28px] md:min-w-[8em] text-white bg-black px-8 md:py-3 font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoadingTable && (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {block?.buttonText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {showResults && selectedModel && (
        <div id="spare-parts-table-results">
          <ShowTableData data={sparePartsTable} model={selectedOption} myModel={block} />
        </div>
      )}
    </div>
  )
}
