export interface ImageProcessing {
    processImage: (src: ImageData, frameNumber: number) => ImageData;
    currentProcessedImage: number | undefined;
}

export interface TrackingResult {
    updated: boolean;
    points: number[];
}

export interface TrackerModel {
    name: string;
    init: (src: ImageData, points: number[]) => void;
    reinit: (points: number[]) => void;
    update: (src: ImageData) => TrackingResult;
}

export interface OpenCVTracker {
    name: string;
    description: string;
    type: string;
    model: (() => TrackerModel);
}
