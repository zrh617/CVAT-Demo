import './styles.scss';
import React from 'react';
import Layout from 'antd/lib/layout';

import ControlsSideBarContainer from '@/containers/annotation-page/standard3D-workspace/controls-side-bar/controls-side-bar';
import ObjectSideBarComponent from '@/components/annotation-page/standard-workspace/objects-side-bar/objects-side-bar';
import ObjectsListContainer from '@/containers/annotation-page/standard-workspace/objects-side-bar/objects-list';
import CanvasContextMenuContainer from '@/containers/annotation-page/canvas/canvas-context-menu';
// import CanvasPointContextMenuComponent from '@/components/annotation-page/canvas/canvas-point-context-menu';
import RemoveConfirmComponent from '@/components/annotation-page/standard-workspace/remove-confirm';

export default function StandardWorkspace3DComponent(): JSX.Element {
    return (
        <Layout hasSider className='cvat-standard-workspace'>
            <ControlsSideBarContainer />
            {/* <CanvasWrapperContainer curZLayer={0} automaticBordering={false} showObjectsTextAlways={false} /> */}
            <ObjectSideBarComponent objectsList={<ObjectsListContainer />} />
            <CanvasContextMenuContainer />
            {/* <CanvasPointContextMenuComponent /> */}
            <RemoveConfirmComponent />
        </Layout>
    );
}
