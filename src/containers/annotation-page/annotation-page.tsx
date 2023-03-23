import { connect } from 'react-redux';
import AnnotationPageComponent from '@/components/annotation-page/annotation-page';
import {
    getJobAsync, saveLogsAsync, changeFrameAsync,
    closeJob as closeJobAction,
} from '@/actions/annotation-actions';

import { CombinedState, Workspace } from '@/reducers';
import { withRouter } from '@/utils/withRouter';

interface StateToProps {
    job: any | null | undefined;
    frameNumber: number;
    fetching: boolean;
    workspace: Workspace;
}

interface DispatchToProps {
    getJob(): void;
    changeFrame(frame: number): void;
    saveLogs(): void;
    closeJob(): void;
}

function mapStateToProps(state: CombinedState, own: any): StateToProps {
    const { params } = own.router;
    const jobID = +params.jid;
    const {
        annotation: {
            job: { requestedId, instance: job, fetching },
            workspace,
            player: {
                frame: {
                    number: frameNumber,
                },
            },
        },
    } = state;

    return {
        job: jobID === requestedId || (Number.isNaN(jobID) && Number.isNaN(requestedId)) ? job : null,
        fetching,
        workspace,
        frameNumber,
    };
}

function mapDispatchToProps(dispatch: any, own: any): DispatchToProps {
    const { params } = own.router;
    const taskID = +params.tid;
    const jobID = +params.jid;
    const searchParams = new URLSearchParams(window.location.search);
    const initialFilters: object[] = [];
    let initialFrame: number | null = null;

    if (searchParams.has('frame')) {
        const searchFrame = +(searchParams.get('frame') as string);
        if (!Number.isNaN(searchFrame)) {
            initialFrame = searchFrame;
        }
    }

    if (searchParams.has('serverID') && searchParams.has('type')) {
        const serverID = searchParams.get('serverID');
        const type = searchParams.get('type');
        if (serverID && !Number.isNaN(+serverID)) {
            initialFilters.push({
                and: [{ '==': [{ var: 'serverID' }, serverID] }, { '==': [{ var: 'type' }, type] }],
            });
        }
    }

    if (searchParams.has('frame') || searchParams.has('object')) {
        own.router.navigate(own.history.location.pathname, { replace: true });
    }

    return {
        getJob(): void {
            dispatch(getJobAsync(taskID, jobID, initialFrame, initialFilters));
        },
        saveLogs(): void {
            dispatch(saveLogsAsync());
        },
        closeJob(): void {
            dispatch(closeJobAction());
        },
        changeFrame(frame: number): void {
            dispatch(changeFrameAsync(frame));
        },
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnnotationPageComponent));
