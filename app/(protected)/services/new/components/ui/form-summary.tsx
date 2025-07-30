"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { FormSummary } from "../../types/service-form.types"

interface FormSummaryProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  summary: FormSummary
}

export function FormSummary({ isOpen, onClose, onConfirm, summary }: FormSummaryProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resumen del Servicio</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Nombre:</span>
                <span>{summary.name || 'No especificado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Precio:</span>
                <span className="font-semibold text-green-600">
                  ${summary.price?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Proveedor:</span>
                <span>{summary.supplier || 'No especificado'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fechas de Disponibilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Disponible desde:</span>
                <span>
                  {summary.availableFrom 
                    ? format(summary.availableFrom, "PPP", { locale: es })
                    : 'No especificado'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Disponible hasta:</span>
                <span>
                  {summary.availableTo 
                    ? format(summary.availableTo, "PPP", { locale: es })
                    : 'No especificado'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Imágenes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Imágenes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Imagen principal:</span>
                <Badge variant={summary.imgBanner ? "default" : "secondary"}>
                  {summary.imgBanner ? "Subida" : "No subida"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Imágenes en galería:</span>
                <Badge variant="outline">
                  {summary.imgAlbumCount || 0} imágenes
                </Badge>
              </div>
              {summary.imgBanner && (
                <div className="mt-3">
                  <img 
                    src={summary.imgBanner} 
                    alt="Banner del servicio" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advertencias */}
          {(!summary.name || !summary.price || !summary.imgBanner) && (
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <span className="text-sm font-medium">⚠️ Campos requeridos faltantes:</span>
                </div>
                <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  {!summary.name && <li>• Nombre del servicio</li>}
                  {!summary.price && <li>• Precio del servicio</li>}
                  {!summary.imgBanner && <li>• Imagen principal</li>}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={!summary.name || !summary.price || !summary.imgBanner}
          >
            Confirmar y Crear Servicio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 