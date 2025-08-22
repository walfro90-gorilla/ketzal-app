"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
}

export function ImageUploader({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
}: ImageUploaderProps) {
  const { showToast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState<
    { file: File; progress: number; error?: string }[]
  >([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ errors }) => {
          errors.forEach((error: any) => {
            showToast({
              title: "Error de archivo",
              description: error.message,
              variant: "destructive",
            });
          });
        });
        return;
      }

      if (value.length + acceptedFiles.length > maxFiles) {
        showToast({
          title: "Límite de archivos excedido",
          description: `Puedes subir un máximo de ${maxFiles} imágenes.`,
          variant: "destructive",
        });
        return;
      }

      const newFiles = acceptedFiles.map(file => ({ file, progress: 0 }));
      setUploadingFiles(prev => [...prev, ...newFiles]);

      for (const { file } of newFiles) {
        try {
          const formData = new FormData();
          formData.append("image", file);

          const xhr = new XMLHttpRequest();
          xhr.open("POST", "http://localhost:3000/api/upload", true);

          xhr.upload.onprogress = e => {
            if (e.lengthComputable) {
              const progress = (e.loaded / e.total) * 100;
              setUploadingFiles(prev =>
                prev.map(f => (f.file === file ? { ...f, progress } : f))
              );
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              onChange([...value, data.url]);
              setUploadingFiles(prev => prev.filter(f => f.file !== file));
            } else {
              throw new Error("Error en la subida");
            }
          };

          xhr.onerror = () => {
            throw new Error("Error de red");
          };

          xhr.send(formData);
        } catch (error) {
          setUploadingFiles(prev =>
            prev.map(f =>
              f.file === file ? { ...f, error: "Error al subir" } : f
            )
          );
        }
      }
    },
    [value, maxFiles, maxSize, onChange, showToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxSize,
    maxFiles,
  });

  const removeImage = (url: string) => {
    onChange(value.filter(u => u !== url));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <UploadCloud className="h-10 w-10" />
          {isDragActive ? (
            <p>Suelta las imágenes aquí...</p>
          ) : (
            <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionar</p>
          )}
          <p className="text-xs">
            Máximo {maxFiles} archivos, hasta {maxSize / 1024 / 1024}MB cada uno
          </p>
        </div>
      </div>

      {(value.length > 0 || uploadingFiles.length > 0) && (
        <div className="mt-4 space-y-2">
          {value.map(url => (
            <Card key={url} className="p-2">
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={url}
                    alt="preview"
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <span className="text-sm truncate">{url.split("/").pop()}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImage(url)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {uploadingFiles.map(({ file, progress, error }) => (
            <Card key={file.name} className="p-2">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  {error && <span className="text-sm text-destructive">{error}</span>}
                </div>
                <Progress value={progress} className="mt-2 h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
