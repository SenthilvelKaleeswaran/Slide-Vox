
import { useState } from 'react'

export default function PopupViewer() {
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <div className="p-4 w-80 bg-red-500 shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Slide Vox</h1>
        <span className="text-sm text-gray-500">v1.0</span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Transform your chats into engaging presentations with 3D speaking characters.
      </p>

      <div className="space-y-3">
        <button
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={() => setIsProcessing(true)}
          disabled={isProcessing}
        >
          {isProcessing ? 'Converting...' : 'Convert to Slides'}
        </button>

        <div className="flex justify-between text-sm">
          <button className="text-gray-600 hover:text-gray-800">
            Settings
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            View Tutorial
          </button>
        </div>
      </div>

      {isProcessing && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            Creating your presentation with AI-powered animations...
          </p>
        </div>
      )}
    </div>
  )
}
