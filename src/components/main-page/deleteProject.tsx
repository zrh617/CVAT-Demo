import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface Props {
    isOpenDeleteProject: boolean
    openDeteleProjectDialog: Function
    deleteProject: Function,
}

const deleteProject: React.FC<Props> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        props.deleteProject();
        messageApi.success('删除项目成功');
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        props.openDeteleProjectDialog()
     
    };

    const onFinish = (values: any) => {
        console.log('Success:', values );
        // 数据传给后端
      };
      
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

      const close = () => {
          console.log("close")
      }

    useEffect(() => {
        console.log("props",props)
        props.isOpenDeleteProject && showModal()
    }, [props.isOpenDeleteProject])

    return (
        <>
            {contextHolder}
            <Modal title="删除项目" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} afterClose={close}>
                <p>是否删除该项目？</p>
            </Modal>
        </>
    );
};

export default deleteProject;