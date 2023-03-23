import * as cvatData from '@/cvat-data/src/ts/cvat-data';
import { isBrowser, isNode } from 'browser-or-node';
import PluginRegistry from './plugins';
import serverProxy from './server-proxy';
import { Exception, ArgumentError, DataError } from './exceptions';

// This is the frames storage
const frameDataCache = {};

// type MyFunc = (onServerRequest: () => {}) => Promise<unknown> & { implementation: (onServerRequest: any) => Promise<unknown>; };

/**
 * Class provides meta information about specific frame and frame itself
 * @memberof module:API.cvat.classes
 * @hideconstructor
 */
export class FrameData {
    _data
    width
    height
    jid
    number
    stopFrame
    decodeForward
    constructor({
        width,
        height,
        name,
        jobID,
        frameNumber,
        startFrame,
        stopFrame,
        decodeForward,
        deleted,
        has_related_context: hasRelatedContext,
    }) {
        Object.defineProperties(
            this,
            Object.freeze({
                /**
                 * @name filename
                 * @type {string}
                 * @memberof module:API.cvat.classes.FrameData
                 * @readonly
                 * @instance
                 */
                filename: {
                    value: name,
                    writable: false,
                },
                /**
                 * @name width
                 * @type {number}
                 * @memberof module:API.cvat.classes.FrameData
                 * @readonly
                 * @instance
                 */
                width: {
                    value: width,
                    writable: false,
                },
                /**
                 * @name height
                 * @type {number}
                 * @memberof module:API.cvat.classes.FrameData
                 * @readonly
                 * @instance
                 */
                height: {
                    value: height,
                    writable: false,
                },
                /**
                 * @name jid
                 * @type {number}
                 * @memberof module:API.cvat.classes.FrameData
                 * @readonly
                 * @instance
                 */
                jid: {
                    value: jobID,
                    writable: false,
                },
                /**
                 * @name number
                 * @type {number}
                 * @memberof module:API.cvat.classes.FrameData
                 * @readonly
                 * @instance
                 */
                number: {
                    value: frameNumber,
                    writable: false,
                },
                /**
                 * True if some context images are associated with this frame
                 * @name hasRelatedContext
                 * @type {boolean}
                 * @memberof module:API.cvat.classes.FrameData
                 * @readonly
                 * @instance
                 */
                hasRelatedContext: {
                    value: hasRelatedContext,
                    writable: false,
                },
                /**
                 * Start frame of the frame in the job
                 * @name startFrame
                 * @type {number}
                 * @memberof module:API.cvat.classes.FrameData
                 * @readonly
                 * @instance
                 */
                startFrame: {
                    value: startFrame,
                    writable: false,
                },
                /**
                 * Stop frame of the frame in the job
                 * @name stopFrame
                 * @type {number}
                 * @memberof module:API.cvat.classes.FrameData
                 * @readonly
                 * @instance
                 */
                stopFrame: {
                    value: stopFrame,
                    writable: false,
                },
                decodeForward: {
                    value: decodeForward,
                    writable: false,
                },
                /**
                 * True if frame was deleted from the task data
                 * @name deleted
                 * @type {boolean}
                 * @memberof module:API.cvat.classes.FrameData
                 * @readonly
                 * @instance
                 */
                deleted: {
                    value: deleted,
                    writable: false,
                },
            }),
        );
    }

    /**
     * Method returns URL encoded image which can be placed in the img tag
     * @method data
     * @returns {string}
     * @memberof module:API.cvat.classes.FrameData
     * @instance
     * @async
     * @param {function} [onServerRequest = () => {}]
     * callback which will be called if data absences local
     * @throws {module:API.cvat.exception.ServerError}
     * @throws {module:API.cvat.exception.PluginError}
     */
    async data(onServerRequest = () => {}) {
        const result = await PluginRegistry.apiWrapper.call(this, FrameData.prototype.data, onServerRequest);
        return result;
    }

    get imageData() {
        return this._data.imageData;
    }

    set imageData(imageData) {
        this._data.imageData = imageData;
    }
}

FrameData.prototype.data.implementation = async function (onServerRequest) {
    return new Promise((resolve, reject) => {
        const resolveWrapper = (data) => {
            this._data = {
                imageData: data,
                renderWidth: this.width,
                renderHeight: this.height,
            };
            return resolve(this._data);
        };

        if (this._data) {
            resolve(this._data);
            return;
        }

        const { provider } = frameDataCache[this.jid];
        const { chunkSize } = frameDataCache[this.jid];
        const start = parseInt((this.number / chunkSize).toString(), 10) * chunkSize;
        const stop = Math.min(this.stopFrame, (parseInt((this.number / chunkSize).toString(), 10) + 1) * chunkSize - 1);
        const chunkNumber = Math.floor(this.number / chunkSize);

        const onDecodeAll = async (frameNumber) => {
            if (
                frameDataCache[this.jid].activeChunkRequest &&
                chunkNumber === frameDataCache[this.jid].activeChunkRequest.chunkNumber
            ) {
                const callbackArray = frameDataCache[this.jid].activeChunkRequest.callbacks;
                for (let i = callbackArray.length - 1; i >= 0; --i) {
                    if (callbackArray[i].frameNumber === frameNumber) {
                        const callback = callbackArray[i];
                        callbackArray.splice(i, 1);
                        callback.resolve(await provider.frame(callback.frameNumber));
                    }
                }
                if (callbackArray.length === 0) {
                    frameDataCache[this.jid].activeChunkRequest = null;
                }
            }
        };

        const rejectRequestAll = () => {
            if (
                frameDataCache[this.jid].activeChunkRequest &&
                chunkNumber === frameDataCache[this.jid].activeChunkRequest.chunkNumber
            ) {
                for (const r of frameDataCache[this.jid].activeChunkRequest.callbacks) {
                    r.reject(r.frameNumber);
                }
                frameDataCache[this.jid].activeChunkRequest = null;
            }
        };

        const makeActiveRequest = async () => {
            const taskDataCache = frameDataCache[this.jid];
            const activeChunk = taskDataCache.activeChunkRequest;
            console.log(taskDataCache, 'taskDataCache', activeChunk, 'activeChunk');
            activeChunk.request = await serverProxy.frames
                .getData(null, this.jid, activeChunk.chunkNumber)
                .then((chunk) => {
                    frameDataCache[this.jid].activeChunkRequest.completed = true;
                    console.log(taskDataCache.nextChunkRequest, 'taskDataCache.nextChunkRequest');
                    if (!taskDataCache.nextChunkRequest) {
                        provider.requestDecodeBlock(
                            chunk,
                            taskDataCache.activeChunkRequest.start,
                            taskDataCache.activeChunkRequest.stop,
                            taskDataCache.activeChunkRequest.onDecodeAll,
                            taskDataCache.activeChunkRequest.rejectRequestAll,
                        )
                    }
                })
                .catch((exception) => {
                    if (exception instanceof Exception) {
                        reject(exception);
                    } else {
                        reject(new Exception(exception.message));
                    }
                })
                .finally(() => {
                    console.log(taskDataCache.nextChunkRequest, 'finall');
                    if (taskDataCache.nextChunkRequest) {
                        if (taskDataCache.activeChunkRequest) {
                            for (const r of taskDataCache.activeChunkRequest.callbacks) {
                                r.reject(r.frameNumber);
                            }
                        }
                        taskDataCache.activeChunkRequest = taskDataCache.nextChunkRequest;
                        taskDataCache.nextChunkRequest = null;
                        makeActiveRequest();
                    }
                });
                console.log(taskDataCache.activeChunkRequest, 'taskDataCache.activeChunkRequest');
        };

        if (isNode) {
            resolve('Dummy data');
        } else if (isBrowser) {
            provider
                .frame(this.number)
                .then(async (frame) => {
                    if (frame === null) {
                        onServerRequest();
                        const activeRequest = frameDataCache[this.jid].activeChunkRequest;
                        if (!provider.isChunkCached(start, stop)) {
                            if (
                                !activeRequest ||
                                (activeRequest &&
                                    activeRequest.completed &&
                                    activeRequest.chunkNumber !== chunkNumber)
                            ) {
                                console.log(1, activeRequest && activeRequest.rejectRequestAll);
                                if (activeRequest && activeRequest.rejectRequestAll) {
                                    activeRequest.rejectRequestAll();
                                }
                                frameDataCache[this.jid].activeChunkRequest = {
                                    request: null,
                                    chunkNumber,
                                    start,
                                    stop,
                                    onDecodeAll,
                                    rejectRequestAll,
                                    completed: false,
                                    callbacks: [
                                        {
                                            resolve: resolveWrapper,
                                            reject,
                                            frameNumber: this.number,
                                        },
                                    ],
                                };
                                makeActiveRequest();
                            } else if (activeRequest.chunkNumber === chunkNumber) {
                                console.log(2);
                                if (!activeRequest.onDecodeAll && !activeRequest.rejectRequestAll) {
                                    activeRequest.onDecodeAll = onDecodeAll;
                                    activeRequest.rejectRequestAll = rejectRequestAll;
                                }
                                activeRequest.callbacks.push({
                                    resolve: resolveWrapper,
                                    reject,
                                    frameNumber: this.number,
                                });
                            } else {
                                console.log(3);
                                if (frameDataCache[this.jid].nextChunkRequest) {
                                    const { callbacks } = frameDataCache[this.jid].nextChunkRequest;
                                    for (const r of callbacks) {
                                        r.reject(r.frameNumber);
                                    }
                                }
                                frameDataCache[this.jid].nextChunkRequest = {
                                    request: null,
                                    chunkNumber,
                                    start,
                                    stop,
                                    onDecodeAll,
                                    rejectRequestAll,
                                    completed: false,
                                    callbacks: [
                                        {
                                            resolve: resolveWrapper,
                                            reject,
                                            frameNumber: this.number,
                                        },
                                    ],
                                };
                            }
                        } else {
                            console.log(4);
                            activeRequest.callbacks.push({
                                resolve: resolveWrapper,
                                reject,
                                frameNumber: this.number,
                            });
                            provider.requestDecodeBlock(null, start, stop, onDecodeAll, rejectRequestAll);
                        }
                    } else {
                        if (
                            this.number % chunkSize > chunkSize / 4 &&
                            provider.decodedBlocksCacheSize > 1 &&
                            this.decodeForward &&
                            !provider.isNextChunkExists(this.number)
                        ) {
                            const nextChunkNumber = Math.floor(this.number / chunkSize) + 1;
                            if (nextChunkNumber * chunkSize < this.stopFrame) {
                                provider.setReadyToLoading(nextChunkNumber);
                                const nextStart = nextChunkNumber * chunkSize;
                                const nextStop = Math.min(this.stopFrame, (nextChunkNumber + 1) * chunkSize - 1);
                                if (!provider.isChunkCached(nextStart, nextStop)) {
                                    if (!frameDataCache[this.jid].activeChunkRequest) {
                                        frameDataCache[this.jid].activeChunkRequest = {
                                            request: null,
                                            chunkNumber: nextChunkNumber,
                                            start: nextStart,
                                            stop: nextStop,
                                            onDecodeAll: null,
                                            rejectRequestAll: null,
                                            completed: false,
                                            callbacks: [],
                                        };
                                        console.log(5);
                                        makeActiveRequest();
                                    }
                                } else {
                                    console.log(6);
                                    provider.requestDecodeBlock(null, nextStart, nextStop, null, null);
                                }
                            }
                        }
                        resolveWrapper(frame);
                    }
                })
                .catch((exception) => {
                    if (exception instanceof Exception) {
                        reject(exception);
                    } else {
                        reject(new Exception(exception.message));
                    }
                });
        }
    });
};

function getFrameMeta(jobID, frame) {
    const { meta, mode, startFrame } = frameDataCache[jobID];
    let size = null;
    if (mode === 'interpolation') {
        [size] = meta.frames;
    } else if (mode === 'annotation') {
        if (frame >= meta.size) {
            throw new ArgumentError(`Meta information about frame ${frame} can't be received from the server`);
        } else {
            size = meta.frames[frame - startFrame];
        }
    } else {
        throw new DataError(`Invalid mode is specified ${mode}`);
    }
    return size;
}

class FrameBuffer {
    _size
    _buffer
    _contextImage
    _requestedChunks
    _chunkSize
    _stopFrame
    _activeFillBufferRequest
    _jobID
    _required
    constructor(size, chunkSize, stopFrame, jobID) {
        this._size = size;
        this._buffer = {};
        this._contextImage = {};
        this._requestedChunks = {};
        this._chunkSize = chunkSize;
        this._stopFrame = stopFrame;
        this._activeFillBufferRequest = false;
        this._jobID = jobID;
    }

    isContextImageAvailable(frame) {
        return frame in this._contextImage;
    }

    getContextImage(frame) {
        return this._contextImage[frame] || null;
    }

    addContextImage(frame, data) {
        this._contextImage[frame] = data;
    }

    getFreeBufferSize() {
        let requestedFrameCount = 0;
        for (const chunk of Object.values(this._requestedChunks)) {
            requestedFrameCount += chunk.requestedFrames.size;
        }

        return this._size - Object.keys(this._buffer).length - requestedFrameCount;
    }

    requestOneChunkFrames(chunkIdx) {
        return new Promise((resolve, reject) => {
            this._requestedChunks[chunkIdx] = {
                ...this._requestedChunks[chunkIdx],
                resolve,
                reject,
            };
            for (const frame of this._requestedChunks[chunkIdx].requestedFrames.entries()) {
                const requestedFrame = frame[1];
                const frameMeta = getFrameMeta(this._jobID, requestedFrame);
                const frameData = new FrameData({
                    ...frameMeta,
                    jobID: this._jobID,
                    frameNumber: requestedFrame,
                    startFrame: frameDataCache[this._jobID].startFrame,
                    stopFrame: frameDataCache[this._jobID].stopFrame,
                    decodeForward: false,
                    deleted: requestedFrame in frameDataCache[this._jobID].meta,
                });
                console.log(frameData, 'frameData1111');

                frameData
                    .data()
                    .then(() => {
                        console.log(this._requestedChunks, 'this._requestedChunks');
                        if (
                            !(chunkIdx in this._requestedChunks) ||
                            !this._requestedChunks[chunkIdx].requestedFrames.has(requestedFrame)
                        ) {
                            reject(chunkIdx);
                        } else {
                            this._requestedChunks[chunkIdx].requestedFrames.delete(requestedFrame);
                            this._requestedChunks[chunkIdx].buffer[requestedFrame] = frameData;
                            if (this._requestedChunks[chunkIdx].requestedFrames.size === 0) {
                                const bufferedframes = Object.keys(this._requestedChunks[chunkIdx].buffer).map(
                                    (f) => +f,
                                );
                                this._requestedChunks[chunkIdx].resolve(new Set(bufferedframes));
                            }
                        }
                    })
                    .catch(() => {
                        reject(chunkIdx);
                    });
            }
        });
    }

    fillBuffer(startFrame, frameStep = 1, count = null) {
        const freeSize = this.getFreeBufferSize();
        const requestedFrameCount = count ? count * frameStep : freeSize * frameStep;
        const stopFrame = Math.min(startFrame + requestedFrameCount, this._stopFrame + 1);

        for (let i = startFrame; i < stopFrame; i += frameStep) {
            const chunkIdx = Math.floor(i / this._chunkSize);
            if (!(chunkIdx in this._requestedChunks)) {
                this._requestedChunks[chunkIdx] = {
                    requestedFrames: new Set(),
                    resolve: null,
                    reject: null,
                    buffer: {},
                };
            }
            this._requestedChunks[chunkIdx].requestedFrames.add(i);
        }

        let bufferedFrames = new Set();

        // if we send one request to get frame 1 with filling the buffer
        // then quicky send one more request to get frame 1
        // frame 1 will be already decoded and written to buffer
        // the second request gets frame 1 from the buffer, removes it from there and returns
        // after the first request finishes decoding it tries to get frame 1, but failed
        // because frame 1 was already removed from the buffer by the second request
        // to prevent this behavior we do not write decoded frames to buffer till the end of decoding all chunks
        const buffersToBeCommited = [];
        const commitBuffers = () => {
            for (const buffer of buffersToBeCommited) {
                this._buffer = {
                    ...this._buffer,
                    ...buffer,
                };
            }
        };

        // Need to decode chunks in sequence
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            for (const chunkIdx of Object.keys(this._requestedChunks)) {
                try {
                    const chunkFrames = await this.requestOneChunkFrames(chunkIdx);
                    if (chunkIdx in this._requestedChunks) {
                        bufferedFrames = new Set([...bufferedFrames, ...chunkFrames]);

                        buffersToBeCommited.push(this._requestedChunks[chunkIdx].buffer);
                        delete this._requestedChunks[chunkIdx];
                        if (Object.keys(this._requestedChunks).length === 0) {
                            commitBuffers();
                            resolve(bufferedFrames);
                        }
                    } else {
                        commitBuffers();
                        reject(chunkIdx);
                        break;
                    }
                } catch (error) {
                    commitBuffers();
                    reject(error);
                    break;
                }
            }
        });
    }

    async makeFillRequest(start, step, count = null) {
        if (!this._activeFillBufferRequest) {
            this._activeFillBufferRequest = true;
            try {
                await this.fillBuffer(start, step, count);
                this._activeFillBufferRequest = false;
            } catch (error) {
                if (typeof error === 'number' && error in this._requestedChunks) {
                    this._activeFillBufferRequest = false;
                }
                throw error;
            }
        }
    }

    async require(frameNumber, jobID, fillBuffer, frameStep) {
        for (const frame in this._buffer) {
            if (+frame < frameNumber || +frame >= frameNumber + this._size * frameStep) {
                delete this._buffer[frame];
            }
        }

        this._required = frameNumber;
        const frameMeta = getFrameMeta(jobID, frameNumber);
        let frame = new FrameData({
            ...frameMeta,
            jobID,
            frameNumber,
            startFrame: frameDataCache[jobID].startFrame,
            stopFrame: frameDataCache[jobID].stopFrame,
            decodeForward: !fillBuffer,
            deleted: frameNumber in frameDataCache[jobID].meta.deleted_frames,
        });

        if (frameNumber in this._buffer) {
            frame = this._buffer[frameNumber];
            delete this._buffer[frameNumber];
            const cachedFrames = this.cachedFrames();
            if (
                fillBuffer &&
                !this._activeFillBufferRequest &&
                this._size > this._chunkSize &&
                cachedFrames.length < (this._size * 3) / 4
            ) {
                const maxFrame = cachedFrames ? Math.max(...cachedFrames) : frameNumber;
                if (maxFrame < this._stopFrame) {
                    await this.makeFillRequest(maxFrame + 1, frameStep).catch((e) => {
                        if (e !== 'not needed') {
                            throw e;
                        }
                    });
                }
            }
        } else if (fillBuffer) {
            console.log(fillBuffer, 'fillBuffer');
            this.clear();
            await this.makeFillRequest(frameNumber, frameStep, fillBuffer ? null : 1);
            frame = this._buffer[frameNumber];
        } else {
            this.clear();
        }

        return frame;
    }

    clear() {
        for (const chunkIdx in this._requestedChunks) {
            if (
                Object.prototype.hasOwnProperty.call(this._requestedChunks, chunkIdx) &&
                this._requestedChunks[chunkIdx].reject
            ) {
                this._requestedChunks[chunkIdx].reject('not needed');
            }
        }
        this._activeFillBufferRequest = false;
        this._requestedChunks = {};
        this._buffer = {};
    }

    cachedFrames() {
        return Object.keys(this._buffer).map((f) => +f);
    }
}

async function getImageContext(jobID, frame) {
    return new Promise((resolve, reject) => {
        serverProxy.frames
            .getImageContext(jobID, frame)
            .then((result) => {
                if (isNode) {
                    // eslint-disable-next-line no-undef
                    resolve(global.Buffer.from(result, 'binary').toString('base64'));
                } else if (isBrowser) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(result);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export async function getContextImage(jobID, frame) {
    if (frameDataCache[jobID].frameBuffer.isContextImageAvailable(frame)) {
        return frameDataCache[jobID].frameBuffer.getContextImage(frame);
    }
    const response = getImageContext(jobID, frame);
    frameDataCache[jobID].frameBuffer.addContextImage(frame, response);
    return frameDataCache[jobID].frameBuffer.getContextImage(frame);
}

export async function getPreview(taskID = null, jobID = null) {
    return new Promise((resolve, reject) => {
        // Just go to server and get preview (no any cache)
        serverProxy.frames
            .getPreview(taskID, jobID)
            .then((result) => {
                if (isNode) {
                    // eslint-disable-next-line no-undef
                    resolve(global.Buffer.from(result, 'binary').toString('base64'));
                } else if (isBrowser) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(result);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export async function getFrame(
    jobID,
    chunkSize,
    chunkType,
    mode,
    frame,
    startFrame,
    stopFrame,
    isPlaying,
    step,
    dimension,
) {
    if (!(jobID in frameDataCache)) {
        const blockType = chunkType === 'video' ? 'mp4video' : 'archive';
        const meta = await serverProxy.frames.getMeta('job', jobID);
        meta.deleted_frames = Object.fromEntries(meta.deleted_frames.map((_frame) => [_frame, true]));
        const mean = meta.frames.reduce((a, b) => a + b.width * b.height, 0) / meta.frames.length;
        const stdDev = Math.sqrt(
            meta.frames.map((x) => (x.width * x.height - mean) ** 2).reduce((a, b) => a + b) /
            meta.frames.length,
        );

        // limit of decoded frames cache by 2GB
        const decodedBlocksCacheSize = Math.floor(2147483648 / (mean + stdDev) / 4 / chunkSize) || 1;

        frameDataCache[jobID] = {
            meta,
            chunkSize,
            mode,
            startFrame,
            stopFrame,
            provider: new cvatData.FrameProvider(
                blockType,
                chunkSize,
                Math.max(decodedBlocksCacheSize, 9),
                decodedBlocksCacheSize,
                1,
                dimension,
            ),
            frameBuffer: new FrameBuffer(
                Math.min(180, decodedBlocksCacheSize * chunkSize),
                chunkSize,
                stopFrame,
                jobID,
            ),
            decodedBlocksCacheSize,
            activeChunkRequest: null,
            nextChunkRequest: null,
        };
        const frameMeta = getFrameMeta(jobID, frame);
        console.log(frameMeta, 'frameMeta');
        // actual only for video chunks
        frameDataCache[jobID].provider.setRenderSize(frameMeta?.width, frameMeta?.height);
    }

    return frameDataCache[jobID].frameBuffer.require(frame, jobID, isPlaying, step);
}

export async function getDeletedFrames(instanceType, id) {
    if (instanceType === 'job') {
        const { meta } = frameDataCache[id];
        return meta.deleted_frames;
    }

    if (instanceType === 'task') {
        const meta = await serverProxy.frames.getMeta('job', id);
        meta.deleted_frames = Object.fromEntries(meta.deleted_frames.map((_frame) => [_frame, true]));
        return meta;
    }

    throw new Exception(`getDeletedFrames is not implemented for ${instanceType}`);
}

export function deleteFrame(jobID, frame) {
    const { meta } = frameDataCache[jobID];
    meta.deleted_frames[frame] = true;
}

export function restoreFrame(jobID, frame) {
    const { meta } = frameDataCache[jobID];
    if (frame in meta.deleted_frames) {
        delete meta.deleted_frames[frame];
    }
}

export async function patchMeta(jobID) {
    const { meta } = frameDataCache[jobID];
    const newMeta = await serverProxy.frames.saveMeta('job', jobID, {
        deleted_frames: Object.keys(meta.deleted_frames),
    });
    const prevDeletedFrames = meta.deleted_frames;

    // it is important do not overwrite the object, it is why we working on keys in two loops below
    for (const frame of Object.keys(prevDeletedFrames)) {
        delete prevDeletedFrames[frame];
    }
    for (const frame of newMeta.deleted_frames) {
        prevDeletedFrames[frame] = true;
    }

    frameDataCache[jobID].meta = newMeta;
    frameDataCache[jobID].meta.deleted_frames = prevDeletedFrames;
}

export async function findNotDeletedFrame(jobID, frameFrom, frameTo, offset) {
    let meta;
    if (!frameDataCache[jobID]) {
        meta = await serverProxy.frames.getMeta('job', jobID);
    } else {
        meta = frameDataCache[jobID].meta;
    }
    const sign = Math.sign(frameTo - frameFrom);
    const predicate = sign > 0 ? (frame) => frame <= frameTo : (frame) => frame >= frameTo;
    const update = sign > 0 ? (frame) => frame + 1 : (frame) => frame - 1;
    let framesCounter = 0;
    let lastUndeletedFrame = null;
    for (let frame = frameFrom; predicate(frame); frame = update(frame)) {
        if (!(frame in meta.deleted_frames)) {
            lastUndeletedFrame = frame;
            framesCounter++;
            if (framesCounter === offset) {
                return lastUndeletedFrame;
            }
        }
    }

    return lastUndeletedFrame;
}

export function getRanges(jobID) {
    if (!(jobID in frameDataCache)) {
        return {
            decoded: [],
            buffered: [],
        };
    }

    return {
        decoded: frameDataCache[jobID].provider.cachedFrames,
        buffered: frameDataCache[jobID].frameBuffer.cachedFrames(),
    };
}

export function clear(jobID) {
    if (jobID in frameDataCache) {
        frameDataCache[jobID].frameBuffer.clear();
        delete frameDataCache[jobID];
    }
}
