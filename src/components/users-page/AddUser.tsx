import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface Props {
    isOpenAddDialog: boolean
    openAddDialog: Function
    openEditDialog: Function
    add: Function,
    edit: Function,
    type: string
    formData: any
}

const AddUsers: React.FC<Props> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const { setFieldsValue } = form;
    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        props.openAddDialog()
     
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
        setIsModalOpen(false);
      
        if(props.type == "add"){
            messageApi.success('新建成员成功');
            props.add();
        }else{
            messageApi.success('编辑成员成功');
            props.edit();
        }
        // 数据传给后端
      };
      
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        messageApi.error('数据填写不完整');
      };

      // 关闭弹窗后清空表单
      const close = () => {
          console.log("close")
          form.resetFields();
      }

    useEffect(() => {
        props.isOpenAddDialog && showModal()
        // 如果是编辑的话，需要拿到数据渲染在form表单上面
        if(props.type == "edit"){
            setFieldsValue({name: props.formData.name, nickName: props.formData.nickName})
        }
    }, [props.isOpenAddDialog])

    return (
        <>
              {contextHolder}
            <Modal title={props.type == "add" ? "新建成员" : "编辑成员"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} afterClose={close}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="成员名称"
                        name="name"
                        rules={[{ required: true, message: '请输入成员名称' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="成员昵称"
                        name="nickName"
                        rules={[{ required: true, message: '请输入成员昵称' }]}
                    >
                            <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddUsers;