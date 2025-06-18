"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { useForm } from "react-hook-form"

import { createSupplier, updateSupplier, searchSuppliers } from "@/app/(protected)/suppliers/suppliers.api"
import { useParams, useRouter } from "next/navigation"
import { useDialog } from "@/components/dialog-supplier"
import { updateIdSupplier } from "@/actions/user-action"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useAlertDialog } from "@/components/alert-dialog"
import { useState } from "react"
import { Avatar, Space, Upload } from "antd"

import { UserOutlined } from '@ant-design/icons';
import ImgCrop from "antd-img-crop"

interface Supplier {
    name?: string;
    description?: string;
    contactEmail?: string;
    phoneNumber?: string;
    address?: string;
    id?: string;
    imgLogo?: string | null;
}

export function SupplierFormUser({ supplier }: { supplier: Supplier }) {

    const [imgUrl, setImgUrl] = useState<string | null>(null);

    const { data: session } = useSession();
    const user = session?.user;
    
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: supplier?.name,
            description: supplier?.description,
            contactEmail: supplier?.contactEmail,
            phoneNumber: supplier?.phoneNumber,
            address: supplier?.address,
            id: supplier?.id,
            imgLogo: imgUrl || supplier?.imgLogo,
        }
    })

    const router = useRouter()
    const params = useParams<{ id: string }>()
    const { setIsOpen } = useDialog()
    const { showDialog } = useAlertDialog()





    // SUBMIT FORM
    const onSubmit = handleSubmit(async (data) => {

        // Fix: use a local variable instead of assigning to a constant
        const confirmed = await showDialog({
            title: "Confirma tu Seleccion ✅",
            message1: "Estas completamente segur@ en pertenecer a este Team? ",
            message2: "Recuerda que no podras cambiar de Team hasta que termine la temporada.⚠️ AL ACTUALIZAR TU EQUIPO SE CERRARA TU SESION ⚠️",
            confirmText: "Yes",
            cancelText: "No",
        });

        if (!confirmed) {
            return;
        }        if (params?.id) {
            await updateSupplier(params.id, data);
        } else {            console.log("DATA:", data);
            console.log("Current user from session:", user);
            
            try {
                // Check if supplier with same name or email already exists
                const existingByName = await searchSuppliers(data.name);
                const existingByEmail = await searchSuppliers(undefined, data.contactEmail);
                
                console.log('Search by name result:', existingByName);
                console.log('Search by email result:', existingByEmail);
                
                if (existingByName && existingByName.length > 0) {
                    console.error(`Ya existe un proveedor con el nombre "${data.name}"`);
                    alert(`Ya existe un proveedor con el nombre "${data.name}"`);
                    return;
                }
                
                if (existingByEmail && existingByEmail.length > 0) {
                    console.error(`Ya existe un proveedor con el email "${data.contactEmail}"`);
                    alert(`Ya existe un proveedor con el email "${data.contactEmail}"`);
                    return;
                }

                // Remove undefined fields before sending to backend
                const cleanData = {
                    name: data.name,
                    description: data.description,
                    contactEmail: data.contactEmail,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    imgLogo: data.imgLogo
                };                console.log('Clean data being sent:', cleanData);
                const dataUpdate = await createSupplier(cleanData);
                
                if (user && dataUpdate && dataUpdate.id) {
                    // Format user data for the updateIdSupplier function
                    const userForUpdate = {
                        id: user.id
                    };
                    
                    await updateIdSupplier({ id: dataUpdate.id.toString() }, userForUpdate);
                    console.log('✅ Supplier created and user updated successfully');
                } else if (!user) {
                    console.error("User is null. Cannot update supplier ID.");
                    alert("Error: Usuario no autenticado. No se puede asignar el proveedor.");
                    return;
                } else {
                    console.error("Supplier creation failed or missing id.");
                    alert("Error: No se pudo crear el proveedor.");
                    return;
                }} catch (error) {
                console.error("Error creating supplier:", error);
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                alert(`Error al crear el proveedor: ${errorMessage}`);
                return;
            }
            await signOut({
                callbackUrl: '/login'
            });
        }

        setIsOpen(false);
        router.refresh();
    });


    // UPLOAD image to cloudinary
    const onUpload = async (file: File) => {

        const formData = new FormData();
        formData.append("image", file as Blob);

        // const response = await fetch("https://ketzal-app.vercel.app/api/upload",
        const response = await fetch("http://localhost:3000/api/upload",
            {
                method: "POST",
                body: formData,
            })

        const dataImage = await response.json();
        setImgUrl(dataImage.url)
        setValue("imgLogo", dataImage.url)

        console.log("dataImage:", dataImage)
        console.log("Supplier", supplier)
    }





    return (
        <form onSubmit={onSubmit}>

            <Space direction="vertical" size={12}>

                <Label>Team Name</Label>
                <Input {...register("name")} />
                <Label>Description:</Label>
                <Input {...register("description")} />
                <Label>Contact Email:</Label>
                <Input {...register("contactEmail")} />
                <Label>Phone Number:</Label>
                <Input {...register("phoneNumber")} />
                <Label>Address:</Label>
                <Input {...register("address")} />

                <Space wrap size={16}>

                    <Label>Logo(250x250 px):</Label>

                    <Avatar src={imgUrl} shape="square" size={64} icon={<UserOutlined />} />

                    <ImgCrop aspect={1}>
                        <Upload
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                onUpload(file);
                                return false;
                            }}
                        >
                            {imgUrl ? <img src={imgUrl} alt="avatar" style={{ width: '100%' }} /> : 'Upload'}
                        </Upload>
                    </ImgCrop>

                    <input id="logoUrl" {...register("imgLogo")} hidden />
                </Space>
                <Button>
                    {params?.id ? "Update supplier" : "Create supplier"}
                </Button>
            </Space>
        </form>
    )
}