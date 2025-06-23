import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-4xl">
        {/* Title */}
        <h1 className="mb-12 tracking-wider">
          <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-pink-400 font-serif">
            LILY'S
          </span>
          <span className="text-6xl md:text-7xl lg:text-8xl font-semibold text-green-600 font-['Dancing_Script'] italic ml-2">
            Garden
          </span>
        </h1>
        
        {/* Flower Image */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/lilies.webp"
            alt="Pink Lily Flowers"
            width={300}
            height={300}
            className="w-64 h-auto md:w-80 lg:w-96 max-w-full"
            priority
          />
        </div>
        
        {/* Welcome Text */}
        <p className="text-xl text-gray-700 mb-2 font-serif">
          Welcome to My Garden
        </p>
        
        {/* Enter Link */}
        <p className="text-lg text-gray-600 hover:text-pink-400 transition-colors duration-300 cursor-pointer font-serif">
          Enter
        </p>
      </div>
    </div>
  );
}