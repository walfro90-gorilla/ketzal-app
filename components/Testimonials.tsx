import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  { name: 'María González', image: 'https://picsum.photos/1200/1300', text: 'Increíble experiencia en Cancún. El servicio fue excelente y las playas son hermosas.' },
  { name: 'Juan Pérez', image: 'https://picsum.photos/1200/1300', text: 'El tour por la Ciudad de México superó mis expectativas. Muy recomendado.' },
  { name: 'Ana Rodríguez', image: 'https://picsum.photos/1200/1300', text: 'La escapada a Guanajuato fue mágica. Definitivamente volveré a reservar con ustedes.' },
]

const Testimonials = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <h3 className="ml-4 text-lg font-semibold">{testimonial.name}</h3>
                </div>
                <p className="text-gray-600">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

