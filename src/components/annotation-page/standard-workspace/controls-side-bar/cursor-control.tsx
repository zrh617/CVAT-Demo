import React from 'react';
import Icon from '@ant-design/icons';

import { CursorIcon } from '@/icons';
import { ActiveControl } from '@/reducers';
import { Canvas } from '@/canvas-wrapper';
import { Canvas3d } from '@/canvas3d-wrapper';
import CVATTooltip from '@/components/common/cvat-tooltip';

export interface Props {
    canvasInstance: Canvas | Canvas3d;
    cursorShortkey: string;
    activeControl: ActiveControl;
}

function CursorControl(props: Props): JSX.Element {
    const { canvasInstance, activeControl, cursorShortkey } = props;

    return (
        <CVATTooltip title={`Cursor ${cursorShortkey}`} placement='right'>
            <Icon
                component={CursorIcon}
                className={
                    activeControl === ActiveControl.CURSOR ?
                        'cvat-active-canvas-control cvat-cursor-control' :
                        'cvat-cursor-control'
                }
                onClick={activeControl !== ActiveControl.CURSOR ? (): void => canvasInstance.cancel() : undefined}
            />
        </CVATTooltip>
    );
}

export default React.memo(CursorControl);
