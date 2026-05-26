import { Mic, CloudUpload } from "lucide-react";
import axios from 'axios';
import {useState} from 'react'
const App = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  // Handle file selection from input
  const handleFileChange = (e:any) => {
    setFile(e.target.files[0]);
  };

  // Prepare the form data package
  const createFormData = () => {
    if (!file) {
      setStatus("Please select an audio file first.");
      return null;
    }
    const formData = new FormData();
    // 'audio' must match the key name the backend Multer middleware expects
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
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setStatus(`Axios Success: ${response.data.message}`);
      } catch (error:any) {
        setStatus(
          `Axios Error: ${error.response?.data?.message || error.message}`
        );
      }
    };
  
  return (
    <div className="bg-[rgba(0,0,0,0.35)] h-screen w-100vw">
      <nav className="text-6xl font-bold flex justify-self-center">
        Speech-to-Text
      </nav>
      {/* top container */}
      <div className="ml-10 p-10 flex h-4/9 gap-4">
        {/* left container */}
        <div className="bg-white h-75 w-1/2 rounded-2xl p-5">
          <h1 className="text-2xl"> File Upload</h1>
          <div className="bg-gray-400 h-50 rounded-2xl">
            <div className="flex flex-col self-center justify-self-center gap-3 m-5 ">
              <CloudUpload size={44} color="#000000" className="mt-10" />
            </div>
            <button className="flex flex-col self-center justify-self-center bg-blue-500 text-white p-2 rounded-2xl w-30 h-10 m-7 active:scale-90">
              upload File
            </button>
          </div>
        </div>
        {/* Right side */}
        <div className="bg-white h-75 rounded-2xl w-1/2 p-5">
          <h1 className="text-2xl">Record Audio</h1>
          <button className="flex self-center justify-self-center mt-18 bg-gray-200 rounded-4xl h-15 w-15 p-2 active:scale-90">
            <Mic size={44} color="#f10404" />
          </button>
        </div>
      </div>
      {/* Bottom container*/}
      <div className="m-10 p-5 gap-4 bg-white ml-20 h-70 ">
        <h1 className="text-3xl">Transcriptions</h1>
        <div></div>
      </div>
    </div>
  );
}

export default App