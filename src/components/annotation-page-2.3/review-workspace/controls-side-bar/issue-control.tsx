// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Icon from '@ant-design/icons';

import { ActiveControl } from '@/reducers';
import { Canvas } from '@/canvas-wrapper';
import { RectangleIcon } from '@/icons';
import CVATTooltip from '@/components/common/cvat-tooltip';

interface Props {
    canvasInstance: Canvas;
    activeControl: ActiveControl;
    disabled: boolean;
    selectIssuePosition(enabled: boolean): void;
}

function CreateIssueControl(props: Props): JSX.Element {
    const {
        activeControl, canvasInstance, selectIssuePosition, disabled,
    } = props;

    return (
        disabled ? (
            <Icon component={RectangleIcon} className='cvat-issue-control cvat-disabled-canvas-control' />
        ) : (
            <CVATTooltip title='Open an issue' placement='right'>
                <Icon
                    component={RectangleIcon}
                    className={
                        activeControl === ActiveControl.OPEN_ISSUE ?
                            'cvat-issue-control cvat-active-canvas-control' :
                            'cvat-issue-control'
                    }
                    onClick={(): void => {
                        if (activeControl === ActiveControl.OPEN_ISSUE) {
                            canvasInstance.selectRegion(false);
                            selectIssuePosition(false);
                        } else {
                            canvasInstance.cancel();
                            canvasInstance.selectRegion(true);
                            selectIssuePosition(true);
                        }
                    }}
                />
            </CVATTooltip>
        )
    );
}

export default React.memo(CreateIssueControl);
