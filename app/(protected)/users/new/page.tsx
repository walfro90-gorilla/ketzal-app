"use client"

import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, message, Avatar, Upload } from 'antd';
import { UserOutlined, ArrowLeftOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { createUser } from '@/app/(protected)/users/users.api';
import { getSuppliers } from '@/app/(protected)/suppliers/suppliers.api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Option } = Select;

interface Supplier {
    id: number;
    name: string;
    contactEmail: string;
}

export default function NewUserPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const router = useRouter();

    // Cargar proveedores
    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                const suppliersData = await getSuppliers();
                setSuppliers(suppliersData);
            } catch (error) {
                message.error('Error al cargar proveedores');
                console.error('Error loading suppliers:', error);
            }
        };

        loadSuppliers();
    }, []);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            
            const userData = {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role,
                supplierId: values.supplierId || null,
            };

            const newUser = await createUser(userData);
            message.success('Usuario creado correctamente');
            router.push(`/users/${newUser.id}`);
        } catch (error: any) {
            message.error(error.message || 'Error al crear usuario');
            console.error('Error creating user:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="dark:bg-neutral-900">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <Link href="/users">
                        <Button icon={<ArrowLeftOutlined />} type="text">
                            Volver a usuarios
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold dark:text-white text-black">
                        Crear Nuevo Usuario
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar */}
                <Card className="text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar 
                            size={120} 
                            icon={<UserOutlined />} 
                            className="bg-blue-100 text-blue-600"
                        />
                        <Upload
                            name="avatar"
                            listType="text"
                            showUploadList={false}
                            beforeUpload={() => false} // Prevenir upload automático
                        >
                            <Button icon={<UploadOutlined />}>
                                Subir Avatar
                            </Button>
                        </Upload>
                    </div>
                </Card>

                {/* Formulario */}
                <Card title="Información del Usuario" className="lg:col-span-2">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        disabled={loading}
                        initialValues={{
                            role: 'user'
                        }}
                    >
                        <Form.Item
                            name="name"
                            label="Nombre"
                            rules={[
                                { required: true, message: 'Por favor ingresa el nombre' }
                            ]}
                        >
                            <Input placeholder="Nombre del usuario" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Por favor ingresa el email' },
                                { type: 'email', message: 'Por favor ingresa un email válido' }
                            ]}
                        >
                            <Input placeholder="email@ejemplo.com" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Contraseña"
                            rules={[
                                { required: true, message: 'Por favor ingresa la contraseña' },
                                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                            ]}
                        >
                            <Input.Password placeholder="Contraseña" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirmar Contraseña"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Por favor confirma la contraseña' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Las contraseñas no coinciden'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirmar contraseña" />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Rol"
                            rules={[
                                { required: true, message: 'Por favor selecciona un rol' }
                            ]}
                        >
                            <Select placeholder="Selecciona un rol">
                                <Option value="user">Usuario</Option>
                                <Option value="admin">Admin</Option>
                                <Option value="superadmin">Super Admin</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="supplierId"
                            label="Proveedor Asociado"
                        >
                            <Select 
                                placeholder="Selecciona un proveedor (opcional)"
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.children as unknown as string)
                                        ?.toLowerCase()
                                        ?.includes(input.toLowerCase())
                                }
                            >
                                {suppliers.map((supplier) => (
                                    <Option key={supplier.id} value={supplier.id}>
                                        {supplier.name} ({supplier.contactEmail})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <div className="flex space-x-4">
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                >
                                    Crear Usuario
                                </Button>
                                <Link href="/users">
                                    <Button>
                                        Cancelar
                                    </Button>
                                </Link>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Card>
    );
}
