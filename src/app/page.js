'use client'

import { Copy, LoaderCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiEndpoint, setapiEndpoint] = useState(false)

  useEffect(() => {
    setapiEndpoint(`${process.env.NEXT_PUBLIC_APP_DOMAIN}api/pptr?url=`);
  }, []);
  async function fetchPageStatus() {
    if (url === "") {
      alert("Enter valid url")
      return
    }
    setStatus('')
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_DOMAIN}api/pptr?url=${url}`);
      const data = await response.json();
      const { is200 } = data;
      setStatus(is200 ? 200 : 404)
      return
    } catch (error) {
      console.error("Error fetching page status:", error);
      return null;
    }
    finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-4 py-8">

      <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
        openPuppeteer
      </h1>
      <p className="text-xl text-center mb-8 text-gray-600">
        Free Puppeteer as a Service
      </p>

      <div className="w-full max-w-2xl">
        <div className=' mb-3'>
          <div className='text-black  font-semibold text-2xl'>Get Started</div>
          <div className='text-black/40 '>Enter a URL to check its status or use our API</div>
        </div>
        <div className="space-y-8">
          <div className="flex space-x-2 relative">
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow border rounded-md p-4 text-black"
            />
            <div className={` text-black  absolute right-[134px] top-0 bottom-0 bg-gray-100 my-3 rounded p-2 flex justify-center items-center ${status === "" && 'hidden'}`} >
              {status}
            </div>
            <button
              disabled={isLoading}
              onClick={() => {
                fetchPageStatus()
              }}
              className="whitespace-nowrap bg-black/70 hover:bg-black transition-all p-3 rounded-md">
              {
                isLoading ? <div className=' animate-spin '>

                  <LoaderCircle color='white' />
                </div> : 'Check Status'
              }
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-2 overflow-x-auto">
            <span className="text-green-600 font-semibold">GET</span>
            <code className="text-sm flex-grow text-black">{apiEndpoint}</code>
            <Copy
              onClick={() => {
                navigator.clipboard.writeText(apiEndpoint)
                alert("Copied")
              }}
              className=' cursor-pointer'
              color='black' />
          </div>
        </div>
      </div>
    </div >
  )
}