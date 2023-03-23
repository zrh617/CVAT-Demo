import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import { LeftOutlined, MoreOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Text from 'antd/lib/typography/Text';

import ActionsMenuContainer from '@/containers/actions-menu/actions-menu';
import { useNavigate } from 'react-router-dom';

interface DetailsComponentProps {
    taskInstance: any;
}

export default function DetailsComponent(props: DetailsComponentProps): JSX.Element {
    const { taskInstance } = props;

    const navigate = useNavigate();

    return (
        <Row className='cvat-task-top-bar' justify='space-between' align='middle'>
            <Col>
                {taskInstance.projectId ? (
                    <Button
                        onClick={() => navigate(`/projects/${taskInstance.projectId}`)}
                        type='link'
                        size='large'
                    >
                        <LeftOutlined />
                        Back to project
                    </Button>
                ) : (
                    <Button onClick={() => navigate('/tasks')} type='link' size='large'>
                        <LeftOutlined />
                        Back to tasks
                    </Button>
                )}
            </Col>
            <Col>
                <Dropdown overlay={<ActionsMenuContainer taskInstance={taskInstance} />}>
                    <Button size='middle' className='cvat-task-page-actions-button'>
                        <Text className='cvat-text-color'>Actions</Text>
                        <MoreOutlined className='cvat-menu-icon' />
                    </Button>
                </Dropdown>
            </Col>
        </Row>
    );
}
