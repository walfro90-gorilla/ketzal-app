import { NextResponse } from "next/server";
import { writeFile } from "fs";
import path from "path";

import { v2 as cloudinary } from 'cloudinary';
import { message } from "antd";

// Configuration
cloudinary.config({
    cloud_name: 'dgmmzh8nb',
    api_key: '766325626977677',
    api_secret: 'g0qgbgJNL8rsG2Ng4X9rP6oxpow' // Click 'View API Keys' above to copy your API secret
});

export async function POST(request) {
    const data = await request.formData()
    const image = data.get("image")

    if (!image) {
        return NextResponse.json("image not uploaded", { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Writefile to the public folder
    // const filePath = path.join(process.cwd(), "public", image.name)
    // console.log(filePath)
    // await writeFile(filePath, buffer, (err) => {
    //     if (err) {
    //         console.log(err)
    //         return NextResponse.json("image not uploaded", { status: 500 })
    //     }
    // })

    const response = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        }).end(buffer)
    })

    console.log("RESPONSEEE: ", response)



    return NextResponse.json({
        url: response.secure_url,
        name: response.original_filename,
        size: response.bytes,
        message: "image uploaded successfully"
    })
}