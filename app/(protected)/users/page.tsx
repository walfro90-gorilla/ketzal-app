"use client"

import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Popconfirm, message, Card } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getUsers, deleteUser, searchUsers, type User } from './users.api';
import Link from 'next/link';

const { Search } = Input;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      message.error('Error al cargar usuarios');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar usuarios
  const handleSearch = async (value: string) => {
    try {
      setLoading(true);
      setSearchText(value);
      
      if (value.trim()) {
        const data = await searchUsers(value, value); // Buscar en nombre y email
        setUsers(data);
      } else {
        await loadUsers();
      }
    } catch (error) {
      message.error('Error al buscar usuarios');
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success('Usuario eliminado correctamente');
      await loadUsers();
    } catch (error) {
      message.error('Error al eliminar usuario');
      console.error('Error deleting user:', error);
    }
  };

  // Configuración de columnas
  const columns: ColumnsType<User> = [
    {
      title: 'Avatar',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image: string, record: User) => (
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          {image ? (
            <img 
              src={image} 
              alt={record.name || 'Usuario'} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <UserOutlined className="text-blue-600" />
          )}
        </div>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
      render: (name: string) => name || 'Sin nombre',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar nombre"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
            >
              Buscar
            </Button>
            <Button
              onClick={() => clearFilters && clearFilters()}
              size="small"
            >
              Limpiar
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        (record.name || '').toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Super Admin', value: 'superadmin' },
        { text: 'Admin', value: 'admin' },
        { text: 'Usuario', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role: string) => {
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

        return (
          <Tag color={getRoleColor(role)}>
            {getRoleLabel(role)}
          </Tag>
        );
      },
    },
    {
      title: 'Proveedor',
      dataIndex: ['supplier', 'name'],
      key: 'supplier',
      render: (supplierName: string, record: User) => 
        record.supplier ? supplierName : <Tag color="default">Sin proveedor</Tag>,
    },
    {
      title: 'Estado Email',
      dataIndex: 'emailVerified',
      key: 'emailVerified',
      filters: [
        { text: 'Verificado', value: 'verified' },
        { text: 'Pendiente', value: 'pending' },
      ],
      onFilter: (value, record) => 
        value === 'verified' ? !!record.emailVerified : !record.emailVerified,
      render: (emailVerified: Date | null) => 
        emailVerified ? (
          <Tag color="green">Verificado</Tag>
        ) : (
          <Tag color="orange">Pendiente</Tag>
        ),
    },    {
      title: 'Fecha Creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createdAt: Date | string) => {
        try {
          const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
          if (isNaN(date.getTime())) return 'Fecha inválida';
          return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch (error) {
          return 'Error en fecha';
        }
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Link href={`/users/${record.id}`}>
            <Button type="text" icon={<EyeOutlined />} title="Ver" />
          </Link>
          <Link href={`/users/${record.id}/edit`}>
            <Button type="text" icon={<EditOutlined />} title="Editar" />
          </Link>
          <Popconfirm
            title="¿Estás seguro de eliminar este usuario?"
            description="Esta acción no se puede deshacer."
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="Eliminar" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Card className="dark:bg-neutral-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold dark:text-white text-black">Usuarios</h1>
        <Link href="/users/new">
          <Button type="primary" icon={<PlusOutlined />}>
            + Usuario
          </Button>
        </Link>
      </div>
      
      <div className="mb-4">
        <Search
          placeholder="Buscar por nombre o email"
          allowClear
          enterButton="Buscar"
          size="large"
          onSearch={handleSearch}
          onChange={(e) => {
            if (!e.target.value) {
              setSearchText('');
              loadUsers();
            }
          }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          total: users.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} usuarios`,
        }}
        scroll={{ x: 1200 }}
        className="dark:bg-neutral-800"
      />
    </Card>
  );
}