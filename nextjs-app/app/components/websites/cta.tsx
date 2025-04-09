export default function CTA() {
    return (
      <div className="bg-[#eae9e8] py-3 px-4">
        <div className="max-w-[640px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-center sm:text-left">
            <p className="text-sm">
              Now you can buy your car online{" "}
              <a
                href="https://shop.geely.ae"
                className="text-[#194bff] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                shop.geely.ae
              </a>
            </p>
            <a
              href="https://shop.geely.ae"
              className="px-6 py-2 text-sm border border-black rounded hover:bg-black/5 transition-colors whitespace-nowrap"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy Now
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  