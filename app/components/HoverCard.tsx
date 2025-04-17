"use client";

export default function HoverCard({ image, specs }: { image: string; specs: any }) {
  return (
    <div className="relative group w-48">
      <img src={image} className="opacity-100 group-hover:opacity-0 transition-opacity duration-300 w-full" />
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 bg-black text-white">
        <h2 className="text-lg font-bold">PC Specs</h2>
        <p>CPU: {specs.cpu}</p>
        <p>GPU: {specs.gpu}</p>
        <p>RAM: {specs.ram}</p>
      </div>
    </div>
  );
}
