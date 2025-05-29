


export default async function ServiceBookingStatus(){

    const user=[{key:"customer name", value:"Mr. John Doe"},
        {key:"Registered Phone No.", value:"+971 50 123 4567"},
        {key: "Registered Email", value:"john.doe@gmail.com"},
        {key: "Address Line 1", value:"Blk3, St Al Qenaee, H18"},
        {key: "Area / Locality", value: "Salmiya, Dubai"},
        {key: "Country", value: "UAE"}
    ]

    type ServiceItem = {
        [key: string]: string | Date | undefined,
      };

    const vehicle:ServiceItem[][]=[
        [
          { serviceName: 'Brake Inspection'}, 
          {vehicle: 'Toyota Corolla'},
          { serviceDateTime: '2025-04-28 10:00 AM'},
          { status: 'Complete' },
          
        ],
        [
            { serviceName: 'Brake Inspection'}, 
          {vehicle: 'Toyota Corolla'},
          { serviceDateTime: '2025-04-28 10:00 AM'},
          { status: 'Complete' },
          

        ],
        [
            { serviceName: 'Brake Inspection'}, 
          {vehicle: 'Toyota Corolla'},
          { serviceDateTime: '2025-04-28 10:00 AM'},
          { status: 'Complete' },
          

        ],
        [
            { serviceName: 'Brake Inspection'}, 
          {vehicle: 'Toyota Corolla'},
          { serviceDateTime: '2025-04-28 10:00 AM'},
          { status: 'Complete' },
          

        ],
        [
            { serviceName: 'Brake Inspection'}, 
          {vehicle: 'Toyota Corolla'},
          { serviceDateTime: '2025-04-28 10:00 AM'},
          { status: 'Complete' },
          

        ],
        
      ];

    return(
        <div>
            <div className="max-w-[1200px] mx-auto md:py-16 py-8 mx-auto px-4">
                <div className="text-center">
                    <h1 className="md:text-4xl text-[1.5rem] font-bold mb-4">Service Booking</h1>
                    <p className="font-[400] text-[16px] leading-[24px]">Welcome back, <span className="font-[700]">Mr. John Doe</span></p>
                    <button className="min-w-[100px] bg-[#0D0E12] text-[white] px-4 py-2 md:text-[16px] text-[12px] mx-auto md:mt-4 mt-2">Book A New Appointment</button>
                </div>
            

            <div className="max-w-[1000px] mx-auto px-">
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] justify-center bg-[#FAFAFA] p-4 my-4  rounded-sm gap-5">
                        {user.map((user, index)=>(
                            <div key={index} className="">
                            <p className="font-[500] text-[12px] leading-[20px] ">{user.key}</p>
                            <h1 className="md:font-[700] md:text-[18px] text-[16px] font-[600] leading-[20px] mt-1">{user.value}</h1>
                        </div>
                        ))}
                </div>
                
                {vehicle.map((vehicleGroup, index) => (
                    <div key={index} className="flex flex-col gap-4 overflow-auto">
                    <div className={`grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] justify-center bg-[#FAFAFA] p-4 my-2  rounded-sm gap-5`}>
                        
                        {vehicleGroup.map((car, idx) => {
                            const key = Object.keys(car)[0];
                            const value = car[key];
                            return (
                            <div key={idx}>
                                <p className="font-[500] text-[12px] leading-[20px]">{key}</p>
                                <h2 className="md:font-[700] md:text-[18px] text-[16px] font-[600] leading-[20px] mt-1"></h2>
                            </div>
                            );
                        })}

                    </div>
                </div>
                ))}

             </div>
             </div>
        </div>
    )
}