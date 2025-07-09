import { NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";

// Helper para agregar headers CORS a todas las respuestas
function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export async function OPTIONS() {
  // Responder al preflight CORS
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST(request: Request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return withCors(
        NextResponse.json(
          { error: "No se proporcionó public_id." },
          { status: 400 }
        )
      );
    }

    // Eliminar imagen usando la función del servidor
    await deleteFromCloudinary(publicId);

    return withCors(
      NextResponse.json({
        success: true,
        message: "Imagen eliminada exitosamente",
      })
    );
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    return withCors(
      NextResponse.json(
        { error: "Error interno al eliminar la imagen." },
        { status: 500 }
      )
    );
  }
}
