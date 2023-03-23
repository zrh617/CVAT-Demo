import './styles.scss';
import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Spin from 'antd/lib/spin';
import Result from 'antd/lib/result';

import DetailsContainer from '@/containers/task-page/details';
import JobListContainer from '@/containers/task-page/job-list';
import ModelRunnerModal from '@/components/model-runner-modal/model-runner-dialog';
import CVATLoadingSpinner from '@/components/common/loading-spinner';
import MoveTaskModal from '@/components/move-task-modal/move-task-modal';
import { Task } from '@/reducers';
import TopBarComponent from './top-bar';
import { withRouter } from '@/utils/withRouter';

interface TaskPageComponentProps {
    task: Task | null | undefined;
    fetching: boolean;
    updating: boolean;
    jobUpdating: boolean;
    deleteActivity: boolean | null;
    installedGit: boolean;
    getTask: () => void;
    router: any;
}

type Props = TaskPageComponentProps;

class TaskPageComponent extends React.PureComponent<Props> {
    public componentDidMount(): void {
        const { task, fetching, getTask } = this.props;
        console.log(this.props, 'props');

        if (task === null && !fetching) {
            console.log(task, 'task123');
            getTask();
        }
    }

    public componentDidUpdate(prevProps: Props): void {
        const {
            deleteActivity, router, task, fetching, getTask, jobUpdating,
        } = this.props;

        const jobUpdated = prevProps.jobUpdating && !jobUpdating;
        if ((task === null && !fetching) || jobUpdated) {
            getTask();
        }

        if (deleteActivity) {
            router.navigate('/tasks');
        }
    }

    public render(): JSX.Element {
        const { task, updating, fetching } = this.props;

        if (task === null || (fetching && !updating)) {
            return <Spin size='large' className='cvat-spinner' />;
        }

        if (typeof task === 'undefined') {
            return (
                <Result
                    className='cvat-not-found'
                    status='404'
                    title='Sorry, but this task was not found'
                    subTitle='Please, be sure information you tried to get exist and you have access'
                />
            );
        }
        console.log(task, 'task5698');
        

        return (
            <div className='cvat-task-page'>
                { updating ? <CVATLoadingSpinner size='large' /> : null }
                <Row
                    justify='center'
                    align='top'
                    className='cvat-task-details-wrapper'
                >
                    <Col md={22} lg={18} xl={16} xxl={14}>
                        <TopBarComponent taskInstance={(task as Task).instance} />
                        <DetailsContainer task={task as Task} />
                        <JobListContainer task={task as Task} />
                    </Col>
                </Row>
                <ModelRunnerModal />
                <MoveTaskModal />
            </div>
        );
    }
}

export default withRouter(TaskPageComponent);
