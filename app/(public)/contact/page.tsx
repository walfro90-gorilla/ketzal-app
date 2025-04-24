"use client"

import { Form, Input, Button, message } from "antd"
import { MailOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons"
import Footer from "@/components/Footer"

const { TextArea } = Input

export default function ContactPage() {
    const [form] = Form.useForm()

    const onFinish = (values: any) => {
        message.success("¡Mensaje enviado correctamente!")
        form.resetFields()
    }

    return (
        <>
            <div className="container mx-auto py-12 px-4 flex flex-col md:flex-row gap-12">
                {/* Contact Form */}
                <div className="w-full md:w-1/2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-6 text-green-700 dark:text-green-400">Contáctanos</h2>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                        className="[&_.ant-form-item-label>label]:text-gray-900 [&_.ant-form-item-label>label]:dark:text-gray-100 [&_.ant-input]:bg-white [&_.ant-input]:dark:bg-zinc-700 [&_.ant-input]:text-gray-900 [&_.ant-input]:dark:text-gray-100 [&_.ant-input]:border-gray-300 [&_.ant-input]:dark:border-zinc-700 [&_.ant-input]:placeholder-gray-400 [&_.ant-input]:dark:placeholder-gray-400 [&_.ant-input-affix-wrapper]:bg-white [&_.ant-input-affix-wrapper]:dark:bg-zinc-700 [&_.ant-input-affix-wrapper]:border-gray-300 [&_.ant-input-affix-wrapper]:dark:border-zinc-700"
                    >
                        <Form.Item
                            name="name"
                            label="Nombre"
                            rules={[{ required: true, message: "Por favor ingresa tu nombre" }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Tu nombre" size="large" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Correo electrónico"
                            rules={[
                                { required: true, message: "Por favor ingresa tu correo" },
                                { type: "email", message: "Correo no válido" },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Tu correo" size="large" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Teléfono"
                            rules={[{ required: true, message: "Por favor ingresa tu teléfono" }]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="Tu teléfono" size="large" />
                        </Form.Item>
                        <Form.Item
                            name="message"
                            label="Mensaje"
                            rules={[{ required: true, message: "Por favor ingresa tu mensaje" }]}
                        >
                            <TextArea rows={4} placeholder="¿En qué podemos ayudarte?" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" className="bg-green-600 hover:bg-green-700 w-full">
                                Enviar mensaje
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* Social Media Section */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-400">Síguenos en redes sociales</h3>
                        <div className="flex gap-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-2xl">
                                <i className="fab fa-facebook-square" />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200 text-2xl">
                                <i className="fab fa-twitter-square" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 text-2xl">
                                <i className="fab fa-instagram" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-2xl">
                                <i className="fab fa-youtube-square" />
                                <span className="sr-only">YouTube</span>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-2xl">
                                <i className="fab fa-linkedin" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                </div>
                {/* Contact Information Section */}
                <div className="w-full md:w-1/2 h-[400px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
                    <div className="text-center text-gray-500 dark:text-gray-300">
                        <p className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-100">Encuéntranos en:</p>
                        <p className="text-md text-gray-700 dark:text-gray-100">Ciudad Juarez, Chihuahua</p>
                        <p className="text-md mt-2 text-gray-700 dark:text-gray-100">contacto@ketzal.app</p>
                        <p className="text-md text-gray-700 dark:text-gray-100">+52 656 112 1142</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
