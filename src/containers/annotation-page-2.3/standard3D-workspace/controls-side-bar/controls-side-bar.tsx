// Copyright (C) 2021-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { connect } from 'react-redux';
import { KeyMap } from '@/utils/mousetrap-react';
import { Canvas } from '@/canvas-wrapper';
import { Canvas3d } from '@/canvas3d-wrapper';
import {
    groupObjects,
    pasteShapeAsync,
    redrawShapeAsync,
    repeatDrawShapeAsync,
    resetAnnotationsGroup,
} from '@/actions/annotation-actions-2.3';
import ControlsSideBarComponent from '@/components/annotation-page-2.3/standard3D-workspace/controls-side-bar/controls-side-bar';
import { ActiveControl, CombinedState } from '@/reducers';

interface StateToProps {
    canvasInstance: Canvas | Canvas3d;
    activeControl: ActiveControl;
    keyMap: KeyMap;
    normalizedKeyMap: Record<string, string>;
    labels: any[];
    jobInstance: any;
}

interface DispatchToProps {
    repeatDrawShape(): void;
    redrawShape(): void;
    pasteShape(): void;
    resetGroup(): void;
    groupObjects(enabled: boolean): void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        annotation: {
            canvas: { instance: canvasInstance, activeControl },
            job: { labels, instance: jobInstance },
        },
        shortcuts: { keyMap, normalizedKeyMap },
    } = state;

    return {
        canvasInstance,
        activeControl,
        normalizedKeyMap,
        keyMap,
        labels,
        jobInstance,
    };
}

function dispatchToProps(dispatch: any): DispatchToProps {
    return {
        repeatDrawShape(): void {
            dispatch(repeatDrawShapeAsync());
        },
        redrawShape(): void {
            dispatch(redrawShapeAsync());
        },
        pasteShape(): void {
            dispatch(pasteShapeAsync());
        },
        groupObjects(enabled: boolean): void {
            dispatch(groupObjects(enabled));
        },
        resetGroup(): void {
            dispatch(resetAnnotationsGroup());
        },
    };
}

export default connect(mapStateToProps, dispatchToProps)(ControlsSideBarComponent as any);
