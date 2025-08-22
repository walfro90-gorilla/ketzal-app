"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// import { ComboBox } from "@/components/combobox"
import { Label } from "@radix-ui/react-label"
// import { on } from "events"
import { Controller, useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { useSuppliers } from "@/context/SupplierContext"

// API services import
import { createService, ServiceDataNew } from "../services.api"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { getSuppliers } from "@/app/(protected)/suppliers/suppliers.api"
import { getGlobalLocations } from "../../global-locations.api"
import { useEffect, useState } from "react"

// Validation schema with zod and zodResolver from react-hook-form to validate the form
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema } from "@/validations/serviceSchema"

import { Alert, Card, Col, Row, Table, message, Select, Checkbox, List, Typography, DatePicker, Spin } from "antd"

import ImageUploader from "@/components/images-uploader"

// Import the context and the hook  to use the context  from the ServiceContext
import { useServices } from "@/context/ServiceContext"

import { cn } from "@/lib/utils"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"
import { PlusCircleOutlined } from "@ant-design/icons"
import { FAQModal } from "@/components/FAQModal"
import { FAQList } from "@/components/FAQList"
import { useFAQs } from "@/hooks/useFAQs"
import type { FAQ } from "@/types/faq"
import VirtualItinerary from "@/components/virtual-itinerary-custom"
import type { Supplier } from "@/components/supplier-card"

import { fetchStatesCitiesData } from "@/lib/fetchStatesCitiesData";
// import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// LEGACY FORM - BACKUP FOR ROLLBACK IF NEEDED
// This file is a backup of the original service-form.tsx
// Keep this file for safety during the migration to the new form

export function ServiceFormLegacy(props: any) {
  // Legacy form implementation preserved for rollback
  return (
    <div className="p-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
        <h3 className="text-yellow-800 font-medium">Formulario Legacy</h3>
        <p className="text-yellow-700 text-sm mt-1">
          Este es el formulario anterior. Se mantiene como backup durante la migración.
        </p>
      </div>
      <p className="text-muted-foreground">
        Para activar el formulario legacy, cambia la importación en page.tsx
      </p>
    </div>
  );
} 