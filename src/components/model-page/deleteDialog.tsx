import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';

interface Props {
    isOpenDialog: boolean
    openDialog: Function
    title: string,
    content: string,
    children?: any,
}

const deleteDialog: React.FC<Props> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const {isOpenDialog,openDialog,title,content, children, ...otherProps} = props

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        props.openDialog()
        messageApi.success(`${props.title}成功`);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        props.openDialog()
     
    };

      const close = () => {
          console.log("close")
      }

    useEffect(() => {
        props.isOpenDialog && showModal()
    }, [props.isOpenDialog])

    return (
        <>
            {contextHolder}
            <Modal title={props.title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}  {...otherProps}>
                <p>{props.content}</p>
            </Modal>
        </>
    );
};

export default deleteDialog;