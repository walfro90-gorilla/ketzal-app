"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getUser, type User } from '@/app/(protected)/users/users.api';
import { Card, Descriptions, Tag, Avatar, Button, Spin, Alert } from 'antd';
import { UserOutlined, EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function UserDetailPage() {
    const params = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                setError(null);
                if (params?.id) {
                    const userData = await getUser(params.id as string);
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error loading user:', error);
                setError('Error al cargar la información del usuario');
            } finally {
                setLoading(false);
            }
        };

        if (params?.id) {
            loadUser();
        }
    }, [params?.id]);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'superadmin': return 'red';
            case 'admin': return 'blue';
            case 'user': return 'green';
            default: return 'default';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'superadmin': return 'Super Admin';
            case 'admin': return 'Admin';
            case 'user': return 'Usuario';
            default: return role;
        }
    };

    const formatDate = (date: Date | string | null) => {
        if (!date) return 'No especificado';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) return 'Fecha inválida';
            return dateObj.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Error en fecha';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spin size="large" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <Alert
                message="Error"
                description={error || 'Usuario no encontrado'}
                type="error"
                showIcon
                action={
                    <Link href="/users">
                        <Button type="primary">Volver a usuarios</Button>
                    </Link>
                }
            />
        );
    }

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
                        Detalles del Usuario
                    </h1>
                </div>
                <Link href={`/users/${user.id}/edit`}>
                    <Button type="primary" icon={<EditOutlined />}>
                        Editar Usuario
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar y información básica */}
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
                        <div>
                            <h2 className="text-xl font-semibold">
                                {user.name || 'Sin nombre'}
                            </h2>
                            <p className="text-gray-600">{user.email}</p>
                            <Tag color={getRoleColor(user.role)} className="mt-2">
                                {getRoleLabel(user.role)}
                            </Tag>
                        </div>
                    </div>
                </Card>

                {/* Información detallada */}
                <Card title="Información Personal" className="lg:col-span-2">
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="ID">
                            {user.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nombre">
                            {user.name || 'No especificado'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {user.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Estado del Email">
                            {user.emailVerified ? (
                                <Tag color="green">
                                    Verificado el {formatDate(user.emailVerified)}
                                </Tag>
                            ) : (
                                <Tag color="orange">Pendiente de verificación</Tag>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Rol">
                            <Tag color={getRoleColor(user.role)}>
                                {getRoleLabel(user.role)}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Proveedor Asociado">
                            {user.supplier ? (
                                <div>
                                    <div><strong>Nombre:</strong> {user.supplier.name}</div>
                                    <div><strong>Email:</strong> {user.supplier.contactEmail}</div>
                                    <div><strong>ID:</strong> {user.supplier.id}</div>
                                </div>
                            ) : (
                                <Tag color="default">Sin proveedor asociado</Tag>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Fecha de Creación">
                            {formatDate(user.createdAt)}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </Card>
    );
}
