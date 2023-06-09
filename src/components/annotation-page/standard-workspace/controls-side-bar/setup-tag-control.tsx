import React from 'react';
import Popover from 'antd/lib/popover';
import Icon from '@ant-design/icons';

import { Canvas } from '@/canvas-wrapper';
import { TagIcon } from '@/icons';

import SetupTagPopoverContainer from '@/containers/annotation-page/standard-workspace/controls-side-bar/setup-tag-popover';
import withVisibilityHandling from './handle-popover-visibility';

export interface Props {
    canvasInstance: Canvas;
    disabled?: boolean;
}

const CustomPopover = withVisibilityHandling(Popover, 'setup-tag');
function SetupTagControl(props: Props): JSX.Element {
    const { disabled } = props;

    return disabled ? (
        <Icon className='cvat-setup-tag-control cvat-disabled-canvas-control' component={TagIcon} />
    ) : (
        <CustomPopover placement='right' content={<SetupTagPopoverContainer />}>
            <Icon className='cvat-setup-tag-control' component={TagIcon} />
        </CustomPopover>
    );
}

export default React.memo(SetupTagControl);
