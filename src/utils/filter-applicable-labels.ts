import { Label, ObjectState, LabelType } from '@/core-wrapper';

export function filterApplicableForType(type: LabelType, labels: Label[]): Label[] {
    const applicableLabels = labels.filter((label: any) => (
        [type, 'any'].includes(label.type)
    ));

    return applicableLabels;
}

export function filterApplicableLabels(objectState: ObjectState, labels: Label[]): Label[] {
    const applicableLabels = filterApplicableForType((objectState.shapeType || 'tag') as unknown as LabelType, labels);

    // a label the object has at this moment considered like applicable label
    if (!applicableLabels.find((label: Label) => label.id === objectState.label.id)) {
        return [objectState.label, ...applicableLabels];
    }

    return applicableLabels;
}
