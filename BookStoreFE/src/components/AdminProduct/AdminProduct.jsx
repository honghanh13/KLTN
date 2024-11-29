import React, { useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Input, Modal } from "antd";
import {PlusOutlined} from '@ant-design/icons'
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";

const AdminProduct = () => {
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [stateProduct, setStateProduct] = useState({
        name:'',
        image:'',
        type:'',
        countInStock:'',
        price:'',
        rating:'',
        description:''
    });
   
    const handleCancel = () => {
        setIsModalOpen(false);
      };
    const onFinish = () => {
        console.log('finish', stateProduct)
    }
    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }
    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
            <div style ={{marginTop: '10px'}}>
                <Button style ={{height:'150px', width:'150px', borderRadius:'6px',borderStyle: 'dashed' }} onClick = {() => setIsModalOpen(true)}><PlusOutlined style ={{fontSize: '60px'}}/></Button>
            </div>
            <div style = {{marginTop: '20px'}}>
                <TableComponent />
            </div>    
            <Modal title="Tạo sản phẩm" open={isModalOpen}  onCancel={handleCancel}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="Name"
                    rules={[{ required: true, message: 'Please input your Name!' }]}
                >
                <InputComponent value ={setStateProduct.name} onChange ={handleOnchange} name ="name"/>
                </Form.Item>
                
                <Form.Item
                    label="Type"
                    name="Type"
                    rules={[{ required: true, message: 'Please input your Type!' }]}
                >
                <InputComponent value ={setStateProduct.type} onChange ={handleOnchange} name ="type"/>
                </Form.Item>
                <Form.Item
                    label="Count inStock"
                    name="Count inStock"
                    rules={[{ required: true, message: 'Please input your price!' }]}
                >
                <InputComponent value ={setStateProduct.countInStock} onChange ={handleOnchange} name ="countInStock"/>
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="Price"
                    rules={[{ required: true, message: 'Please input your Price!' }]}
                >
                <InputComponent value ={setStateProduct.price} onChange ={handleOnchange} name ="price"/>
                </Form.Item>
                <Form.Item
                    label="Rating"
                    name="Rating"
                    rules={[{ required: true, message: 'Please input your Rating!' }]}
                >
                <InputComponent value ={setStateProduct.rating} onChange ={handleOnchange} name ="rating"/>
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="Description"
                    rules={[{ required: true, message: 'Please input your Description!' }]}
                >
                <InputComponent value ={setStateProduct.description} onChange ={handleOnchange} name ="description"/>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span:16}}>
                <Button type="primary" htmlType="submit">
                    Tạo
                </Button>
                </Form.Item>
  </Form>
            </Modal>   
        </div>
        // video 38: 20:42p
        
    )

}

export default AdminProduct