import React from 'react'

const Loader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="text-green-700 font-semibold text-lg">Cargando...</span>
    </div>
  </div>
)

export default Loader
