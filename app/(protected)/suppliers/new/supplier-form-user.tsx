"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"

import { useForm, FieldError } from "react-hook-form"

import { createSupplier, updateSupplier } from "@/app/(protected)/suppliers/suppliers.api"
import { useParams, useRouter } from "next/navigation"
import { useDialog } from "@/components/dialog-supplier"
import { updateIdSupplier } from "@/actions/user-action"
import { useUser } from "@/context/UserContext"
import { signOut } from "next-auth/react"
import { useAlertDialog } from "@/components/alert-dialog"
import { useState } from "react"
import { Alert, Avatar, Space } from "antd"

import { UserOutlined } from '@ant-design/icons';

import { zodResolver } from "@hookform/resolvers/zod"
import { mappedTypes, supplierSchema } from "@/validations/supplierSchema"


export function SupplierFormUser({ supplier }: any) {

    const [file, setFile] = useState<File | null>(null);
    const [imgUrl, setImgUrl] = useState<string | null>(null);


    const { user } = useUser()
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: supplier?.name,
            description: supplier?.description,
            contactEmail: supplier?.contactEmail,
            phoneNumber: supplier?.phoneNumber,
            address: supplier?.address,
            id: supplier?.id,
            imgLogo: imgUrl || supplier?.imgLogo,
            type: supplier?.type,
        },
        resolver: zodResolver(supplierSchema)
    })

    const router = useRouter()
    const params = useParams<{ id: string }>()
    const { setIsOpen } = useDialog()
    const { showDialog } = useAlertDialog()





    // SUBMIT FORM
    const onSubmit = handleSubmit(async (data) => {

        const confirmed = await showDialog({
            title: "Confirma tu Seleccion ✅",
            message1: "Estas completamente segur@ en pertenecer a este Team? ",
            message2: "Recuerda que no podras cambiar de Team hasta que termine la temporada.⚠️ AL ACTUALIZAR TU EQUIPO SE CERRARA TU SESION ⚠️",
            confirmText: "Yes",
            cancelText: "No",
        });

        if (!confirmed) {
            return;
        }

        if (params?.id) {
            await updateSupplier(params.id, data);
        } else {
            console.log("DATA:", data)

            const dataUpdate = await createSupplier(data);
            await updateIdSupplier(dataUpdate, user);
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

        const response = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            body: formData,
        })

        const dataImage = await response.json();
        setImgUrl(dataImage.url)
        setValue("imgLogo", dataImage.url)

        console.log("dataImage:", dataImage)
        console.log("Supplier", supplier)
    }

    const typesOptions = Object.entries(mappedTypes).map(([key, value]) => (
        <option key={key} value={key}>{value}</option>
    ))


    console.log("ERRORS:", errors)



    return (
        <form onSubmit={onSubmit}>

            <Space direction="vertical" size={12}>

                <Label>Team Name</Label>
                <Input id="name" {...register("name")} />
                {
                    typeof errors.name?.message === 'string' && <Alert showIcon type="error" message={errors.name?.message} />
                }

                <Space wrap size={16}>
                    <Label>Logo(250x250 px):</Label>
                    <Avatar src={imgUrl} shape="square" size={64} icon={<UserOutlined />} />
                    <Input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files) {
                                setFile(e.target.files[0]);
                                console.log("FILE:", file)
                                onUpload(e.target.files[0]);
                            }
                        }}
                    />
                    <input id="imgLogo" {...register("imgLogo")} hidden />
                    {
                        typeof errors.imgLogo?.message === 'string' && <Alert showIcon type="error" message={errors.imgLogo?.message} />
                    }
                </Space>

                <Label>Description:</Label>
                <Input id="description" {...register("description")} />
                {
                    typeof errors.description?.message === 'string' && <Alert showIcon type="error" message={errors.description?.message} />
                }



                <Label>Supplier Type:</Label>
                <select id="type" {...register("type")}>
                    {typesOptions}
                </select>
                {
                    typeof errors.type?.message === 'string' && <Alert showIcon type="error" message={errors.type?.message} />
                }



                <Label>Contact Email:</Label>
                <Input id="contactEmail" {...register("contactEmail")} />
                {
                    typeof errors.contactEmail?.message === 'string' && <Alert showIcon type="error" message={errors.contactEmail?.message} />
                }

                <Label>Phone Number:</Label>
                <Input id="phoneNumber" {...register("phoneNumber")} />
                {
                    typeof errors.phoneNumber?.message === 'string' && <Alert showIcon type="error" message={errors.phoneNumber?.message} />
                }


                <Label>Address:</Label>
                <Input id="address" {...register("address")} />
                {
                    typeof errors.address?.message === 'string' && <Alert showIcon type="error" message={errors.address?.message} />
                }



                <Button>
                    {params.id ? "Update supplier" : "Create supplier"}
                </Button>
                {/* <div>
                    {JSON.stringify(watch(), null, 2)}
                </div> */}
            </Space>
        </form>
    )
}