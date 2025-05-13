"use client"
import { useSuppliers } from "@/context/SupplierContext"

export default function Users() {

  useSuppliers()
  // console.log("Supplier context:", idSuppliers)

  return (
    <div>
      <h1>Users</h1>

    </div>
  )
}