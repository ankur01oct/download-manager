import {DownloadStatus} from './download-status';

export interface DownloadEvent{
    type: DownloadEventType;
}

export interface DownloadProgress {
    payload: {
        downloadId: string;
        identifier: string;
        progress: number;
        status: DownloadStatus;
    };
}

export enum DownloadEventType {
    PROGRESS = 'PROGRESS'
}
