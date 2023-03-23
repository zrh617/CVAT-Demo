import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message } from 'antd';

interface Props {
    isOpenAddProject: boolean
    openAddProjectDialog: Function
    openEditProjectDialog: Function
    addProject: Function
    type: string
    formData: any
}

const newProject: React.FC<Props> = (props) => {
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
        props.openAddProjectDialog()
     
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
        setIsModalOpen(false);
        props.addProject()
        if(props.type == "add"){
            messageApi.success('新建项目成功');
        }else{
            messageApi.success('编辑项目成功');
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
        props.isOpenAddProject && showModal()
        // 如果是编辑的话，需要拿到数据渲染在form表单上面
        if(props.type == "edit"){
            setFieldsValue({projectName: props.formData.projectName, projectDesc: props.formData.projectDesc})
        }
    }, [props.isOpenAddProject])

    return (
        <>
              {contextHolder}
            <Modal title={props.type == "add" ? "新建项目" : "编辑项目"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} afterClose={close}>
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
                        label="项目名称"
                        name="projectName"
                        rules={[{ required: true, message: '请输入项目名称' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="项目描述"
                        name="projectDesc"
                        rules={[{ required: true, message: '请输入项目描述' }]}
                    >
                          <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default newProject;