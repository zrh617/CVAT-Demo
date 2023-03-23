import { connect } from 'react-redux';
import { Task, TasksQuery, CombinedState } from '@/reducers';
import TasksPageComponent from '@/components/tasks-page/tasks-page';

interface StateToProps {
    fetching: boolean;
    query: TasksQuery;
    count: number;
    countInvisible: number;
    importing: boolean;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const { tasks } = state;
    console.log(state, 'state111');

    return {
        fetching: state.tasks.fetching,
        query: tasks.gettingQuery,
        count: state.tasks.count,
        countInvisible: tasks.hideEmpty ?
            tasks.current.filter((task: Task): boolean => !task.instance.jobs.length).length :
            0,
        importing: state.import.tasks.backup.importing,
    };
}

export default connect(mapStateToProps)(TasksPageComponent);
