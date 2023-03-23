// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import Layout from 'antd/lib/layout';

import CanvasWrapperContainer from '@/containers/annotation-page-2.3/canvas/canvas-wrapper';
import RemoveConfirmComponent from '@/components/annotation-page-2.3/standard-workspace/remove-confirm';
import TagAnnotationSidebar from './tag-annotation-sidebar/tag-annotation-sidebar';

export default function TagAnnotationWorkspace(): JSX.Element {
    return (
        <Layout hasSider className='cvat-tag-annotation-workspace'>
            <CanvasWrapperContainer />
            <TagAnnotationSidebar />
            <RemoveConfirmComponent />
        </Layout>
    );
}
