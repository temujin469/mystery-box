import Image from "next/image";

export function Banner() {
  return (
    <div
      className="w-full bg-[#1A162D] rounded-2xl shadow-lg overflow-hidden" // Updated base background for a better overall match
      style={{ minHeight: 220 }}
    >
      {/* Main Flex Container: Two primary columns */}
      <div className="flex flex-col md:flex-row items-stretch w-full h-full">

        {/* Left Primary Column: Contains Sign Up Text & Box Image */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sign Up Section (Leftmost part of the banner) */}
          <div className="flex-1 flex flex-col justify-between px-6 py-8 md:py-12 md:px-12
                          bg-gradient-to-r from-[#1A162D] to-[#221A39] relative"> {/* Adjusted gradient */}
            {/* Subtle background pattern/glow (optional, but in image) - could be a more complex CSS or an SVG */}
            {/* For simplicity, we'll just rely on the gradient and the box image's background to fill the space */}
            <div>
              <h2 className="text-white font-bold text-3xl md:text-4xl mb-2 leading-tight">
                Sign Up today
                <br />
                and claim your <span className="text-[#1BF76A]">FREE box</span> {/* Green highlight for "FREE box" */}
              </h2>
              <p className="text-[#bdb8d4] text-base mb-6 max-w-md">
                Unlock YOUR Free Box Today! Each box is a treasure trove of excitement waiting to be discovered. Don&apos;t miss out – dive into the unknown with us!
              </p>
            </div>
            <button className="bg-[#7240E9] hover:bg-[#8554FF] transition text-white font-semibold px-6 py-2 rounded-lg text-base w-fit mt-2 shadow-md"> {/* Vibrant purple button */}
              Claim now
            </button>
          </div>

          {/* Box Image Section (Middle part of the banner, next to Sign Up) */}
          <div className="flex items-center justify-center flex-shrink-0 relative w-full md:w-[400px] min-w-[280px]
                          bg-gradient-to-tr from-[#18114D] to-[#6C5ECF]/30 rounded-none md:rounded-r-2xl"> {/* Adjusted gradient, added right rounding for visual break */}
            {/* The circular graphic in the image is part of the image asset, or a complex CSS background. */}
            {/* Assuming "/banner2.jpg" is the actual image with the box and logo from the UI */}
            <div className="relative w-[250px] h-[180px] md:w-[300px] md:h-[215px] mx-auto">
              <Image
                src="/banner2.jpg" // Make sure this path points to the exact image from the UI
                alt="Free Box"
                fill
                className="object-contain"
                priority
              />
              {/* "Free" tag on top-left of the box image */}
              <div className="absolute top-6 left-2 bg-[#1bf76a] text-[#193f25] px-3 py-1 rounded-md text-xs font-bold shadow-lg">
                Free
              </div>
              {/* "Free" tag on bottom-left of the box image */}
              <div className="absolute bottom-3 left-1 bg-white/80 text-[#6a6a8a] px-2 py-1 rounded text-xs font-semibold">
                Free
              </div>
            </div>
          </div>
        </div>

        {/* Right Primary Column: Referral Section */}
        <div className="flex-shrink-0 w-full md:w-[350px] flex flex-col justify-between px-6 py-8 md:py-12 md:px-12
                        bg-[#191726] rounded-none md:rounded-r-2xl relative"> {/* Solid darker background, rounded on the right */}
          <div>
            <h3 className="text-white font-semibold text-xl md:text-2xl mb-2 leading-snug">
              Earn up to <span className="text-[#A0FFEA]">10%</span> on deposits from your friends
              <span className="ml-1 bg-[#ff6cd3] text-black rounded px-2 text-sm font-bold align-middle">5%</span> {/* Pink 5% tag */}
            </h3>
            <p className="text-[#bdb8d4] text-base mb-5 max-w-xs">
              Give your friends 3 free cases and a 5% bonus added to all their cash purchases
            </p>
          </div>
          <button className="bg-[#1bf76a] hover:bg-[#0fdc5c] transition text-[#132919] font-semibold px-6 py-2 rounded-lg text-base w-fit mb-2 shadow-md"> {/* Vibrant green button */}
            Refer a friend
          </button>
          {/* Decorative image for referral section */}
          {/* Assuming "/banner3.avif" is the exact image from the UI (chart/speaker icon) */}
          <div className="absolute bottom-2 right-3 w-[70px] h-[70px] md:w-[90px] md:h-[90px]">
            <Image
              src="/banner3.avif" // Make sure this path points to the exact image from the UI
              alt="Referral Bonus"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}