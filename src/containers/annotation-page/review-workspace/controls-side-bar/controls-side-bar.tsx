import { connect } from 'react-redux';

import { Canvas } from '@/canvas-wrapper';
import { selectIssuePosition as selectIssuePositionAction, rotateCurrentFrame } from '@/actions/annotation-actions';
import ControlsSideBarComponent from '@/components/annotation-page/review-workspace/controls-side-bar/controls-side-bar';
import { ActiveControl, CombinedState, Rotation } from '@/reducers';
import { KeyMap } from '@/utils/mousetrap-react';

interface StateToProps {
    canvasInstance: Canvas;
    rotateAll: boolean;
    activeControl: ActiveControl;
    keyMap: KeyMap;
    normalizedKeyMap: Record<string, string>;
    frameIsDeleted: boolean;
}

interface DispatchToProps {
    rotateFrame(angle: Rotation): void;
    selectIssuePosition(enabled: boolean): void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        annotation: {
            canvas: { instance: canvasInstance, activeControl },
            player: { frame: { data: { deleted: frameIsDeleted } } },
        },
        settings: {
            player: { rotateAll },
        },
        shortcuts: { keyMap, normalizedKeyMap },
    } = state;

    return {
        rotateAll,
        canvasInstance: canvasInstance as Canvas,
        activeControl,
        normalizedKeyMap,
        keyMap,
        frameIsDeleted,
    };
}

function dispatchToProps(dispatch: any): DispatchToProps {
    return {
        selectIssuePosition(enabled: boolean): void {
            dispatch(selectIssuePositionAction(enabled));
        },
        rotateFrame(rotation: Rotation): void {
            dispatch(rotateCurrentFrame(rotation));
        },
    };
}

export default connect(mapStateToProps, dispatchToProps)(ControlsSideBarComponent);
