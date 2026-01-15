"use client"
import { getAllModels, getServiceTable } from "@/app/actions/common/sanityData"
import type { Models, ServiceCostModel } from "@/sanity.types"
import Select, { type SingleValue } from "react-select"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ShowTableData } from "./ShowTableData"
import type { PortableTextBlock } from "next-sanity"
import PortableText from "@/app/components/PortableText"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import useDeviceDetection from "@/app/hooks/useDeviceDetection"

interface OptionType {
  value: string
  label: string
}

const AZKARRA_VARIANTS: OptionType[] = [
  { value: "7DCT", label: "7DCT" },
  { value: "6AT", label: "6AT" },
]

type ServiceModelProps = {
  block: ServiceCostModel
}

export default function ServiceModel({ block }: ServiceModelProps) {
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const [ServiceModel, setServiceModels] = useState<Models[]>([])
  const [serviceTable, setServiceTable] = useState()
  const [isLoadingModels, setIsLoadingModels] = useState(true)
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const { isMobileDevice } = useDeviceDetection()

  const modelOptions: OptionType[] = ServiceModel.map((item) => ({
    value: item.modelName || "",
    label: item.modelName || "",
  }))

  const [selectedModeltwo, setSelectedModeltwo] = useState<SingleValue<OptionType>>(modelOptions[0])
  const [selectedVariant, setSelectedVariant] = useState<SingleValue<OptionType>>(null)
  const [showResults, setShowResults] = useState(false)

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

  const handleCheck = async () => {
    if (selectedModel === "AZKARRA" && !selectedVariant) {
      alert("Please select a variant")
      return
    }
    setSelectedOption(selectedModel)
    setIsLoadingTable(true)
    setShowResults(false)

    try {
      const data = await getServiceTable(currentLocale, selectedModel)
      setServiceTable(data)
      setShowResults(true)
      setTimeout(() => {
        const tableElement = document.getElementById("service-table-results")
        if (tableElement) {
          tableElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    } catch (error) {
      console.error("Error fetching service table:", error)
    } finally {
      setIsLoadingTable(false)
    }
  }

  const pathname = usePathname()
  const pathSegments = pathname.split("/")
  const currentLocale = pathSegments[1] || "en"

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true)
      try {
        const data = await getAllModels(currentLocale)
        setServiceModels(data || [])
      } catch (error) {
        console.error("Error fetching models:", error)
      } finally {
        setIsLoadingModels(false)
      }
    }
    fetchModels()
  }, [currentLocale])

  console.log("Service Table Data:", serviceTable)
  return (
    <div className="px-[20px] md:px-[80px] xl:px-[60px] pb-[70px]">
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

          <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-[30px] w-full justify-center">
            <div className={`w-[260px] md:w-[300px] lg:w-[350px] transition-all`}>
              <Select
                instanceId="model-select"
                options={modelOptions}
                value={modelOptions.find((o) => o.value === selectedModel) || null}
                onChange={(option) => setSelectedModel(option?.value ?? "")}
                placeholder={isLoadingModels ? "Loading models..." : block?.selectModelPlaceholder || "Select Model"}
                styles={customStyles}
                isSearchable={false}
                isDisabled={isLoadingModels}
                isLoading={isLoadingModels}
              />
            </div>

            <div className="w-max">
              <button
                onClick={handleCheck}
                disabled={!selectedModel || isLoadingTable}
                className="text-base py-[10px] leading-[24px] min-w-[260px] cursor-pointer rounded md:text-[16px] lg:text-[16px] lg:leading-[28px] md:leading-[28px] md:min-w-[8em] text-white bg-black px-8 lg:py-3 font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoadingTable && <Loader2 className="w-5 h-5 animate-spin" />}
                {block?.buttonText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {showResults && selectedModel && (
        <div id="service-table-results">
          <ShowTableData data={serviceTable} model={selectedOption} myModel={block} />
        </div>
      )}

      <div className="contactInfoText">
        {block?.termAndConditionText?.length && showResults && selectedModel && (
          <PortableText
            className="text-[#606060] text-lg mb-2"
            value={block.termAndConditionText as PortableTextBlock[]}
          />
        )}
      </div>
      <div className="flex flex-col gap-5 mt-5 lg:flex-row lg:flex-wrap lg:justify-between items-center">
        <p className="text-base text-center">{block?.pdfLabel}</p>
        <div className="w-max">
          <Link
            href="https://geelyksa.com/wp-content/uploads/2024/10/PMS-Old-Vehicles.pdf"
            target="_blank"
            className="md:text-[20px] text-base min-w-[8em] py-2 px-5 md:px-[20px] md:py-[10px] font-[500] rounded border w-max hover:bg-[#194BFF] hover:text-white transition ease-in-out duration-300"
          >
            {block?.downloadButtonText}
          </Link>
        </div>
      </div>
    </div>
  )
}
