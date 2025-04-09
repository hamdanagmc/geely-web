"use client";
import { InfoSection } from "@/sanity.types";
import Image from "next/image";

type InfoProps = {
  block: InfoSection;
  index: number;
};

const carModels = [
  {
    id: "preface",
    name: "PREFACE",
    description:
      'The Geely Preface features a powerful 2.0TD engine, delivering 215hp, 325Nm torque and paired with a 7-speed DCT transmission. It includes advanced safety features like L2 ADAS and a 540° panoramic camera. The spacious and luxurious interior boasts a 13.2" HD infotainment screen and Harman Infinity audio system. Designed for both performance and comfort, the Preface stands out with its sophisticated design and high-quality materials.',
    specs: [
      { icon: "petrol", label: "PETROL", image : "/icon/diesel_icon.png.webp" },
      { icon: "engine", label: "2.0 TD", image : "/icon/turbo_icon.png.webp" },
      { icon: "transmission", label: "7 DCT", image : "/icon/transmission_icon.png.webp" },
      { icon: "fuel", label: "50 LITERS",image : "/icon/tank_icon.png.webp" },
      { icon: "speed", label: "200 KM/H",image : "/icon/gauge_icon.png.webp" },
    ],
    carImage : "/icon/preface.webp"
  },
  {
    id: "okavango",
    name: "OKAVANGO",
    description:
      "Unleash peak performance with the Geely Okavango, featuring a robust 2.0L TDI engine and a responsive 7-speed Dual-Clutch transmission. This combination promises a smooth and powerful start, transforming your drive into an enjoyable and dynamic experience.",
    specs: [
      { icon: "petrol", label: "PETROL", image : "/icon/diesel_icon.png.webp" },
      { icon: "engine", label: "2.0 TD", image : "/icon/turbo_icon.png.webp" },
      { icon: "transmission", label: "7 DCT", image : "/icon/transmission_icon.png.webp" },
      { icon: "fuel", label: "50 LITERS",image : "/icon/tank_icon.png.webp" },
      { icon: "speed", label: "200 KM/H",image : "/icon/gauge_icon.png.webp" },
    ],
    carImage : "/icon/okavango.webp"
  },
  {
    id: "monjaro",
    name: "MONJARO",
    description:
      "The New Geely Monjaro boasts a 2.0 turbocharged engine delivering 235 horsepower and 350 Newton meters of torque as well as the impressive 0-100 KM/H acceleration time in 7.7 seconds.",
    specs: [
      { icon: "petrol", label: "PETROL", image : "/icon/diesel_icon.png.webp" },
      { icon: "engine", label: "2.0 TD", image : "/icon/turbo_icon.png.webp" },
      { icon: "transmission", label: "7 DCT", image : "/icon/transmission_icon.png.webp" },
      { icon: "fuel", label: "50 LITERS",image : "/icon/tank_icon.png.webp" },
      { icon: "speed", label: "200 KM/H",image : "/icon/gauge_icon.png.webp" },
    ],
    carImage : "/icon/monjaro.webp"
  },
  {
    id: "tugella",
    name: "TUGELLA",
    description:
      "Tugella dazzles on the asphalt with its high-performance 2.0 turbocharged engine delivering 235 horsepower and 350 Newton meters of torque as well as the impressive 0-100 KM/H acceleration time in 6.9 to 7.4 seconds.",
    specs: [
      { icon: "petrol", label: "PETROL", image : "/icon/diesel_icon.png.webp" },
      { icon: "engine", label: "2.0 TD", image : "/icon/turbo_icon.png.webp" },
      { icon: "transmission", label: "7 DCT", image : "/icon/transmission_icon.png.webp" },
      { icon: "fuel", label: "50 LITERS",image : "/icon/tank_icon.png.webp" },
      { icon: "speed", label: "200 KM/H",image : "/icon/gauge_icon.png.webp" },
    ],
    carImage : "/icon/tugella.webp"
  },
  {
    id: "coolray",
    name: "COOLRAY",
    description:
      "Geely's Coolray takes command of the temporal realm with its 1.5 turbocharged Direct Injection Engine, delivering a formidable 130kW of power and 255 Nm of torque. Paired seamlessly with a 7-speed dual-clutch transmission, it accomplishes the 0-100km/h acceleration feat in just 7.6 seconds.",
    specs: [
      { icon: "petrol", label: "PETROL", image : "/icon/diesel_icon.png.webp" },
      { icon: "engine", label: "2.0 TD", image : "/icon/turbo_icon.png.webp" },
      { icon: "transmission", label: "7 DCT", image : "/icon/transmission_icon.png.webp" },
      { icon: "fuel", label: "50 LITERS",image : "/icon/tank_icon.png.webp" },
      { icon: "speed", label: "200 KM/H",image : "/icon/gauge_icon.png.webp" },
    ],
    carImage : "/icon/coolray.webp"
  },
  {
    id: "geometry-c",
    name: "GEOMETRY C",
    description:
      "Embarking on the electric adventure, Geometry C pioneers a new era with super-fast charging, replenishing 80% of its battery in less than 42 minutes. Concealed beneath its sleek exterior, Geometry C houses a powerful powertrain, possessing 150 kW of maximum power and 310 Nm of torque. With a swift acceleration from 0 to 100 km/h in just 7.7 seconds.",
    specs: [
      { icon: "ev", label: "EV" , image : "/icon/ev.webp" },
      { icon: "range", label: "UP TO 485 KM RANGE" , image : "/icon/turbo_icon.png.webp" },
      { icon: "transmission", label: "AUTOMATIC", image : "/icon/transmission_icon.png.webp" },
      { icon: "battery", label: "70 KWH", image : "/icon/battery.webp" },
      { icon: "speed", label: "200 KM/H",image : "/icon/gauge_icon.png.webp" },
    ],
    carImage : "/icon/geometry.webp"
  },
  {
    id: "emgrand",
    name: "EMGRAND",
    description:
      "A 1.5D engine and responsive 6 AT transmission propel 90KW and 180 N.m of torque, delivering a thrilling ride. Achieving an eco-conscious 5.82L/100Km, the Emgrand balances efficiency with performance. Experience the rush as it accelerates 0 to 100 km/h in just 11.96 seconds, redefining every drive.",
    specs: [
      { icon: "petrol", label: "PETROL", image : "/icon/diesel_icon.png.webp" },
      { icon: "engine", label: "2.0 TD", image : "/icon/turbo_icon.png.webp" },
      { icon: "transmission", label: "7 DCT", image : "/icon/transmission_icon.png.webp" },
      { icon: "fuel", label: "50 LITERS",image : "/icon/tank_icon.png.webp" },
      { icon: "speed", label: "200 KM/H",image : "/icon/gauge_icon.png.webp" },
    ],
    carImage : "/icon/emgrand.webp"
  },
]

export default function InfoSectionComp({ block }: InfoProps) {
  return (
    <>
      <div className={`bg-white pt-2 py-16 px-4 md:px-8`}>
        <div className="max-w-7xl mx-auto">

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Warranty */}
            <div className="border-r border-[#e4e4e4] px-6 pb-12 flex flex-col items-center">
              <div className="mb-4">
                <Image
                  src="/icon/warranty.png.webp"
                  alt="warranty"
                  width={55}
                  height={55}
                  className="object-cover"
                />
              </div>
              <h2 className="text-[#313d48] text-xl font-bold mb-4 text-center">
                WARRANTY
              </h2>
              <p className="text-[#606060] text-center">
                Geely vehicle comes with manufacture warranty up to 5 years or
                150,000 km for extended peace of mind.
              </p>
            </div>

            {/* Exclusive Fleet Rates */}
            <div className="border-r border-[#e4e4e4] px-6 pb-12 flex flex-col items-center">
              <div className="mb-4">
              <Image
                  src="/icon/fleet-sales.webp"
                  alt="warranty"
                  width={55}
                  height={55}
                  className="object-cover"
                />
              </div>
              <h2 className="text-[#313d48] text-xl font-bold mb-4 text-center">
                EXCLUSIVE FLEET RATES
              </h2>
              <p className="text-[#606060] text-center">
                With our tailored fleet rates - your journey to cost-effective
                excellence starts here!
              </p>
            </div>

            {/* Service Package */}
            <div className="px-6 pb-12 flex flex-col items-center">
              <div className="mb-4">
              <Image
                  src="/icon/service-package.webp"
                  alt="warranty"
                  width={55}
                  height={55}
                  className="object-cover"
                />
              </div>
              <h2 className="text-[#313d48] text-xl font-bold mb-4 text-center">
                SERVICE PACKAGE
              </h2>
              <p className="text-[#606060] text-center">
                Enjoy budget-friendly brilliance and top-notch care with Geely's
                discounted service package, turning routine maintenance into a
                delight for your Geely companion.
              </p>
            </div>

            {/* 24/7 Roadside Assistance */}
            <div className="border-r border-[#e4e4e4] px-6 flex flex-col items-center">
              <div className="mb-4">
              <Image
                  src="/icon/roadside-assistance.png.webp"
                  alt="warranty"
                  width={55}
                  height={55}
                  className="object-cover"
                />
              </div>
              <h2 className="text-[#313d48] text-xl font-bold mb-4 text-center">
                24/7 ROADSIDE ASSISTANCE
              </h2>
              <p className="text-[#606060] text-center">
                With our Roadside Assistance, you need nothing, yet focus on the
                road and the steering wheel while your Geely gets the perfect
                assistance.
              </p>
            </div>

            {/* Certified Professional Team */}
            <div className="border-r border-[#e4e4e4] px-6 flex flex-col items-center">
              <div className="mb-4">
              <Image
                  src="/icon/certified.webp"
                  alt="warranty"
                  width={55}
                  height={55}
                  className="object-cover"
                />
              </div>
              <h2 className="text-[#313d48] text-xl font-bold mb-4 text-center">
                CERTIFIED PROFESSIONAL TEAM
              </h2>
              <p className="text-[#606060] text-center">
                Our certified team ensures excellence, dedicated to delivering
                unparalleled support for an exceptional experience.
              </p>
            </div>

            {/* Secured Fulfilment */}
            <div className="px-6 flex flex-col items-center">
              <div className="mb-4">
              <Image
                  src="/icon/securedFulfilment.webp"
                  alt="warranty"
                  width={55}
                  height={55}
                  className="object-cover"
                />
              </div>
              <h2 className="text-[#313d48] text-xl font-bold mb-4 text-center">
                SECURED FULFILMENT
              </h2>
              <p className="text-[#606060] text-center">
                Geely aftersales ensures secured fulfilment with swift parts
                distribution, enhancing your Geely's performance.
              </p>
            </div>
            
          </div>
        </div>
      </div>

      <div className={`bg-black py-16 px-4`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-center text-2xl md:text-3xl lg:text-4xl font-medium leading-tight">
          With our tailored fleet rates - your journey to cost effective excellence starts here!
        </h2>
      </div>
    </div>

    <div className={`bg-white py-16 px-4 md:px-8`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
          <div className="mb-8 md:mb-0 md:max-w-2xl">
            <h2 className="text-[#313d48] text-3xl md:text-4xl font-bold mb-2">FOR COMPANIES</h2>
            <h3 className="text-[#313d48] text-2xl md:text-3xl font-bold mb-6">DO YOU HAVE A CUSTOMIZED REQUEST</h3>

            <p className="text-[#606060] text-lg mb-2">Get in touch with me!</p>
            <p className="text-[#606060] text-lg mb-1">
              I'm <span className="font-bold geelyBold">Syed Rayid</span> – Fleet Sales Manager
            </p>
            <p className="text-[#606060] text-lg mb-6">Feel free to contact with me anytime!</p>

            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <div>
                <p className="text-[#606060]"><span className="geelyBold text-[20px] font-bold">Email:</span> <a href="mailto:syed.rayid@agmc.ae" className="text-[#313d48] hover:underline">
                  syed.rayid@agmc.ae
                </a></p>
                
              </div>
              <div>
                <p className="text-[#606060]"><span className="geelyBold text-[20px] font-bold">Phone:</span> <a href="tel:+971505190986" className="text-[#313d48] hover:underline">
                  +971 505190986
                </a></p>
                
              </div>
            </div>

            <a
              href="https://wa.me/971505190986"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#28d146] text-white font-medium py-3 px-6 rounded-full hover:bg-opacity-90 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                <path d="M13.5 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                <path d="M9 13.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5Z" />
              </svg>
              WhatsApp me
            </a>
          </div>

          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden">
              <Image
                src="/images/Picture4-1.png.webp"
                alt="Fleet Sales Manager"
                width={320}
                height={320}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>


    <div className={`bg-white py-16 px-4 md:px-8`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-[#313d48] text-3xl md:text-4xl font-bold mb-12">
          EXPLORE WIDE RANGE OF MODELS
        </h2>

        <div className="space-y-6">
          {carModels.map((car) => (
            <div key={car.id} className="flex flex-col md:flex-row bg-[#f5f5f5] border border-[#e4e4e4] relative">
              <div className="md:w-1/3 md:h-auto relative p-0 bg-[#fff]">
                <Image
                  src={car.carImage}
                  alt={`Geely ${car.name}`}
                  width={360}
                  height={380}
                  className="object-contain h-full w-full"
                  style={{ objectPosition: "left center" }}
                />
              </div>

              <div className="md:w-2/3 p-6 flex flex-col justify-center">
                <h3 className="text-[#313d48] text-2xl font-bold mb-3">{car.name}</h3>
                <p className="text-[#606060] mb-6">{car.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 border-t border-[#e4e4e4] pt-4">
                  {car.specs.map((spec, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 mb-2">
                        <Image
                          src={spec.image}
                          alt={spec.label}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[#313d48] text-sm font-medium">{spec.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    </>
  );
}
