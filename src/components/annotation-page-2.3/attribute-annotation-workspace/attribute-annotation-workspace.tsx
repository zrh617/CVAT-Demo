// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import Layout from 'antd/lib/layout';

import CanvasWrapperContainer from '@/containers/annotation-page-2.3/canvas/canvas-wrapper';
import AttributeAnnotationSidebar from './attribute-annotation-sidebar/attribute-annotation-sidebar';

export default function AttributeAnnotationWorkspace(): JSX.Element {
    return (
        <Layout hasSider className='attribute-annotation-workspace'>
            <CanvasWrapperContainer />
            <AttributeAnnotationSidebar />
        </Layout>
    );
}
