import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: "dgmmzh8nb",
  api_key: "766325626977677",
  api_secret: "g0qgbgJNL8rsG2Ng4X9rP6oxpow",
});

const MAX_SIZE = 3 * 1024 * 1024; // 3 MB en bytes

export async function POST(request) {
  try {
    const data = await request.formData();
    const image = data.get("image");

    if (!image) {
      return NextResponse.json(
        { error: "No se subió ninguna imagen." },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verificar el tamaño del archivo
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo excede el límite de 3 MB." },
        { status: 400 }
      );
    }

    // Subir a Cloudinary
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({
      url: response.secure_url,
      name: response.original_filename,
      size: response.bytes,
      message: "Imagen subida exitosamente",
    });
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la imagen." },
      { status: 500 }
    );
  }
}
