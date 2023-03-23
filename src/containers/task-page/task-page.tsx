import { connect } from 'react-redux';
import { getTasksAsync } from '@/actions/tasks-actions';
import TaskPageComponent from '@/components/task-page/task-page';
import { Task, CombinedState } from '@/reducers';
import { withRouter } from '@/utils/withRouter';

interface StateToProps {
    task: Task | null | undefined;
    fetching: boolean;
    updating: boolean;
    jobUpdating: boolean;
    deleteActivity: boolean | null;
    installedGit: boolean;
}

interface DispatchToProps {
    getTask: () => void;
}

function mapStateToProps(state: CombinedState, own: any): StateToProps {
    const { list } = state.plugins;
    const { tasks } = state;
    const {
        gettingQuery, fetching, updating,
    } = tasks;
    const { deletes, jobUpdates } = tasks.activities;

    const id = +own.router?.params?.id;
    const filteredTasks = state.tasks.current.filter((task) => task.instance.id === id);
    const task = filteredTasks[0] || (gettingQuery.id === id || Number.isNaN(id) ? undefined : null);

    let deleteActivity: any = null;
    if (task && id in deletes) {
        deleteActivity = deletes[id];
    }

    const jobIDs = task ? Object.fromEntries(task.instance.jobs.map((job:any) => [job.id])) : {};
    const updatingJobs = Object.keys(jobUpdates);
    const jobUpdating = updatingJobs.some((jobID) => jobID in jobIDs);

    return {
        task,
        jobUpdating,
        deleteActivity,
        fetching,
        updating,
        installedGit: list.GIT_INTEGRATION,
    };
}

function mapDispatchToProps(dispatch: any, own: any): DispatchToProps {
    const id = +own.router?.params?.id;

    return {
        getTask: (): void => {
            dispatch(
                getTasksAsync({ id }),
            );
        },
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TaskPageComponent));
