import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Upload, message, Select, Slider, Table} from 'antd';
import style from './modelVerify.module.scss'
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface'

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

// 上传组件
const UploadPhoto = (props) =>{
        const [previewOpen, setPreviewOpen] = useState(false);
        const [previewImage, setPreviewImage] = useState('');
        const [previewTitle, setPreviewTitle] = useState('');
        const [fileList, setFileList] = useState<UploadFile[]>([
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
              uid: '-xxx',
              percent: 50,
              name: 'image.png',
              status: 'uploading',
              url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
              uid: '-5',
              name: 'image.png',
              status: 'error',
            },
          ]);   
          const handleCancel = () => setPreviewOpen(false);

          const handlePreview = async (file: UploadFile) => {
            if (!file.url && !file.preview) {
              file.preview = await getBase64(file.originFileObj as RcFile);
            }
        
            setPreviewImage(file.url || (file.preview as string));
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
          };
        
          const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
            setFileList(newFileList);
        
          const uploadButton = (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          );
          return (
            <>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </>
          );
        };


interface Props {
    isOpenDialog: boolean
    openDialog: Function
    title: string,
}

const ModelVerify: React.FC<Props> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [versionData, setVersionData] = useState([]);
    const [params1, setParams1] = useState(0);
    const [params2, setParams2] = useState(0);
    const [params3, setParams3] = useState(0);
    const [validationData, setValidationData] = useState([]);
    const [validationTable, setValidationTable] = useState([]);

    const validationTitle = () => {
        return(
            <Select
                defaultValue="A"
                style={{ width: 120 }}
                options={validationData}
            />
        )
    }

    const columns = [
        {
            title: '模型版本',
            dataIndex: 'version',
            key: 'version'
        },
        {
            title: '验证集',
            dataIndex:'validation',
            key: 'validation'
        },
        {
            title: '参数1',
            dataIndex: 'params1',
            key: 'params1'
        },
        {
            title: '参数2',
            dataIndex: 'params2',
            key: 'params2'
        },
        {
            title: '结果',
            dataIndex: 'result',
            key: 'result'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text) => {
                return (
                    <Button onClick={deploy}>部署</Button>
                )
            }
        }
    ]

    // 部署
    const deploy = () => {
        console.log("部署")
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        // props.deleteData();
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

      const handleParams1 = (val) => {
        setParams1(val)
      }
      const handleParams2 = (val) => {
        setParams2(val)
      }
      const handleParams3 = (val) => {
        setParams3(val)
      }

      // 验证集验证
      const handleValidationSet = () => {
          let data:any = [{
            key: '1',
            version: 'V1',
            validation: '验证集A',
            params1: '1',
            params2: '2',
            result: 'OK'
          },
          {
            key: '2',
            version: 'V2',
            validation: '验证集A',
            params1: '1',
            params2: '2',
            result: 'NG'
          }]    
        setValidationTable(data)
      }


    useEffect(() => {
        console.log("props",props, props.openDialog,typeof( props.openDialog))
        props.isOpenDialog && showModal()
                // 获取数据并处理数据
                // 模型版本
                let data:any = [
                    {label: "V1", value: "1"},
                    {label: "V2", value: "2"},
                    {label: "V3", value: "3"},
                    {label: "V4", value: "4"}
                ]
            setVersionData(data)

            // 验证集
            let validationDatas:any = [
                {label: "验证集A", value: "A"},
                {label: "验证集B", value: "B"},
                {label: "验证集C", value: "C"},
                {label: "验证集D", value: "D"}
            ]
            setValidationData(validationDatas)
    }, [props.isOpenDialog])

    return (
        <>
            {contextHolder}
            <Modal title={props.title} open={isModalOpen} width="60%" footer={null}
            onOk={handleOk} onCancel={handleCancel} afterClose={close}>
                <div className={style.verify}>
                        <div className={style.content}>
                            <div className={style.verifyParam}>
                                <p>验证参数选择</p>
                                <div className={style.chooseVersion}>
                                    <span>选择模型版本</span>
                                    <Select
                                        defaultValue="1"
                                        style={{ width: 120 }}
                                        options={versionData}
                                    />
                                </div>
                                <div className={style.sliderBox}>
                                    <Slider  className={style.slider} defaultValue={params1} value={params1} onChange={handleParams1}/>
                                    <Slider  className={style.slider} defaultValue={params2} value={params2} onChange={handleParams2}/>
                                    <Slider  className={style.slider} defaultValue={params3} value={params3} onChange={handleParams3}/>
                                </div>
                            </div>
                            <div className={style.picture}>
                                <p>单图拖入验证</p>
                                <UploadPhoto></UploadPhoto>
                            </div>
                        </div>
                </div>
                <hr />
                <div className={style.verifyBtn}>
                        <Select
                            defaultValue="A"
                            style={{ width: 120 , marginRight: '20px'}}
                            options={validationData}
                        />
                        <Button onClick={handleValidationSet}>验证集验证</Button>
                </div>
                <Table columns={columns} dataSource={validationTable} v-show={validationTable.length > 0}/>;
            </Modal>
        </>
    );
};

export default ModelVerify;