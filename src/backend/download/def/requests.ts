export interface DownloadRequest {
    downloadId?: string;
    identifier: string;
    downloadUrl: string;
    mimeType: string;
    visibleInDownloadsUi?: true,
    notificationVisibility?: 0,
    destinationFolder?: 'downloads';
    filename: string;
    downloadedFilePath?: string;
}

export interface DownloadCancelRequest {
    identifier: string;
}
