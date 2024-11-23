"use client";

import SmoothScrolling from "../components/SmoothScrolling";

export default function Home() {
  
  return (
    <SmoothScrolling>
      <main className="overflow-x-hidden">
        <div className="flex flex-col w-full justify-center items-center h-full">
          <h1 className="mb-[10rem] flex h-screen justify-center text-7xl items-center w-screen text-white uppercase font-bold">
            Tarnish 
          </h1>

          <h1 className="mt-[10rem] mb-[20rem] flex h-screen justify-center text-7xl items-center w-screen text-white uppercase font-bold scrollingTest">
            Tarnish 
          </h1>
          <h1 className="mt-[20rem] flex h-screen justify-center text-7xl items-center w-screen text-white uppercase font-bold scrollingTest2">
            Tarnish 
          </h1>
        </div>
      </main>
    </SmoothScrolling>
  );
}
