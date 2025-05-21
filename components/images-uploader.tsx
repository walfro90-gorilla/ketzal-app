import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Space, Upload, UploadProps, message } from "antd";

// Import the context and the hook  to use the context  from the ServiceContext
import { useServices } from "@/context/ServiceContext";

import ImgCrop from 'antd-img-crop';

const ImageUploader = () => {

    // Use the hook to get the context
    const { images, setImages }: { images: { imgBanner: string | null; imgAlbum: string[] }, setImages: React.Dispatch<React.SetStateAction<{ imgBanner: string | null; imgAlbum: string[] }>> } = useServices();

    const [isUploading, setIsUploading] = React.useState(false);
    const [prevFileListLength, setPrevFileListLength] = React.useState(0);

    // Message API for notifications
    const [messageApi, contextHolder] = message.useMessage();

    const props: UploadProps = {
        beforeUpload: (file) => {
            const isPNG = file.type === "image/png";
            const isJPG = file.type === "image/jpeg";
            const sizeFile = file.size <= 10 * 1024 * 1024; // Límite de 5MB

            if (!isPNG && !isJPG && sizeFile) {
                messageApi.error(`File is not a valid image file`);
            }
            return isPNG || isJPG || sizeFile || Upload.LIST_IGNORE;
        },
        onChange: (info) => {
            console.log(info.fileList);
        },
    };

    // UPLOAD image to cloudinary
    const onUpload = async (file: File, type: "banner" | "album") => {
        try {
            const fileSize = file.size;
            if (fileSize > 5 * 1024 * 1024) {
                throw new Error("File size exceeds the 5MB limit.");
            }

            setIsUploading(true);

            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("https://ketzal-app.vercel.app/api/upload", {
                method: "POST",
                body: formData,
            });

            if (response.status === 200) {
                const dataImage = await response.json();
                if (dataImage.url) {
                    if (type === "banner") {
                        setImages((prev) => ({
                            ...prev,
                            imgBanner: dataImage.url,
                        }));
                    } else if (type === "album") {
                        setImages((prev) => ({
                            ...prev,
                            imgAlbum: [...prev.imgAlbum, dataImage.url],
                        }));
                    }
                    messageApi.success("Image uploaded successfully!");
                    console.log("IMAGES:", images);
                }
            }
        } catch (error) {
            messageApi.error("Upload failed: " + error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                {/* Upload para el banner */}
                <ImgCrop
                    aspect={16/ 9}
                >

                    <Upload
                        {...props}
                        listType="picture"
                        maxCount={1}
                        onChange={(info) => {
                            const file = info.fileList[0]?.originFileObj;
                            if (file && !isUploading) {
                                onUpload(file, "banner");
                            }
                        }}
                        onRemove={() => {
                            setImages((prev) => ({ ...prev, imgBanner: null }));
                        }}
                    >

                        <Button icon={<UploadOutlined />}>Banner (Max: 1)</Button>
                    </Upload>
                </ImgCrop>

                {/* Upload para el álbum */}
                <ImgCrop
                    aspect={16/ 9}
                >
                    <Upload
                        {...props}
                        listType="picture"
                        maxCount={9}
                        // multiple
                        onChange={(info) => {
                            if (info.fileList.length < prevFileListLength) {
                                setPrevFileListLength(info.fileList.length);
                                return;
                            }
                            setPrevFileListLength(info.fileList.length);

                            // Only process files that are not yet uploaded (status !== 'done')
                            const newFiles = info.fileList.filter((file) => file.originFileObj && file.status !== "done");

                            newFiles.forEach(async (file) => {
                                if (!isUploading) {
                                    await onUpload(file.originFileObj as File, "album");
                                }
                            });
                        }}
                        onRemove={(file) => {
                            setImages((prev) => ({
                                ...prev,
                                imgAlbum: prev.imgAlbum.filter((url) => url !== file.url),
                            }));
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Album (Max: 9)</Button>
                    </Upload>
                </ImgCrop>

            </Space >
        </>
    );
};

export default ImageUploader;
