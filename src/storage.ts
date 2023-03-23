import { StorageLocation } from './enums';

export interface StorageData {
    location: StorageLocation;
    cloudStorageId?: number;
}

interface StorageJsonData {
    location: StorageLocation;
    cloud_storage_id?: number;
}

/**
 * Class representing a storage for import and export resources
 * @memberof module:API.cvat.classes
 * @hideconstructor
 */
export class Storage {
    public location: StorageLocation = StorageLocation.LOCAL;
    public cloudStorageId: number = 1;

    constructor(initialData: StorageData) {
        const data: StorageData = {
            location: initialData.location,
            cloudStorageId: initialData?.cloudStorageId,
        };

        Object.defineProperties(
            this,
            Object.freeze({
                /**
                 * @name location
                 * @type {module:API.cvat.enums.StorageLocation}
                 * @memberof module:API.cvat.classes.Storage
                 * @instance
                 * @readonly
                 */
                location: {
                    get: () => data.location,
                },
                /**
                 * @name cloudStorageId
                 * @type {number}
                 * @memberof module:API.cvat.classes.Storage
                 * @instance
                 * @readonly
                 */
                cloudStorageId: {
                    get: () => data.cloudStorageId,
                },
            }),
        );
    }
    toJSON(): StorageJsonData {
        return {
            location: this.location,
            ...(this.cloudStorageId ? {
                cloud_storage_id: this.cloudStorageId,
            } : {}),
        };
    }
}
