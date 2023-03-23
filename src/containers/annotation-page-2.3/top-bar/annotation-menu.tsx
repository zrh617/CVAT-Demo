// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { connect } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MenuInfo } from 'rc-menu/lib/interface';

import { CombinedState, JobStage } from '@/reducers';
import AnnotationMenuComponent, { Actions } from '@/components/annotation-page-2.3/top-bar/annotation-menu';
import { updateJobAsync } from '@/actions/tasks-actions';
import {
    saveAnnotationsAsync,
    setForceExitAnnotationFlag as setForceExitAnnotationFlagAction,
    removeAnnotationsAsync as removeAnnotationsAsyncAction,
} from '@/actions/annotation-actions-2.3';
import { exportActions } from '@/actions/export-actions';
import { importActions } from '@/actions/import-actions';
import { getCore } from '@/core-wrapper';
import { withRouter } from '@/utils/withRouter';

const core = getCore();

interface StateToProps {
    jobInstance: any;
    stopFrame: number;
    router?: any;
}

interface DispatchToProps {
    showExportModal: (jobInstance: any) => void;
    showImportModal: (jobInstance: any) => void;
    removeAnnotations(startnumber: number, endnumber: number, delTrackKeyframesOnly: boolean): void;
    setForceExitAnnotationFlag(forceExit: boolean): void;
    saveAnnotations(jobInstance: any, afterSave?: () => void): void;
    updateJob(jobInstance: any): void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        annotation: {
            job: {
                instance: jobInstance,
                instance: { stopFrame },
            },
        },
    } = state;

    return {
        jobInstance,
        stopFrame,
    };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        showExportModal(jobInstance: any): void {
            dispatch(exportActions.openExportDatasetModal(jobInstance));
        },
        showImportModal(jobInstance: any): void {
            dispatch(importActions.openImportDatasetModal(jobInstance));
        },
        removeAnnotations(startnumber: number, endnumber: number, delTrackKeyframesOnly:boolean) {
            dispatch(removeAnnotationsAsyncAction(startnumber, endnumber, delTrackKeyframesOnly));
        },
        setForceExitAnnotationFlag(forceExit: boolean): void {
            dispatch(setForceExitAnnotationFlagAction(forceExit));
        },
        saveAnnotations(jobInstance: any, afterSave?: () => void): void {
            dispatch(saveAnnotationsAsync(jobInstance, afterSave));
        },
        updateJob(jobInstance: any): void {
            dispatch(updateJobAsync(jobInstance));
        },
    };
}

type Props = StateToProps & DispatchToProps;

function AnnotationMenuContainer(props: Props): JSX.Element {
    const {
        jobInstance,
        stopFrame,
        router,
        showExportModal,
        showImportModal,
        removeAnnotations,
        setForceExitAnnotationFlag,
        saveAnnotations,
        updateJob,
    } = props;

    const onClickMenu = (params: MenuInfo): void => {
        const [action] = params.keyPath;
        if (action === Actions.EXPORT_JOB_DATASET) {
            showExportModal(jobInstance);
        } else if (action === Actions.RENEW_JOB) {
            jobInstance.state = core.enums.JobState.NEW;
            jobInstance.stage = JobStage.ANNOTATION;
            updateJob(jobInstance);
            window.location.reload();
        } else if (action === Actions.FINISH_JOB) {
            jobInstance.stage = JobStage.ACCEPTANCE;
            jobInstance.state = core.enums.JobState.COMPLETED;
            updateJob(jobInstance);
            router.navigate(`/tasks/${jobInstance.taskId}`);
        } else if (action === Actions.OPEN_TASK) {
            router.navigate(`/tasks/${jobInstance.taskId}`);
        } else if (action.startsWith('state:')) {
            [, jobInstance.state] = action.split(':');
            updateJob(jobInstance);
            window.location.reload();
        } else if (action === Actions.LOAD_JOB_ANNO) {
            showImportModal(jobInstance);
        }
    };

    return (
        <AnnotationMenuComponent
            taskMode={jobInstance.mode}
            onClickMenu={onClickMenu}
            removeAnnotations={removeAnnotations}
            setForceExitAnnotationFlag={setForceExitAnnotationFlag}
            saveAnnotations={saveAnnotations}
            jobInstance={jobInstance}
            stopFrame={stopFrame}
        />
    );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnnotationMenuContainer));
