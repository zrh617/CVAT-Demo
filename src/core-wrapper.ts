import * as _cvat from '@/api/cvat';
import ObjectState from '@/api/object-state';
import {
    Label, Attribute, RawAttribute, RawLabel,
} from '@/api/labels';
import { ShapeType, LabelType, DimensionType } from '@/api/enums';
import { Storage, StorageData } from '@/api/storage';
import { Job } from '@/api/session';
import MLModel from '@/api/ml-model';
import Issue from '@/api/issue';
import ModelProvider from '@/api/lambda-manager';

const cvat: any = _cvat.default.cvat;

cvat.config.backendAPI = '/api';
cvat.config.origin = window.location.origin;
cvat.config.uploadChunkSize = 100;
(globalThis as any).cvat = cvat;

function getCore(): any {
    return cvat;
}

export {
    getCore,
    Job,
    ObjectState,
    Label,
    Attribute,
    ShapeType,
    LabelType,
    Storage,
    DimensionType,
    MLModel,
    Issue,
};

export type {
    RawAttribute,
    RawLabel,
    StorageData,
    ModelProvider
};
