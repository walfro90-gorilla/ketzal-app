import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Space, Upload, UploadProps, message } from "antd";





const ImageUploader = () => {

    const [imgUrl, setImgUrl] = React.useState<string | null>(null);
    const [isUploading, setIsUploading] = React.useState(false); // Controla el estado de subida
    const [prevFileListLength, setPrevFileListLength] = React.useState(0); // Estado para la longitud previa del fileList

    // Message API for notifications
    const [messageApi, contextHolder] = message.useMessage();

    const props: UploadProps = {
        beforeUpload: (file) => {
            console.log("FIIILE:", file);
            // Verificar si el archivo es una imagen
            const isPNG = file.type === 'image/png'; // Verificar si el archivo es PNG
            const isJPG = file.type === 'image/jpeg'; // Verificar si el archivo es JPG
            const sizeFile = file.size <= 5 * 1024 * 1024; // Verificar el tamaño del archivo 

            if (!isPNG && !isJPG && sizeFile) {
                messageApi.error(`File is not a valid image file`);
            }
            // if (!sizeFile) { // 5MB limit
            //     messageApi.error(`File size exceeds the 5MB limit.`);
            // }
            return isPNG || isJPG || sizeFile ||  Upload.LIST_IGNORE;
        },
        onChange: (info) => {
            console.log(info.fileList);
        },
    };

    // UPLOAD image to cloudinary
    const onUpload = async (file: File) => {

        try {
            // Verify the size of the file in formData
            const fileSize = file.size;
            if (fileSize > 5 * 1024 * 1024) { // 5MB limit
                throw new Error("File size exceeds the 5MB limit.");
            }

            setIsUploading(true); // Indicar que la subida está en progreso

            const formData = new FormData();
            formData.append("image", file);




            const response = await fetch("http://localhost:3000/api/upload", {
                method: "POST",
                body: formData,

            });
            console.log("RESPPONSE:", response) // Verificar la respuesta
            if (response.status === 200) {
                const dataImage = await response.json();
                await messageApi.success("Uploaded Image:");
                if (dataImage.url) {
                    setImgUrl(dataImage.url);
                }
            }

        } catch (error) {

            messageApi.warning("Upload failed: " + error); // Mostrar mensaje de error
            console.log("Upload failed:", error);
        } finally {
            setIsUploading(false); // Restablecer el estado
        }
    };

    return (
        <>
            {contextHolder}
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Upload
                    {...props}
                    listType="picture"
                    maxCount={1}
                    onChange={(info) => {
                        const file = info.fileList[0]?.originFileObj;
                        if (file && !isUploading) {
                            onUpload(file); // Llamar a la función de subida
                        }
                    }}
                >
                    <Button icon={<UploadOutlined />}>Banner (Max: 1)</Button>
                </Upload>

                <Upload
                    {...props}
                    onRemove={() => {
                        setImgUrl(null); // Eliminar la imagen al eliminar un archivo
                    }}
                    listType="picture"
                    maxCount={9}
                    multiple
                    onChange={async (info) => {
                        // Verificar si la acción fue eliminar un archivo
                        if (info.fileList.length < prevFileListLength) {
                            setPrevFileListLength(info.fileList.length);
                            return; // Evitar ejecutar `onUpload` si la acción fue eliminar
                        }

                        setPrevFileListLength(info.fileList.length); // Actualizar longitud previa

                        // Subir el último archivo añadido
                        const lastFile = info.fileList[info.fileList.length - 1];
                        if (lastFile?.originFileObj && !isUploading) {
                            await onUpload(lastFile.originFileObj as File);
                            console.log("URL:", imgUrl);
                        }
                    }}
                >
                    <Button icon={<UploadOutlined />}>Album (Max: 9)</Button>
                </Upload>
            </Space>
        </>
    );
};

export default ImageUploader;
