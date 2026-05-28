
const TranscriptionCard = (  
  {
  transcription,
}: {
  transcription: Transcription;
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          Audio Log
        </span>
        <span className="text-xs text-gray-400">{transcription.timestamp}</span>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">
        {transcription.text}
      </p>
    </div>
  );
};
export default TranscriptionCard;