// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Row, Col } from 'antd/lib/grid';
import {
    MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined,
} from '@ant-design/icons';
import Layout, { SiderProps } from 'antd/lib/layout';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import Button from 'antd/lib/button/button';
import Text from 'antd/lib/typography/Text';

import {
    createAnnotationsAsync,
    removeObject as removeObjectAction,
    changeFrameAsync,
    rememberObject,
} from '@/actions/annotation-actions-2.3';
import { Canvas } from '@/canvas-wrapper';
import { Canvas3d } from '@/canvas3d-wrapper';
import { getCore, Label, LabelType } from '@/core-wrapper';
import { CombinedState, ObjectType } from '@/reducers';
import { filterApplicableForType } from '@/utils/filter-applicable-labels';
import { adjustContextImagePosition } from '@/components/annotation-page-2.3/standard-workspace/context-image/context-image';
import LabelSelector from '@/components/label-selector/label-selector';
import isAbleToChangeFrame from '@/utils/is-able-to-change-frame';
import GlobalHotKeys, { KeyMap } from '@/utils/mousetrap-react';
import ShortcutsSelect from './shortcuts-select';

const cvat = getCore();

interface StateToProps {
    states: any[];
    labels: any[];
    jobInstance: any;
    canvasInstance: Canvas | Canvas3d;
    frameNumber: number;
    keyMap: KeyMap;
    normalizedKeyMap: Record<string, string>;
    frameData: any;
}

interface DispatchToProps {
    removeObject(objectState: any): void;
    createAnnotations(jobInstance: any, frame: number, objectStates: any[]): void;
    changeFrame(frame: number, fillBuffer?: boolean, frameStep?: number): void;
    onRememberObject(labelID: number): void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        annotation: {
            player: {
                frame: { number: frameNumber, data: frameData },
            },
            annotations: { states },
            job: { instance: jobInstance, labels },
            canvas: { instance: canvasInstance },
        },
        shortcuts: { keyMap, normalizedKeyMap },
    } = state;

    return {
        jobInstance,
        labels,
        states,
        canvasInstance: canvasInstance as Canvas | Canvas3d,
        frameNumber,
        keyMap,
        normalizedKeyMap,
        frameData,
    };
}

function mapDispatchToProps(dispatch: ThunkDispatch<CombinedState, {}, Action>): DispatchToProps {
    return {
        changeFrame(frame: number, fillBuffer?: boolean, frameStep?: number): void {
            dispatch(changeFrameAsync(frame, fillBuffer, frameStep));
        },
        createAnnotations(jobInstance: any, frame: number, objectStates: any[]): void {
            dispatch(createAnnotationsAsync(jobInstance, frame, objectStates));
        },
        removeObject(objectState: any): void {
            dispatch(removeObjectAction(objectState, false));
        },
        onRememberObject(labelID: number): void {
            dispatch(rememberObject({ activeObjectType: ObjectType.TAG, activeLabelID: labelID }));
        },
    };
}

function TagAnnotationSidebar(props: StateToProps & DispatchToProps): JSX.Element {
    const {
        states,
        labels,
        removeObject,
        jobInstance,
        changeFrame,
        canvasInstance,
        frameNumber,
        onRememberObject,
        createAnnotations,
        keyMap,
        frameData,
    } = props;

    const preventDefault = (event: KeyboardEvent | undefined): void => {
        if (event) {
            event.preventDefault();
        }
    };

    const [applicableLabels, setApplicableLabels] = useState<Label[]>(
        filterApplicableForType(LabelType.TAG, labels),
    );
    const controlsDisabled = !applicableLabels.length || frameData.deleted;
    const defaultLabelID = applicableLabels.length ? applicableLabels[0].id as number : null;

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [frameTags, setFrameTags] = useState([] as any[]);
    const [selectedLabelID, setSelectedLabelID] = useState<number | null>(defaultLabelID);
    const [skipFrame, setSkipFrame] = useState(false);

    useEffect(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, []);

    useEffect(() => {
        setApplicableLabels(filterApplicableForType(LabelType.TAG, labels));
    }, [labels]);

    useEffect(() => {
        const listener = (event: Event): void => {
            if (
                (event as TransitionEvent).propertyName === 'width' &&
                ((event.target as any).classList as DOMTokenList).contains('cvat-tag-annotation-sidebar')
            ) {
                canvasInstance.fitCanvas();
                canvasInstance.fit();
            }
        };

        const [sidebar] = window.document.getElementsByClassName('cvat-tag-annotation-sidebar') as any;

        sidebar.addEventListener('transitionend', listener);

        return () => {
            sidebar.removeEventListener('transitionend', listener);
        };
    }, []);

    useEffect(() => {
        const tags = states.filter((objectState: any): boolean => objectState.objectType === ObjectType.TAG);
        setFrameTags(tags);
    }, [states]);

    const siderProps: SiderProps = {
        className: 'cvat-tag-annotation-sidebar',
        theme: 'light',
        width: 300,
        collapsedWidth: 0,
        reverseArrow: true,
        collapsible: true,
        trigger: null,
        collapsed: sidebarCollapsed,
    };

    const onChangeLabel = (value: any): void => {
        setSelectedLabelID(value.id);
    };

    const onRemoveState = (labelID: number): void => {
        const objectState = frameTags.find((tag: any): boolean => tag.label.id === labelID);
        if (objectState) removeObject(objectState);
    };

    const onChangeFrame = (): void => {
        const frame = Math.min(jobInstance.stopFrame, frameNumber + 1);

        if (isAbleToChangeFrame()) {
            changeFrame(frame);
        }
    };

    const onAddTag = (labelID: number): void => {
        if (frameTags.every((objectState: any): boolean => objectState.label.id !== labelID)) {
            onRememberObject(labelID);

            const objectState = new cvat.classes.ObjectState({
                objectType: ObjectType.TAG,
                label: labels.filter((label: any) => label.id === labelID)[0],
                frame: frameNumber,
            });
            createAnnotations(jobInstance, frameNumber, [objectState]);

            if (skipFrame) onChangeFrame();
        }
    };

    const onShortcutPress = (event: KeyboardEvent | undefined, labelID: number): void => {
        if (event?.shiftKey) {
            onRemoveState(labelID);
        } else {
            onAddTag(labelID);
        }
    };

    const subKeyMap = {
        SWITCH_DRAW_MODE: keyMap.SWITCH_DRAW_MODE,
    };

    const handlers = {
        SWITCH_DRAW_MODE: (event: KeyboardEvent | undefined) => {
            preventDefault(event);
            if (selectedLabelID !== null) {
                onShortcutPress(event, selectedLabelID);
            }
        },
    };

    return controlsDisabled ? (
        <Layout.Sider {...siderProps}>
            {/* eslint-disable-next-line */}
            <span
                className={`cvat-objects-sidebar-sider
                    ant-layout-sider-zero-width-trigger
                    ant-layout-sider-zero-width-trigger-left`}
                onClick={() => {
                    adjustContextImagePosition(!sidebarCollapsed);
                    setSidebarCollapsed(!sidebarCollapsed);
                }}
            >
                {sidebarCollapsed ? <MenuFoldOutlined title='Show' /> : <MenuUnfoldOutlined title='Hide' />}
            </span>
            <Row justify='center' className='labels-tag-annotation-sidebar-not-found-wrapper'>
                <Col>
                    <Text strong>Can&apos;t place tag on this frame.</Text>
                </Col>
            </Row>
        </Layout.Sider>
    ) : (
        <>
            <GlobalHotKeys keyMap={subKeyMap} handlers={handlers} />
            <Layout.Sider {...siderProps}>
                {/* eslint-disable-next-line */}
                <span
                    className={`cvat-objects-sidebar-sider
                        ant-layout-sider-zero-width-trigger
                        ant-layout-sider-zero-width-trigger-left`}
                    onClick={() => {
                        adjustContextImagePosition(!sidebarCollapsed);
                        setSidebarCollapsed(!sidebarCollapsed);
                    }}
                >
                    {sidebarCollapsed ? <MenuFoldOutlined title='Show' /> : <MenuUnfoldOutlined title='Hide' />}
                </span>
                <Row justify='start' className='cvat-tag-annotation-sidebar-tag-label'>
                    <Col>
                        <Text strong>Tag label:</Text>
                    </Col>
                </Row>
                <Row justify='start' className='cvat-tag-annotation-sidebar-label-select'>
                    <Col>
                        <LabelSelector
                            labels={applicableLabels}
                            value={selectedLabelID}
                            onChange={onChangeLabel}
                            onEnterPress={onAddTag}
                        />
                        <Button
                            type='primary'
                            className='cvat-add-tag-button'
                            onClick={() => onAddTag(selectedLabelID as number)}
                            icon={<PlusOutlined />}
                        />
                    </Col>
                </Row>
                <Row className='cvat-tag-annotation-sidebar-checkbox-skip-frame'>
                    <Col>
                        <Checkbox
                            checked={skipFrame}
                            onChange={(event: CheckboxChangeEvent): void => {
                                setSkipFrame(event.target.checked);
                            }}
                        >
                            Automatically go to the next frame
                        </Checkbox>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ShortcutsSelect labels={applicableLabels} onShortcutPress={onShortcutPress} />
                    </Col>
                </Row>
                <Row justify='center' className='cvat-tag-annotation-sidebar-shortcut-help'>
                    <Col>
                        <Text>
                            Use&nbsp;
                            <Text code>N</Text>
                            &nbsp;or digits&nbsp;
                            <Text code>0-9</Text>
                            &nbsp;to add selected tag.&nbsp;
                            Add&nbsp;
                            <Text code>Shift</Text>
                            &nbsp;modifier to remove selected tag.
                        </Text>
                    </Col>
                </Row>
            </Layout.Sider>
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(TagAnnotationSidebar);
