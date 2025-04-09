 "use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { useForm } from "react-hook-form"

import { createSupplier, updateSupplier } from "@/app/(protected)/suppliers/suppliers.api"
import { useParams, useRouter } from "next/navigation"
import { useDialog } from "@/components/dialog-supplier"
import { updateIdSupplier } from "@/actions/user-action"
import { useUser } from "@/context/UserContext"
import { signOut } from "next-auth/react"
import { useAlertDialog } from "@/components/alert-dialog"
import UploaderIamge from "@/components/butto-upload-image"
import { useState } from "react"
import { Avatar, Space, Upload } from "antd"

import { UserOutlined } from '@ant-design/icons';
import ImgCrop from "antd-img-crop"





export function SupplierFormUser({ supplier }: any) {

    const [file, setFile] = useState<File | null>(null);
    const [imgUrl, setImgUrl] = useState<string | null>(null);


    const { user } = useUser()
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

                    <ImgCrop rotate aspect={1}>
                        <Upload
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                setFile(file);
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
                    {params.id ? "Update supplier" : "Create supplier"}
                </Button>
            </Space>
        </form>
    )
}