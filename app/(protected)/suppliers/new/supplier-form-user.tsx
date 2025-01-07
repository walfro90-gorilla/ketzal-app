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

export function SupplierFormUser({ supplier }: any) {
    const { user } = useUser()
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: supplier?.name,
            description: supplier?.description,
            contactEmail: supplier?.contactEmail,
            phoneNumber: supplier?.phoneNumber,
            address: supplier?.address,
            id: supplier?.id,
            imgLogo: supplier?.imgLogo,
        }
    })

    const router = useRouter()
    const params = useParams<{ id: string }>()
    const { setIsOpen } = useDialog()
    const { showDialog } = useAlertDialog()

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
            const dataUpdate = await createSupplier(data);
            await updateIdSupplier(dataUpdate, user);
            await signOut({
                callbackUrl: '/login'
            });
        }

        setIsOpen(false);
        router.refresh();
    });

    return (
        <form onSubmit={onSubmit}>
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
            <Label>Image:</Label>
            <Input {...register("imgLogo")} />
            <Button>
                {params.id ? "Update supplier" : "Create supplier"}
            </Button>
        </form>
    )
}