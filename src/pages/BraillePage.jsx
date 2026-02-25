import { useState } from 'react';
import BrailleInput from '../components/braille/BrailleInput';
import BrailleDisplay from '../components/braille/BrailleDisplay';
import BrailleHapticTrainer from '../components/braille/BrailleHapticTrainer';


export default function BraillePage() {
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("reading");

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Sahass Braille</h1>
            <p className="text-gray-500">UEB Grade 2 Learning System</p>
          </div>
          
          <div className="flex bg-gray-200 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab("reading")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "reading" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Reading Mode
            </button>
            <button 
              onClick={() => setActiveTab("training")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "training" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Haptic Trainer
            </button>
          </div>
        </header>

        <BrailleInput onConvert={setText} />

        <div className="transition-all duration-300">
          {activeTab === "reading" ? (
            <BrailleDisplay text={text} />
          ) : (
            <BrailleHapticTrainer text={text} />
          )}
        </div>
      </div>
    </div>
  );
}