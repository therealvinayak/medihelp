import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FileUpload from './components/FileUpload';
import ModeToggle from './components/ModeToggle';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [mode, setMode] = useState('patient');
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [symptomInput, setSymptomInput] = useState('');
  const [prescription, setPrescription] = useState('');
  const [loading, setLoading] = useState(false);

  const prescriptionRef = useRef(null);

  const scrollToPrescription = () => {
    prescriptionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleSummarize = async () => {
    setLoading(true);
    setSummary('');

    let text = inputText;

    if (!text && uploadedFile) {
      try {
        text = await readFileAsText(uploadedFile);
      } catch (e) {
        alert("Failed to read uploaded file.");
        setLoading(false);
        return;
      }
    }

    if (!text) {
      alert("Please upload a file or paste some text.");
      setLoading(false);
      return;
    }

    const prompt =
      mode === 'patient'
        ? `You're an AI healthcare assistant. Read the following doctor notes and summarize in simple, friendly language for the patient. Include:\n1. Diagnosis or reason for visit\n2. Medications and when to take them\n3. Any follow-up steps\n\nAvoid medical jargon. Be very clear.\n\nDoctor's Notes:\n${text}`
        : `You're a medical assistant. Extract and present the following from these clinical notes in accurate, professional format:\n1. Diagnosis\n2. Prescribed medications (with dosage)\n3. Follow-up recommendations\n\nDoctor's Notes:\n${text}`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      setSummary(data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary returned.");
    } catch (err) {
      console.error("API error:", err);
      alert("Something went wrong. Check console.");
    }

    setLoading(false);
  };

  const handlePrescription = async () => {
    if (!symptomInput) {
      alert("Please enter your symptoms or health issue.");
      return;
    }

    setLoading(true);
    setPrescription('');

    const prompt = `You're an AI medical assistant. A patient has described their symptoms below. Based on that, suggest a possible diagnosis, list 1-2 commonly prescribed medications (with dosage), and provide 2-3 simple care or follow-up tips.\n\nPatient Symptoms:\n${symptomInput}\n\nRespond in a friendly but clear way. Mark clearly that this is not a real prescription.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      setPrescription(data.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestion returned.");
    } catch (err) {
      console.error("API error:", err);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <Hero />

      {/* 🔽 New Scroll Button */}
      <button
        onClick={scrollToPrescription}
        className="block mx-auto mt-6 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
      >
        Try AI Prescription Assistant
      </button>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <FileUpload uploadedFile={uploadedFile} onFileUpload={setUploadedFile} />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Or paste medical notes below
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            placeholder="Enter or paste the consultation notes here..."
            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-none"
          />
        </div>

        <ModeToggle mode={mode} onModeChange={setMode} />

        <button
          onClick={handleSummarize}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>

        <div className="mt-4 p-6 rounded-xl bg-blue-50 text-blue-900 border border-blue-200">
          {summary ? (
            <>
              <h2 className="font-bold mb-2 text-lg">🧠 AI Summary</h2>
              <p className="whitespace-pre-line">{summary}</p>
            </>
          ) : (
            <p className="font-semibold">Summary will appear here...</p>
          )}
        </div>

        {/* 🔽 Prescription Section with ref */}
        <div ref={prescriptionRef} className="mt-10 space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Describe your health issue (symptoms, discomfort, etc)
          </label>
          <textarea
            value={symptomInput}
            onChange={(e) => setSymptomInput(e.target.value)}
            rows={5}
            placeholder="E.g. I'm experiencing a sore throat and mild fever for 2 days..."
            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm resize-none"
          />

          <button
            onClick={handlePrescription}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Generating..." : "Get Prescription Advice"}
          </button>

          {prescription && (
            <div className="mt-4 p-6 rounded-xl bg-green-50 text-green-900 border border-green-200">
              <h2 className="font-bold mb-2 text-lg">Your Prescription Advice: </h2>
              <p className="whitespace-pre-line">{prescription}</p>
              <p className="text-xs text-gray-500 mt-2">⚠️ This is AI-generated and should not replace professional medical advice.</p>
            </div>
          )}
        </div>

        <footer className="text-center text-xs text-gray-400 mt-10">
          ⚠️ All outputs are AI-generated and should not replace professional medical diagnosis or treatment.
        </footer>
      </main>
    </div>
  );
}

export default App;
