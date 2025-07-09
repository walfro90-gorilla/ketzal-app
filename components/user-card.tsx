import { Card, Tag, Button, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import type { User } from '@/app/(protected)/users/users.api';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserCardProps {
    user: User;
    onDelete: (id: string) => void;
}

export function UserCard({ user, onDelete }: UserCardProps) {
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'red';
            case 'admin':
                return 'blue';
            case 'user':
                return 'green';
            default:
                return 'default';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'Super Admin';
            case 'admin':
                return 'Admin';
            case 'user':
                return 'Usuario';
            default:
                return role;
        }
    };

    return (
        <Card 
            className="w-full"
            actions={[
                <Tooltip key="view" title="Ver detalles">
                    <Link href={`/users/${user.id}`}>
                        <Button type="text" icon={<EyeOutlined />} />
                    </Link>
                </Tooltip>,
                <Tooltip key="edit" title="Editar">
                    <Link href={`/users/${user.id}/edit`}>
                        <Button type="text" icon={<EditOutlined />} />
                    </Link>
                </Tooltip>,
                <Popconfirm
                    key="delete"
                    title="¿Estás seguro de eliminar este usuario?"
                    description="Esta acción no se puede deshacer."
                    onConfirm={() => onDelete(user.id)}
                    okText="Sí"
                    cancelText="No"
                >
                    <Tooltip title="Eliminar">
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                </Popconfirm>
            ]}
        >
            <Card.Meta
                avatar={
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {user.image ? (
                            <img 
                                src={user.image} 
                                alt={user.name || 'Usuario'} 
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <UserOutlined className="text-blue-600 text-xl" />
                        )}
                    </div>
                }
                title={
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                            {user.name || 'Sin nombre'}
                        </span>
                        <Tag color={getRoleColor(user.role)}>
                            {getRoleLabel(user.role)}
                        </Tag>
                    </div>
                }
                description={
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            <strong>Email:</strong> {user.email}
                        </div>
                        {user.supplier && (
                            <div className="text-sm text-gray-600">
                                <strong>Proveedor:</strong> {user.supplier.name}
                            </div>
                        )}
                        <div className="text-xs text-gray-500">
                            <strong>Creado:</strong> {format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </div>
                        {user.emailVerified ? (
                            <Tag color="green">Email Verificado</Tag>
                        ) : (
                            <Tag color="orange">Email Pendiente</Tag>
                        )}
                    </div>
                }
            />
        </Card>
    );
}

export type { User };
