import Header from "@/components/header"
import { Navbar } from "@/components/navbar"

// Code: Home Page
async function HomePage() {


  return (
    <>
      <Header/>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Traveling Basics</h1>
        <p className="mb-4">Welcome to the Traveling Basics page. Here you will find essential information to make your travel experience smooth and enjoyable.</p>
        <ul className="list-disc pl-5">
          <li className="mb-2">Pack light and smart.</li>
          <li className="mb-2">Keep your documents safe.</li>
          <li className="mb-2">Stay aware of your surroundings.</li>
          <li className="mb-2">Learn basic phrases of the local language.</li>
          <li className="mb-2">Respect local customs and traditions.</li>
        </ul>
      </div>


    </>
  )
}

export default HomePage