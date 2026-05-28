import { Mic, CloudUpload } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import TranscriptionCard from './components/TranscriptionCard'
// 1. Define a TypeScript interface for the transcription object
interface Transcription {
  id: string;
  text: string;
  timestamp: string;
}



const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  // 3. State to store the array of transcriptions
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([
    // Dummy data included so you can see how it looks immediately
    {
      id: "1",
      text: "Hello, this is a sample transcribed text from your audio file.",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      text: "Another completed transcription instance displays here.",
      timestamp: "10:45 AM",
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const createFormData = () => {
    if (!file) {
      setStatus("Please select an audio file first.");
      return null;
    }
    const formData = new FormData();
    formData.append("audio", file);
    return formData;
  };

  const uploadWithAxios = async () => {
    const formData = createFormData();
    if (!formData) return;

    setStatus("Uploading with Axios...");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setStatus(`Axios Success: ${response.data.message}`);

      // 4. Append new backend transcriptions to state if returned
      if (response.data.transcription) {
        const newTranscription: Transcription = {
          id: Date.now().toString(),
          text: response.data.transcription,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setTranscriptions((prev) => [newTranscription, ...prev]);
      }
    } catch (error: any) {
      setStatus(
        `Axios Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full font-sans">
      <nav className="text-4xl font-bold flex justify-center py-6 text-gray-800">
        Speech-to-Text
      </nav>

      {/* Top container */}
      <div className="px-10 flex gap-6 h-auto">
        {/* Left container */}
        <div className="bg-white rounded-2xl p-6 w-1/2 shadow-sm flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 mb-4">
              File Upload
            </h1>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[150px]">
              <CloudUpload size={44} className="text-gray-400 mb-2" />
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {file && (
                <p className="text-xs text-green-600 mt-2">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={uploadWithAxios}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-all active:scale-95 w-full self-center"
          >
            Upload & Transcribe
          </button>
        </div>

        {/* Right side */}
        <div className="bg-white rounded-2xl p-6 w-1/2 shadow-sm flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 mb-4">
              Record Audio
            </h1>
            <div className="flex items-center justify-center min-h-[150px]">
              <button className="bg-red-50 hover:bg-red-100 border border-red-200 rounded-full p-5 transition-all active:scale-95 shadow-sm">
                <Mic size={40} className="text-red-500" />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            Click mic to start recording
          </p>
        </div>
      </div>

      {/* Status Bar */}
      {status && (
        <div className="mx-10 mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-xl border border-blue-100">
          {status}
        </div>
      )}

      {/* Bottom container - Transcriptions List */}
      <div className="m-10 p-6 bg-white rounded-2xl shadow-sm flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Transcriptions
        </h1>

        {/* 5. Map and render grid loop */}
        {transcriptions.length === 0 ? (
          <p className="text-gray-400 text-sm italic">
            No transcriptions yet. Upload or record audio to begin.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {transcriptions.map((item) => (
              <TranscriptionCard key={item.id} transcription={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;