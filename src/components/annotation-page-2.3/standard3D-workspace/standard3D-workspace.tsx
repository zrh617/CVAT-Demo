// Copyright (C) 2021-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import Layout from 'antd/lib/layout';

import CanvasWrapperContainer from '@/containers/annotation-page-2.3/canvas/canvas-wrapper3D';
import ControlsSideBarContainer from '@/containers/annotation-page-2.3/standard3D-workspace/controls-side-bar/controls-side-bar';
import ObjectSideBarComponent from '@/components/annotation-page-2.3/standard-workspace/objects-side-bar/objects-side-bar';
import ObjectsListContainer from '@/containers/annotation-page-2.3/standard-workspace/objects-side-bar/objects-list';
import CanvasContextMenuContainer from '@/containers/annotation-page-2.3/canvas/canvas-context-menu';
import CanvasPointContextMenuComponent from '@/components/annotation-page-2.3/canvas/canvas-point-context-menu';
import RemoveConfirmComponent from '@/components/annotation-page-2.3/standard-workspace/remove-confirm';
import PropagateConfirmComponent from '@/components/annotation-page-2.3/standard-workspace/propagate-confirm';

export default function StandardWorkspace3DComponent(): JSX.Element {
    return (
        <Layout hasSider className='cvat-standard-workspace'>
            <ControlsSideBarContainer />
            <CanvasWrapperContainer />
            <ObjectSideBarComponent objectsList={<ObjectsListContainer readonly={false} />} />
            <PropagateConfirmComponent />
            <CanvasContextMenuContainer />
            <CanvasPointContextMenuComponent />
            <RemoveConfirmComponent />
        </Layout>
    );
}
