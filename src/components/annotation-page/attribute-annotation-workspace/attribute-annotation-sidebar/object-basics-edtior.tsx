import React from 'react';
import { Label } from '@/core-wrapper';
import LabelSelector from '@/components/label-selector/label-selector';

interface Props {
    currentLabel: number;
    labels: Label[];
    changeLabel(value: Label): void;
}

function ObjectBasicsEditor(props: Props): JSX.Element {
    const { currentLabel, labels, changeLabel } = props;

    return (
        <div className='cvat-attribute-annotation-sidebar-basics-editor'>
            <LabelSelector
                style={{ width: '50%' }}
                labels={labels}
                value={currentLabel}
                onChange={changeLabel}
            />
        </div>
    );
}

export default React.memo(ObjectBasicsEditor);
