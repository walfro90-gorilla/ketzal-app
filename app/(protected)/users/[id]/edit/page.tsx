"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Form, Input, Select, Button, message, Avatar, Upload } from 'antd';
import { UserOutlined, ArrowLeftOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { getUser, updateUser, type User } from '@/app/(protected)/users/users.api';
import { getSuppliers } from '@/app/(protected)/suppliers/suppliers.api';
import Link from 'next/link';

const { Option } = Select;

interface Supplier {
    id: number;
    name: string;
    contactEmail: string;
}

export default function UserEditPage() {
    const params = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const router = useRouter();    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                if (params?.id) {
                    const [userData, suppliersData] = await Promise.all([
                        getUser(params.id as string),
                        getSuppliers()
                    ]);
                    
                    setUser(userData);
                    setSuppliers(suppliersData);
                    
                    // Rellenar el formulario
                    form.setFieldsValue({
                        name: userData.name || '',
                        email: userData.email || '',
                        role: userData.role || 'user',
                        supplierId: userData.supplierId || undefined,
                    });
                }
            } catch (error) {
                message.error('Error al cargar datos del usuario');
                console.error('Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params?.id) {
            loadData();
        }
    }, [params?.id, form]);    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            
            if (!params?.id) {
                message.error('ID de usuario no válido');
                return;
            }
            
            const updateData = {
                name: values.name,
                email: values.email,
                role: values.role,
                supplierId: values.supplierId || null,
            };

            await updateUser(params.id as string, updateData);
            message.success('Usuario actualizado correctamente');
            router.push(`/users/${params.id}`);
        } catch (error) {
            message.error('Error al actualizar usuario');
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Cargando...</div>;
    }

    return (
        <Card className="dark:bg-neutral-900">            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <Link href={`/users/${params?.id || ''}`}>
                        <Button icon={<ArrowLeftOutlined />} type="text">
                            Volver a detalles
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold dark:text-white text-black">
                        Editar Usuario
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar */}
                <Card className="text-center">
                    <div className="flex flex-col items-center space-y-4">
                        {user.image ? (
                            <Avatar 
                                size={120} 
                                src={user.image} 
                                alt={user.name || 'Usuario'} 
                            />
                        ) : (
                            <Avatar 
                                size={120} 
                                icon={<UserOutlined />} 
                                className="bg-blue-100 text-blue-600"
                            />
                        )}
                        <Upload
                            name="avatar"
                            listType="text"
                            showUploadList={false}
                            beforeUpload={() => false} // Prevenir upload automático
                        >
                            <Button icon={<UploadOutlined />}>
                                Cambiar Avatar
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
                                    Guardar Cambios
                                </Button>
                                <Link href={`/users/${params?.id || ''}`}>
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
