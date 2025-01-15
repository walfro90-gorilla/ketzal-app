import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Space, Upload } from 'antd';
import { Label } from '@radix-ui/react-dropdown-menu';

const ImageUploader: React.FC = () => (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* <Label>Banner:</Label> */}
        <Upload
            // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture"
            maxCount={1}
        >
            <Button icon={<UploadOutlined />}>Banner (Max: 1)</Button>
        </Upload>

        <Upload
            // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture"
            maxCount={9}
            multiple
        >
            <Button icon={<UploadOutlined />}>Album (Max: 9)</Button>
        </Upload>
    </Space>
);

export default ImageUploader;