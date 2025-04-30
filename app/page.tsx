'use client';

import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";

const questions = [
  {
    prefix: "Mau cari ",
    animated: "UMKM di Bali",
    suffix: " ?"
  },
  {
    prefix: "Mau cari ",
    animated: "rekan semeton",
    suffix: "?"
  },
  {
    prefix: "Mau cari ",
    animated: "supplier celeng",
    suffix: "?"
  },
  {
    prefix: "Mau cari ",
    animated: "pebisnis lain",
    suffix: "?"
  },
];

export default function Home() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextVisible(false);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
        setIsTextVisible(true);
      }, 1000); // Wait for fade out before changing text
    }, 4000); // Change question every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-center">
          {questions[currentQuestionIndex].prefix}
          <span
            className={`transition-opacity text-red-500 duration-500 ${
              isTextVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {questions[currentQuestionIndex].animated}
          </span>
          {questions[currentQuestionIndex].suffix}
        </h1>
        <p className="text-lg text-center text-grey-600">
          Cari dan temukan UMKM di Bali dengan mudah dan cepat. Temukan rekan bisnis, supplier, dan peluang baru di satu tempat. LokaPedia Bali!
        </p>
        
        <div className="w-full">
          <SearchBar className="max-w-3xl mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-8">
          <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Cari</h3>
            <p className="text-center text-gray-600">Cari UMKM Bali dengan mudah</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Cocokkan</h3>
            <p className="text-center text-gray-600">Cocokkan dengan kebutuhan</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Hubungkan</h3>
            <p className="text-center text-gray-600">Terhubung dengan UMKM yang tepat</p>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
        <p>© 2025 lokapediabali. All rights reserved.</p>
        <p>Hasil kerjasama epik dalam semalam dengan AI</p>
      </footer>
    </div>
  );
}
