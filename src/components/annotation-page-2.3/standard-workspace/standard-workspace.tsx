// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporations
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import Layout from 'antd/lib/layout';

import CanvasWrapperContainer from '@/containers/annotation-page-2.3/canvas/canvas-wrapper';
import ControlsSideBarContainer from '@/containers/annotation-page-2.3/standard-workspace/controls-side-bar/controls-side-bar';
import CanvasContextMenuContainer from '@/containers/annotation-page-2.3/canvas/canvas-context-menu';
import ObjectsListContainer from '@/containers/annotation-page-2.3/standard-workspace/objects-side-bar/objects-list';
import ObjectSideBarComponent from '@/components/annotation-page-2.3/standard-workspace/objects-side-bar/objects-side-bar';
import CanvasPointContextMenuComponent from '@/components/annotation-page-2.3/canvas/canvas-point-context-menu';
// import IssueAggregatorComponent from '@/components/annotation-page-2.3/review/issues-aggregator';
import RemoveConfirmComponent from '@/components/annotation-page-2.3/standard-workspace/remove-confirm';
import PropagateConfirmComponent from '@/components/annotation-page-2.3/standard-workspace/propagate-confirm';

export default function StandardWorkspaceComponent(): JSX.Element {
    return (
        <Layout hasSider className='cvat-standard-workspace'>
            <ControlsSideBarContainer />
            <CanvasWrapperContainer />
            <ObjectSideBarComponent objectsList={<ObjectsListContainer readonly={false} />} />
            <PropagateConfirmComponent />
            <CanvasContextMenuContainer />
            <CanvasPointContextMenuComponent />
            {/* <IssueAggregatorComponent /> */}
            <RemoveConfirmComponent />
        </Layout>
    );
}
