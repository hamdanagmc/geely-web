export default async function BookingNotFound(){
    return(
        <div>
            <div className="max-w-[1000px] mx-auto md:py-16 py-8">
  
                <div className="flex flex-col items-center justify-center text-center gap-6 px-8 md:px-2">
                    
                    <h1 className="md:text-4xl text-[1.5rem] font-bold">Couldn't Find Your Booking!</h1>
  
                    <div>
                        <p className="font-[18px] leading-[28px ]">It looks like the License Plate Number and Email ID you entered don't match any records in our system.</p>
                        <p className="font-[18px] leading-[28px ]"> Double-check the details and try again. If you believe this is an error or need help, feel free to contact our support team.</p>
                    </div>
  
                    <h2 className="md:text-[20px] text-[16px]">Need help? Call us directly at +971 800 43359 </h2>
                        
                    <button className="min-w-[100px] bg-[#0D0E12] text-[white] px-5 py-2 md:text-[16px] text-[12px] mx-auto">Try again</button>
                </div>
            </div>
        </div>
    )
  }