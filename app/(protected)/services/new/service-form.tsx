"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// import { ComboBox } from "@/components/combobox"
import { Label } from "@radix-ui/react-label"
// import { on } from "events"
import { Controller, useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { useSuppliers } from "@/context/SupplierContext"

// API services import
import { createService, ServiceDataNew } from "../services.api"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { getSuppliers } from "@/app/(protected)/suppliers/suppliers.api"
import { getGlobalLocations } from "../../global-locations.api"
import { useEffect, useState } from "react"

// Validation schema with zod and zodResolver from react-hook-form to validate the form
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema } from "@/validations/serviceSchema"

import { Alert, Card, Col, Row, Table, message, Select, Checkbox, List, Typography, DatePicker, Spin } from "antd"

import ImageUploader from "@/components/images-uploader"

// Import the context and the hook  to use the context  from the ServiceContext
import { useServices } from "@/context/ServiceContext"

import { cn } from "@/lib/utils"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"
import { PlusCircleOutlined } from "@ant-design/icons"
import { FAQModal } from "@/components/FAQModal"
import { FAQList } from "@/components/FAQList"
import { useFAQs } from "@/hooks/useFAQs"
import type { FAQ } from "@/types/faq"
import VirtualItinerary from "@/components/virtual-itinerary-custom"
import type { Supplier } from "@/components/supplier-card"

import { fetchStatesCitiesData } from "@/lib/fetchStatesCitiesData";
// import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// const dataSource = fetchStatesCitiesData().then(data => data);  
// Use supabase client for data fetching as needed

// Elimina cualquier hook fuera de la función
// const [dataSource, setDataSource] = useState({}) // <-- Esto es inválido fuera del componente

const { Title } = Typography
interface TourItem {
    id: string
    name: string
}

const initialItems: TourItem[] = [
    { id: "1", name: "Hotel Accommodation" },
    { id: "2", name: "Breakfast" },
    { id: "3", name: "Guided Tours" },
    { id: "4", name: "Transportation" },
    { id: "5", name: "Entry Fees" },
    { id: "6", name: "Wi-Fi" },
    { id: "7", name: "Lunch" },
    { id: "8", name: "Dinner" },
    { id: "9", name: "Travel Insurance" },
    { id: "10", name: "Personal Expenses" },
]






// --------------------------------------------------------------------- IMPORTS  ----------------------------------------------------------- //


interface Include {
    title: string
}

interface Service {
    id: string;
    name: string;
    supplierId?: number; // Add this if not present
    description?: string;
    price?: number;
    location?: string;
    availableFrom?: Date | null;
    availableTo?: Date | null;
    packs?: { data: { name: string; description: string; qty: number; price: number }[] }; // <-- changed
    images?: string[];
    ytLink?: string;
    sizeTourM?: number;
    serviceType?: string;
    serviceCategory?: string;
    stateFrom?: string;
    cityFrom?: string;
    stateTo?: string;
    cityTo?: string;
    includes?: string[];
    excludes?: string[];
    faqs?: FAQ[];
    activities?: string[];
    transportProviderID?: number;
    hotelProviderID?: number;
}

interface Session {
    user: {
        id: string;
        name?: string | null | undefined;
        email?: string | null;
        image?: string | null;
        supplierId?: string | null;
        role: string;
    };
}


interface ServiceFormProps {
    suppliers: Supplier[];
    service: Service; // Change from Service[] to Service
    session: Session | null;
}

// Add this interface above ServiceFormProps
interface ServiceFormFields {
    supplierId?: number;
    name?: string;
    description?: string;
    price?: number;
    location?: string;
    availableFrom?: Date | null;
    availableTo?: Date | null;
    packs?: { data: { name: string; description: string; qty: number; price: number }[] };
    images?: { imgBanner: string; imgAlbum: string[] }; // <-- changed from string[] to object
    ytLink?: string;
    sizeTour?: number;
    serviceType?: string;
    serviceCategory?: string;
    stateFrom?: string;
    cityFrom?: string;
    stateTo?: string;
    cityTo?: string;
    includes?: string[];
    excludes?: string[];
    faqs?: FAQ[];
    itinerary?: string[];
    transportProviderID?: number;
    hotelProviderID?: number;
}

// Define the type for images errors
interface ImagesError {
    imgBanner?: { message: string };
    imgAlbum?: { message: string };
}

// Type for possible images input
interface ImagesInput {
    imgBanner?: unknown;
    imgAlbum?: unknown;
    [key: string]: unknown;
}

// Helper to normalize images field for useForm defaultValues
function normalizeImages(
    images: unknown
): { imgBanner: string; imgAlbum: string[] } {
    if (
        images &&
        typeof images === "object" &&
        !Array.isArray(images) &&
        "imgBanner" in images &&
        "imgAlbum" in images
    ) {
        const imgBanner = (images as ImagesInput).imgBanner ?? "";
        const imgAlbumRaw = (images as ImagesInput).imgAlbum;
        const imgAlbum = Array.isArray(imgAlbumRaw)
            ? imgAlbumRaw.filter((x): x is string => typeof x === "string")
            : typeof imgAlbumRaw === "string"
                ? [imgAlbumRaw]
                : [];
        return { imgBanner: String(imgBanner), imgAlbum };
    }
    return { imgBanner: "", imgAlbum: [] };
}

// Tipo para los rangos de fechas
interface ServiceDateRange {
    availableFrom: Date;
    availableTo: Date;
}

export function ServiceForm({ service, session }: ServiceFormProps) {
    const [loading, setLoading] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [formSummary, setFormSummary] = useState<any>(null);

    // FAQs STATEs  
    const { faqs, addFAQ, updateFAQ, deleteFAQ } = useFAQs()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingFAQ, setEditingFAQ] = useState<FAQ | undefined>(undefined)
    const [searchTerm, setSearchTerm] = useState("")

    //   Location STATEs    OR    //   Location STATEs    ORRIGEN
    const [selectedState, setSelectedState] = useState<string | null>(null)
    const [selectedCity, setSelectedCity] = useState<string | null>(null)
    const [cities, setCities] = useState<string[]>([])

    //   Location STATEs DESTINO
    const [selectedStateTo, setSelectedStateTo] = useState<string | null>(null)
    const [selectedCityTo, setSelectedCityTo] = useState<string | null>(null)
    const [citiesTo, setCitiesTo] = useState<string[]>([])

    const [includes, setIncludes] = useState<string[]>([])
    const [excludes, setexcludes] = useState<string[]>([])

    // RANGOS DE FECHAS
    const [dateRanges, setDateRanges] = useState<ServiceDateRange[]>([]);
    const [currentRange, setCurrentRange] = useState<{ availableFrom: Date | null; availableTo: Date | null }>({ availableFrom: null, availableTo: null });



    const handleIncludeChange = (name: string) => {

        const newInclude: Include = {
            title: name
        }

        setIncludes((prev) => {
            if (prev.includes(newInclude.title)) {
                return prev.filter((item) => item !== newInclude.title)
            } else {
                setexcludes((prev) => prev.filter((item) => item !== newInclude.title))
                return [...prev, newInclude.title]
            }
        })
        // console.log("Includes", includes)

    }

    const handleNotIncludeChange = (name: string) => {

        const newExclude: Include = {
            title: name
        }

        setexcludes((prev) => {
            if (prev.includes(newExclude.title)) {
                return prev.filter((item) => item !== newExclude.title)
            } else {
                setIncludes((prev) => prev.filter((item) => item !== newExclude.title))
                return [...prev, newExclude.title]
            }
        })

        // console.log("Excludes", excludes)


    }

    // state para cargar las ciudades dependiendo del estado seleccionado





    // Use the hook to get the context
    const { images, activities, transportProviderID, hotelProviderID } = useServices()


    const values = useSuppliers()
    // const { getIdSupplier } = useSuppliers()

    const router = useRouter()
    const params = useParams<{ id: string }>()

    // STATEs for packages
    const [pack, setPack] = useState<{ name: string, description: string, qty: number, price: number }>({ name: '', description: '', qty: 0, price: 0 })
    const [packs, setPacks] = useState<{ data: { name: string, description: string, qty: number, price: number }[] }>({ data: [] })

    // STATE FOR suppliers
    const [suppliersStateTransport, setSuppliersStateTransport] = useState<{ id: number, name: string }[]>([])
    const [suppliersStateHotel, setSuppliersStateHotel] = useState<{ id: number, name: string }[]>([])
    const [selectedSupplier, setSelectedSupplier] = useState<{ id: number, name: string } | undefined>(undefined)

    //STATE for global_locations
    const [globalLocations, setGlobalLocations] = useState<{ id: number; country: string; state: string, city: string }[]>([]);




    // // // MESSAGE API from antd
    const [messageApi, contextHolder] = message.useMessage();
    // WARNING message 
    const warning = ({ content }: { content: string }) => {
        messageApi.open({
            type: 'warning',
            content: content,
        });
    };
    // const success = () => {

    //     messageApi.open({
    //         type: 'success',
    //         content: 'This is a success message',
    //     });
    // };

    // const error = ({ content }: { content: string }) => {
    //     messageApi.open({
    //         type: 'error',
    //         content: content,
    //     });
    // };



    // USE EFFECT TO FETCH suppliers
    useEffect(() => {



        setValue("includes", includes)
        setValue("excludes", excludes)
        setValue("faqs", faqs)
        setValue("itinerary", activities)
        // Elimina las siguientes líneas para evitar reseteo de selects en cada cambio:
        // setValue("transportProviderID", transportProviderID)
        // setValue("hotelProviderID", hotelProviderID)

        if (
            images &&
            typeof images === "object" &&
            !Array.isArray(images) &&
            "imgBanner" in images &&
            "imgAlbum" in images
        ) {
            setValue("images", {
                imgBanner: images.imgBanner ?? "",
                imgAlbum: Array.isArray(images.imgAlbum) ? images.imgAlbum : images.imgAlbum ? [images.imgAlbum] : [],
            });
        }

        if (errors.name) {
            warning({ content: "Se necesitan todos los campos" })
        }

        const fetchSuppliers = async () => {
            try {
                const globalLocationsData = await getGlobalLocations();
                const suppliersData = await getSuppliers()
                setSuppliersStateTransport(suppliersData.filter((supplier: { supplierType: string }) => supplier.supplierType === 'transporte'))
                setSuppliersStateHotel(suppliersData.filter((supplier: { supplierType: string }) => supplier.supplierType === 'hospedaje'))
                const selected = suppliersData.find((supplier: { id: number }) => supplier.id === Number(session?.user?.supplierId));
                setGlobalLocations(globalLocationsData); // Usar la data obtenida, no el estado
                setSelectedSupplier(selected)
            } catch (error) {
                console.log("Failed to fetch suppliers", error)
            }
        }
        fetchSuppliers()

        if (selectedState) {
            setCities(globalLocations.filter(l => l.state === selectedState).map(l => l.city))
        } else {
            setCities([])
        }
        if (selectedStateTo) {
            setCitiesTo(globalLocations.filter(l => l.state === selectedStateTo).map(l => l.city))
        } else {
            setCitiesTo([])
        }
    }, [images, selectedState, selectedStateTo, includes, excludes, faqs, activities]) // Eliminar globalLocations de dependencias

    // Inicializa los valores de los selects solo una vez al montar o cuando llega la data inicial
    useEffect(() => {
        if (service?.transportProviderID) {
            setValue("transportProviderID", service.transportProviderID);
        } else if (transportProviderID) {
            setValue("transportProviderID", transportProviderID);
        }
        if (service?.hotelProviderID) {
            setValue("hotelProviderID", service.hotelProviderID);
        } else if (hotelProviderID) {
            setValue("hotelProviderID", hotelProviderID);
        }
        // Solo se ejecuta una vez
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // CHANGE useForm to use the generic type
    const { control, register, handleSubmit, setValue, formState: { errors }, watch } = useForm<ServiceFormFields>(
        {
            defaultValues: {
                supplierId: service?.supplierId,
                name: service?.name,
                description: service?.description,
                price: service?.price,
                location: service?.location,
                availableFrom: service?.availableFrom,
                availableTo: service?.availableTo,
                packs: service?.packs,
                images: normalizeImages(service?.images),
                ytLink: service?.ytLink,
                sizeTour: service?.sizeTourM,
                serviceType: service?.serviceType,
                serviceCategory: service?.serviceCategory,
                stateFrom: service?.stateFrom,
                cityFrom: service?.cityFrom,
                stateTo: service?.stateTo,
                cityTo: service?.cityTo,
                includes: service?.includes,
                excludes: service?.excludes,
                faqs: service?.faqs,
                itinerary: service?.activities,
                transportProviderID: service?.transportProviderID,
                hotelProviderID: service?.hotelProviderID,
            },
            // add zod resolver to the form with the schema created
            resolver: zodResolver(serviceSchema)
        }
    )

    // Watch values for controlled selects
    const transportProviderIDValue = watch("transportProviderID");
    const hotelProviderIDValue = watch("hotelProviderID");

    // SUBMIT function to handle the form submission
    const handleReviewAndConfirm = async (data: ServiceFormFields) => {
        // Prepara el resumen solo con los campos principales
        setFormSummary({
            name: data.name,
            price: data.price,
            availableFrom: data.availableFrom,
            availableTo: data.availableTo,
            supplier: selectedSupplier?.name || values?.name || '',
            imgBanner: images?.imgBanner,
            imgAlbumCount: images?.imgAlbum?.length || 0,
        });
        setOpenConfirm(true);
    };
    const onSubmit = async (data: ServiceFormFields) => {
        setLoading(true);
        try {
            // Adaptar los datos del formulario al formato que espera el backend
            const adaptedData: ServiceDataNew = {
                name: data.name ?? '',
                location: data.location ?? '',
                images: {
                    imgBanner: images?.imgBanner ?? '',
                    imgAlbum: Array.isArray(images?.imgAlbum) ? images.imgAlbum : [],
                },
                availableFrom: data.availableFrom ? new Date(data.availableFrom).toISOString() : '',
                availableTo: data.availableTo ? new Date(data.availableTo).toISOString() : '',
                createdAt: new Date().toISOString(),
                description: data.description ?? '',
                // id: service?.id ?? '',
                packs: packs,
                price: data.price ?? 0,
                supplierId: Number(values.idSupplier ?? session?.user?.supplierId ?? 0),
                cityTo: data.cityTo ?? '',
                // Campos agregados según defaultValues
                ytLink: data.ytLink ?? '',
                sizeTour: data.sizeTour ?? undefined,
                serviceType: data.serviceType ?? '',
                serviceCategory: data.serviceCategory ?? '',
                stateFrom: data.stateFrom ?? selectedState ?? '',
                cityFrom: data.cityFrom ?? selectedCity ?? '',
                stateTo: data.stateTo ?? selectedStateTo ?? '',
                includes: includes,
                excludes: excludes,
                faqs: faqs,
                itinerary: activities,
                transportProviderID: data.transportProviderID ?? transportProviderID ?? 0,
                hotelProviderID: data.hotelProviderID ?? hotelProviderID ?? 0,
                dates: dateRanges
                    .filter(range => range.availableFrom && range.availableTo)
                    .map(range => ({
                        availableFrom: range.availableFrom.toISOString(),
                        availableTo: range.availableTo.toISOString(),
                    })),
            };
            try {
                if (service && service.id) {
                    // await updateService(service.id, adaptedData);
                } else {
                    await createService(adaptedData);
                    console.log('service new', adaptedData);
                }
                router.push("/services");
                router.refresh();
            } catch (error) {
                console.error("Failed to submit form", error);
            }
        } catch (error) {
            // ...existing error handling code...
        } finally {
            // No desactives loading aquí
        }
    }

    // const handleSubmitInclusions = async (e: any) => {
    //     e.preventDefault()
    //     setValue("includes", includes)
    //     setValue("excludes", excludes)

    //     // console.log("Inclusions:", includes, excludes)
    // }

    // Handle submit for add packages //
    const handleSbmitPcks = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!pack.name || !pack.description || !pack.price || !pack.qty) {
            warning({ content: 'Ingresa todos los datos del paquete' });
            return;
        }

        const updatedPacks = { data: [...packs.data, pack] } // Create a new list of packages with the new package

        setPacks(updatedPacks)  // Add the new package to the list of packages
        setPack({ name: '', description: '', qty: 0, price: 0 }) // Reset the package state
        setValue("packs", updatedPacks) // Set the value of the packages field to the updated list of packages

        // console.log("PACKS:", updatedPacks)
        // console.log("Form Packs:", getValues("packs"));


    }

    // Handle delete package 
    const handleDeletePack = (key: number) => {
        const newPacks = packs.data.filter((pack, index) => index + 1 !== key)
        setPacks({ data: newPacks })
    }


    // Handlers Locatiopn FROM
    const handleStateChange = (value: string) => {
        setSelectedState(value)
        setValue("stateFrom", value)
    }

    const handleCityChange = (value: string) => {
        setSelectedCity(value)
        setValue("cityFrom", value)
    }
    // Handlers Locatiopn TO
    const handleStateToChange = (value: string) => {
        setSelectedStateTo(value)
        setValue("stateTo", value)
    }

    const handleCityToChange = (value: string) => {
        setSelectedCityTo(value)
        setValue("cityTo", value)
    }

    // FAqs functions
    const handleOpenModal = () => {
        setEditingFAQ(undefined)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingFAQ(undefined)
    }

    const handleSubmitFAQs = (faq: Omit<FAQ, "id">) => {
        if (editingFAQ) {
            updateFAQ({ ...faq, id: editingFAQ.id })
            // console.log("FAQ updated successfully")
        } else {
            // console.log("faqs:", faqs)
            addFAQ(faq)
            setValue("faqs", faqs)   // Add the new FAQ to the list of FAQs
            message.success("FAQ added successfully")
        }
    }

    const handleEdit = (faq: FAQ) => {
        setEditingFAQ(faq)
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        deleteFAQ(id)
        message.success("FAQ deleted successfully")
    }

    const filteredFAQs = faqs.filter((faq) => faq.question.toLowerCase().includes(searchTerm.toLowerCase()))












    // -------------------------------------------------------------------- FUNCTIONS  ----------------------------------------------------------- //

    // Función para agregar un nuevo rango de fechas
    const addDateRange = () => {
        if (currentRange.availableFrom && currentRange.availableTo) {
            setDateRanges([...dateRanges, { availableFrom: currentRange.availableFrom, availableTo: currentRange.availableTo }]);
            setCurrentRange({ availableFrom: null, availableTo: null });
        }
    };

    // Función para eliminar un rango de fechas
    const removeDateRange = (index: number) => {
        setDateRanges(dateRanges.filter((_, i) => i !== index));
    };



    // console.log("Transportistas: ", suppliersStateTransport)
    // console.log("Hoteles: ", suppliersStateHotel)

    // console.log("Global Locations: ", globalLocations)

    // El overlay solo se muestra si loading es true y no se ha navegado
    return (
        <>
            {loading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(255,255,255,0.7)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Spin size="large" tip="Creando servicio..." />
                </div>
            )}
            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Resumen del servicio</DialogTitle>
                    </DialogHeader>
                    {formSummary && (
                        <Table
                            dataSource={[
                                { key: '1', campo: 'Nombre', valor: formSummary.name },
                                { key: '2', campo: 'Precio', valor: formSummary.price },
                                { key: '3', campo: 'Disponible desde', valor: formSummary.availableFrom ? new Date(formSummary.availableFrom).toLocaleDateString() : '' },
                                { key: '4', campo: 'Disponible hasta', valor: formSummary.availableTo ? new Date(formSummary.availableTo).toLocaleDateString() : '' },
                                { key: '5', campo: 'Proveedor', valor: formSummary.supplier },
                                { key: '6', campo: 'Imagen principal', valor: formSummary.imgBanner ? <img src={formSummary.imgBanner} alt="banner" style={{ width: 60, height: 40, objectFit: 'cover' }} /> : 'No imagen' },
                                { key: '7', campo: 'Imágenes álbum', valor: formSummary.imgAlbumCount },
                            ]}
                            columns={[
                                { title: 'Campo', dataIndex: 'campo', key: 'campo' },
                                { title: 'Valor', dataIndex: 'valor', key: 'valor' },
                            ]}
                            pagination={false}
                            showHeader={false}
                            size="small"
                        />
                    )}
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpenConfirm(false)}>Cancelar</Button>
                        <Button onClick={() => { setOpenConfirm(false); handleSubmit(onSubmit)(); }}>Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <form onSubmit={handleSubmit(handleReviewAndConfirm)} className="bg-white dark:bg-gray-900 text-black dark:text-white p-4 rounded-lg">

                <Row className="mb-4">
                    <Col span={10}>
                        <Label>Proveedor::</Label>
                        <h1> {selectedSupplier?.name} </h1>
                        <div hidden>
                            <Input
                                value={values.idSupplier ? values.idSupplier : session?.user?.supplierId ?? ''}
                                {...register("supplierId")}
                                disabled
                                className="w-1/4"
                                hidden={true}
                            />
                        </div>
                    </Col>

                    <Col span={4}>
                        <Label>
                            <h1>Servicio:</h1>
                        </Label>
                        <Select
                            // {...register("serviceType")}
                            // value={getValues("serviceType") || "tour"}
                            style={{ width: 120 }}
                            options={[
                                { value: 'bus', label: 'bus', disabled: true },
                                { value: 'tour', label: 'tour', },
                                { value: 'hotel', label: 'hotel', disabled: true },
                                { value: 'tickets', label: 'Tickets', disabled: true },
                            ]}
                            onChange={(value) => setValue("serviceType", value)}
                        />
                        {typeof errors.serviceType?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.serviceType.message} />
                        )}
                    </Col>


                    <Col span={4}>
                        <Label>
                            <h1>Tipo:</h1>
                        </Label>
                        <Select
                            // {...register("serviceCategory")}
                            // value={getValues("serviceCategory") || "ecoturismo"}
                            style={{ width: 120 }}
                            options={[
                                { value: 'ecoturismo', label: 'ecoturismo' },
                                { value: 'paquete', label: 'paquete' },
                                { value: 'festival', label: 'festival' },
                                { value: 'familiar', label: 'familiar' },
                            ]}
                            onChange={(value) => setValue("serviceCategory", value)}
                        />
                        {typeof errors.serviceCategory?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.serviceCategory.message} />
                        )}
                    </Col>


                    <Col span={3}>
                        <Label>
                            <h1>Tamaño:</h1>
                        </Label>    
                        <Input
                            {...register("sizeTour", {
                                setValueAs: value => {
                                    // Limita a 3 cifras
                                    const num = parseInt(value, 10);
                                    if (isNaN(num)) return undefined;
                                    return Math.max(0, Math.min(num, 999));
                                }
                            })}
                            
                            type="number"
                            min={1}
                            max={999}
                            maxLength={3}
                            onInput={e => {
                                // Limita a 3 caracteres en el input
                                const target = e.target as HTMLInputElement;
                                if (target.value.length > 3) {
                                    target.value = target.value.slice(0, 3);
                                }
                            }}
                        />
                        {typeof errors.sizeTour?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.sizeTour.message} />
                        )}
                    </Col>

                </Row>

                <Row className="mb-4">
                    <Label>Fotos:</Label>

                    <Col span={24}>

                        <ImageUploader />

                        {errors.images && 'imgBanner' in errors.images && (
                            <Alert
                                showIcon
                                type="error"
                                message={(errors.images as ImagesError).imgBanner?.message}
                            />
                        )}

                        {errors.images && 'imgAlbum' in errors.images && (
                            <Alert
                                showIcon
                                type="error"
                                message={(errors.images as ImagesError).imgAlbum?.message}
                            />
                        )}
                    </Col>


                </Row>

                <Row className="mb-4">


                    <Col span={8}>

                        <Label>Nombre del Servicio:</Label>
                        <Input
                            {...register("name")}
                        />
                        {typeof errors.name?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.name.message} />
                        )}
                    </Col>
                    <Col span={13}>
                        <Label>
                            <h1>Youtube video Llink:</h1>
                        </Label>
                        <Input
                            {...register("ytLink")}
                        />
                        {typeof errors.ytLink?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.ytLink.message} />
                        )}
                    </Col>
                    <Col span={3} >
                        <Label>Precio Regular:</Label>
                        <Input
                            {...register("price", {
                                setValueAs: value => parseFloat(value)
                            })}
                        />
                        {
                            typeof errors.price?.message === 'string' && <Alert showIcon type="error" message={errors.price?.message} />
                        }
                    </Col>


                </Row>
                <Row className="mb-4">
                    <Col span={24}>
                        <Label>Descripcion:</Label>
                        <Textarea
                            {...register("description")}
                        />
                        {
                            typeof errors.description?.message === 'string' && <Alert showIcon type="error" message={errors.description?.message} />
                        }
                    </Col>
                </Row>



















                <Label> Paquetes:</Label>

                <Row className="mb-4 mt-4">
                    <Col span={12} className="mb-4">
                        <Label className="mr-4">Desde:</Label>
                        <Controller
                            name="availableFrom"
                            control={control}
                            render={({ field }) => (
                                <DatePickerWithRange
                                    value={field.value ?? null}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {
                            typeof errors.availableFrom?.message === 'string' && <Alert showIcon type="error" message={errors.availableFrom?.message} />
                        }
                    </Col>

                    <Col span={12} className="mb-4">
                        <Label className="mr-4">Hasta:</Label>
                        <Controller
                            name="availableTo"
                            control={control}
                            render={({ field }) => (
                                <DatePickerWithRange
                                    value={field.value ?? null}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {
                            typeof errors.availableTo?.message === 'string' && <Alert showIcon type="error" message={errors.availableTo?.message} />
                        }
                    </Col>

                </Row>

                <Row>
                    <div>
                        <Label>Fechas disponibles (puedes agregar varias):</Label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            {/* Desde */}
                            <DatePickerWithRange
                                value={currentRange.availableFrom}
                                onChange={(date) => {
                                    setCurrentRange({ ...currentRange, availableFrom: date, availableTo: null });
                                }}
                            />
                            <span>a</span>
                            {/* Hasta: Si no hay fecha de inicio, deshabilitar el DatePicker usando Ant Design */}
                            <DatePicker
                                value={currentRange.availableTo}
                                onChange={(date) => setCurrentRange({ ...currentRange, availableTo: date })}
                                disabled={!currentRange.availableFrom}
                                minDate={currentRange.availableFrom ? dayjs(currentRange.availableFrom) : undefined}
                                style={{ width: 240 }}
                                format="DD/MM/YYYY"
                                placeholder="Selecciona la fecha de fin"
                            />
                            {/* Botón para agregar rango de fechas */}
                            <Button type="button" onClick={addDateRange}>
                                <PlusCircleOutlined style={{ marginRight: 4 }} /> Agregar
                            </Button>
                        </div>
                        <ul>
                            {dateRanges.map((range, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {new Date(range.availableFrom).toLocaleDateString()} - {new Date(range.availableTo).toLocaleDateString()}
                                    <Button type="button" onClick={() => removeDateRange(idx)} variant="outline" size="icon">
                                        <XCircle className="w-4 h-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Row>

                <Row className="mb-4 mt-4">

                    <Col span={12}>
                        <div
                            className={cn("flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow", "sm:flex-row sm:space-x-4 sm:space-y-0")}
                        >
                            <Label>Origen:</Label>
                            {/* Estado */}
                            {(() => {
                                const stateOptions = Array.from(new Set(globalLocations.map(l => l.state)))
                                    .filter(Boolean)
                                    .sort((a, b) => a.localeCompare(b))
                                    .map((state) => ({ value: state, label: state }));
                                return (
                                    <div className="flex items-center w-full sm:w-1/2 gap-2">
                                        <Select
                                            className="w-full"
                                            placeholder="Selecciona el estado"
                                            onChange={handleStateChange}
                                            value={selectedState}
                                            options={stateOptions}
                                            showSearch
                                            filterOption={(input, option) => (option?.label?.toLowerCase() ?? "").indexOf(input.toLowerCase()) >= 0}
                                            notFoundContent={<div className="text-gray-500">No hay estados disponibles</div>}
                                        />
                                        <span className="text-xs text-gray-500">{stateOptions.length}</span>
                                    </div>
                                );
                            })()}

                            {/* Ciudad */}
                            {(() => {
                                const cityOptions = globalLocations
                                    .filter(l => l.state === selectedState)
                                    .map((l) => l.city)
                                    .filter(Boolean)
                                    .filter((city, idx, arr) => arr.indexOf(city) === idx)
                                    .sort((a, b) => a.localeCompare(b))
                                    .map((city) => ({ value: city, label: city }));
                                return (
                                    <div className="flex items-center w-full sm:w-1/2 gap-2">
                                        <Select
                                            className="w-full"
                                            placeholder="Seleciona la Ciudad"
                                            onChange={handleCityChange}
                                            value={selectedCity}
                                            disabled={!selectedState}
                                            options={cityOptions}
                                            notFoundContent={<div className="text-gray-500">No hay ciudades disponibles</div>}
                                            showSearch
                                            filterOption={(input, option) => (option?.label?.toLowerCase() ?? "").indexOf(input.toLowerCase()) >= 0}
                                        />
                                        <span className="text-xs text-gray-500">{cityOptions.length}</span>
                                    </div>
                                );
                            })()}

                        </div>
                    </Col>

                    <Col span={12}>
                        <div
                            className={cn("flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow", "sm:flex-row sm:space-x-4 sm:space-y-0")}
                        >
                            <Label>Destino:</Label>
                            <Select
                                className="w-full sm:w-1/2"
                                placeholder="Selecciona el Estado"
                                onChange={handleStateToChange}
                                value={selectedStateTo}
                                options={Array.from(new Set(globalLocations.map(l => l.state))).map((state) => ({ value: state, label: state }))}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label?.toLowerCase() ?? "").indexOf(input.toLowerCase()) >= 0
                                }
                                notFoundContent={<div className="text-gray-500">No hay estados disponibles</div>}
                            />

                            <Select
                                className="w-full sm:w-1/2"
                                placeholder="Seleccciona la Ciudad"
                                onChange={handleCityToChange}
                                value={selectedCityTo}
                                disabled={!selectedStateTo}
                                options={citiesTo.map((city) => ({ value: city, label: city }))}
                                notFoundContent={<div className="text-gray-500">No cities available</div>}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label?.toLowerCase() ?? "").indexOf(input.toLowerCase()) >= 0
                                }
                            />

                        </div>
                    </Col>


                </Row>





                <Row className="mb-4 mt-4">
                    <Col span={6}>
                        {typeof errors.stateFrom?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.stateFrom.message} />
                        )}

                    </Col>
                    <Col span={6}>

                        {typeof errors.cityFrom?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.cityFrom.message} />
                        )}

                    </Col>
                    <Col span={6}>

                        {typeof errors.stateTo?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.stateTo.message} />
                        )}

                    </Col>
                    <Col span={6}>



                        {typeof errors.cityTo?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.cityTo.message} />
                        )}
                    </Col>
                </Row>

                <Row gutter={16}>


                    <Col span={12}>
                        <Label>Transporte:</Label>
                        <Select
                            style={{ width: '100%' }}
                            options={suppliersStateTransport.map((supplier) => ({
                                value: supplier.id,
                                label: supplier.name,
                            }))}
                            value={transportProviderIDValue}
                            onChange={(value) => setValue("transportProviderID", value)}
                        />
                        {typeof errors.transportProviderID?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.transportProviderID.message} />
                        )}
                    </Col>

                    <Col span={12}>
                        <Label>Hotel:</Label>
                        <Select
                            style={{ width: '100%' }}
                            options={suppliersStateHotel.map((supplier) => ({
                                value: supplier.id,
                                label: supplier.name,
                            }))}
                            value={hotelProviderIDValue}
                            onChange={(value) => setValue("hotelProviderID", value)}
                        />
                        {typeof errors.hotelProviderID?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.hotelProviderID.message} />
                        )}
                    </Col>


                </Row>



                <Row className="mb-4 mt-4">
                    <Col span={7}>
                        <Label>Tipo </Label>
                        <Input
                            value={pack.name}
                            onChange={(e) => setPack({ ...pack, name: e.target.value })}
                            placeholder="Tipo de Paquete"
                        />
                    </Col>
                    <Col span={7}>
                        <Label>Descripción</Label>
                        <Input
                            value={pack.description}
                            onChange={(e) => setPack({ ...pack, description: e.target.value })}
                            placeholder="Descripción"
                        />
                    </Col>
                    <Col span={3}>
                        <Label>Precio</Label>
                        <Input
                            value={Number.isFinite(pack.price) && pack.price !== 0 ? pack.price : ''}
                            placeholder="Price"
                            type="number"
                            onChange={(e) => setPack({ ...pack, price: parseFloat(e.target.value) })}
                        />
                    </Col>
                    <Col span={3}>
                        <Label>Cantidad</Label>
                        <Input
                            value={Number.isFinite(pack.qty) && pack.qty !== 0 ? pack.qty : ''}
                            type="number"
                            onChange={(e) => setPack({ ...pack, qty: parseFloat(e.target.value) })}
                            placeholder="Qty"
                        />
                    </Col>
                    <Col span={2}>
                        <Label>Agregar</Label>
                        <Button type="button" onClick={handleSbmitPcks} >+</Button>
                    </Col>
                </Row>
                <Row className="mb-4 mt-4">
                    <Col span={24}>

                        {
                            packs.data.length > 0 && (
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Table
                                            dataSource={packs?.data.map((pack, index) => ({ ...pack, key: index + 1 }))}
                                            columns={[
                                                {
                                                    title: <b>ID</b>,
                                                    dataIndex: 'key',
                                                    key: 'key',
                                                },
                                                {
                                                    title: <b>Package Name</b>,
                                                    dataIndex: 'name',
                                                    key: 'name',
                                                },
                                                {
                                                    title: <b>Description</b>,
                                                    dataIndex: 'description',
                                                    key: 'description',
                                                },
                                                {
                                                    title: <b>Qty</b>,
                                                    dataIndex: 'qty',
                                                    key: 'qty',
                                                },
                                                {
                                                    title: <b>Price</b>,
                                                    dataIndex: 'price',
                                                    key: 'price',
                                                },
                                                {
                                                    title: <b>Delete</b>,
                                                    key: 'action',
                                                    render: (_, record) => (
                                                        <Label
                                                            onClick={() => handleDeletePack(record.key)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            ❌
                                                        </Label>
                                                    ),
                                                },
                                            ]}
                                        />
                                    </Col>
                                </Row>
                            )
                        }

                        {
                            typeof errors.packs?.message === 'string' && <Alert showIcon type="error" message={errors.packs?.message} />
                        }
                    </Col>

                </Row>

                {/* Itinerar builder */}

                <Row className="mb-4 mt-4">
                    <VirtualItinerary />
                    {typeof errors.itinerary?.message === 'string' && (
                        <Alert showIcon type="error" message={errors.itinerary.message} />
                    )}
                </Row>






                <Row className="mb-4 mt-4">

                    <Card className="w-full max-w-1xl mx-auto bg-white dark:bg-gray-800 text-black dark:text-white">
                        <CardHeader>
                            <CardTitle>
                                <Title level={4}>
                                    Servicios Inlcuidos
                                </Title>
                            </CardTitle>
                        </CardHeader>
                        <CardContent style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <Row className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Col span={12}>
                                    <Title level={3} className="mb-4 flex items-center">
                                        <CheckCircle2 className="mr-2 text-green-500" />
                                        Incluido
                                    </Title>
                                    {
                                        typeof errors.includes?.message === 'string' && <Alert showIcon type="error" message={errors.includes?.message} />
                                    }

                                    <List
                                        dataSource={initialItems}
                                        renderItem={(item) => (
                                            <List.Item key={item.id}>
                                                <Checkbox
                                                    checked={includes.includes(item.name)}
                                                    onChange={() => handleIncludeChange(item.name)}>
                                                    {item.name}
                                                </Checkbox>
                                            </List.Item>
                                        )}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Title level={3} className="mb-4 flex items-center">
                                        <XCircle className="mr-2 text-red-500" />
                                        No Incluido
                                    </Title>
                                    {
                                        typeof errors.excludes?.message === 'string' && <Alert showIcon type="error" message={errors.excludes?.message} />
                                    }
                                    <List
                                        dataSource={initialItems}
                                        renderItem={(item) => (
                                            <List.Item key={item.id}>
                                                <Checkbox
                                                    checked={excludes.includes(item.name)}
                                                    onChange={() => handleNotIncludeChange(item.name)}>
                                                    {item.name}
                                                </Checkbox>
                                            </List.Item>
                                        )}
                                    />
                                </Col>
                            </Row>

                        </CardContent>
                        <CardContent>

                            {(includes.length > 0 || excludes.length > 0) && (
                                <div className="mt-6">
                                    <Title level={4}>Selected Items</Title>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-sm font-medium">Includes</CardTitle>
                                            </CardHeader>
                                            <CardContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
                                                <List
                                                    dataSource={initialItems.filter((item) => includes.includes(item.name))}
                                                    renderItem={(item) => <List.Item key={item.id}>{item.name}</List.Item>}
                                                />
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-sm font-medium">Not Includes</CardTitle>
                                            </CardHeader>
                                            <CardContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
                                                <List
                                                    dataSource={initialItems.filter((item) => excludes.includes(item.name))}
                                                    renderItem={(item) => <List.Item key={item.id}>{item.name}</List.Item>}
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </CardContent>

                    </Card>

                    {/* <TourIncludes /> */}

                </Row>




                {/* FAQs builder */}
                <div className="container mx-auto py-8">
                    {/* <FAQManager /> */}

                    <div className="max-w-4xl mx-auto p-4">
                        <h1 className="text-2xl font-bold mb-4">FAQ Manager</h1>
                        <div className="mb-4">
                            <Input
                                placeholder="Search FAQs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-2"
                            />
                            {typeof errors.faqs?.message === 'string' && (
                                <Alert showIcon type="error" message={errors.faqs.message} />
                            )}
                            <Button type="button" onClick={handleOpenModal}>
                                <PlusCircleOutlined className="mr-2" />
                                Add FAQ
                            </Button>
                        </div>
                        <FAQList faqs={filteredFAQs} onEdit={handleEdit} onDelete={handleDelete} />
                        <FAQModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitFAQs} initialData={editingFAQ} />

                    </div>

                </div>







                <Input
                    {...register("location")}
                />
                {
                    typeof errors.location?.message === 'string' && <Alert showIcon type="error" message={errors.location?.message} />
                }

                <pre style={{ color: "red", fontSize: 12 }}>
                    {JSON.stringify(
                        Object.fromEntries(
                            Object.entries(errors).map(([key, value]) => [key, value?.message])
                        ),
                        null,
                        2
                    )}
                </pre>
                <Button type="submit">
                    {
                        params?.id ? "Update service" : "Crear servicio"
                    }
                </Button>




            </form>


        </>
    );
}