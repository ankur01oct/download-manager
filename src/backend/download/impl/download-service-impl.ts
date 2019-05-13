import {DownloadService} from '../def/download-service';
import {BehaviorSubject, Observable, Subject, Observer} from 'rxjs';
import {DownloadEventType, DownloadProgress} from '../def/download-event';
import {DownloadRequest} from '../def/requests';
import {DownloadStatus} from '../def/download-status';
import * as downloadManagerInstance from 'cordova-plugin-android-downloadmanager';

export class DownloadServiceImpl implements DownloadService{
    private static readonly DOWNLOAD_DIR_NAME = 'Download';

    private currentDownloadRequest$ = new BehaviorSubject<DownloadRequest | undefined>(undefined);
    
    private eventsBus = new Subject<any>();

    constructor() {
        window['downloadManager'] = downloadManagerInstance;
        // console.log(downloadManager);
    }
    getDownloadInstance(){
        return downloadManager;
    }

    download(downloadRequest: DownloadRequest): Observable<DownloadRequest> {
        return this.switchToNextDownloadRequest(downloadRequest);
    }

   private switchToNextDownloadRequest(downloadRequest: DownloadRequest): Observable<DownloadRequest> {

                const anyDownloadRequest = downloadRequest;

                return Observable.create((observer) => {
                    downloadManager.enqueue({
                        uri: anyDownloadRequest.downloadUrl,
                        title: anyDownloadRequest.filename,
                        description: '',
                        mimeType: anyDownloadRequest.mimeType,
                        visibleInDownloadsUi: true,
                        notificationVisibility: 1,
                        destinationInExternalFilesDir: {
                            dirType: DownloadServiceImpl.DOWNLOAD_DIR_NAME,
                            subPath: anyDownloadRequest.filename
                        },
                        headers: []
                    }, (err, id: string) => {
                        if (err) {
                            return observer.error(err);
                        }
                        // console.log(id);
                        observer.next(id);
                    });
                }).do((downloadId) => {
                    anyDownloadRequest.downloadedFilePath = 
                        DownloadServiceImpl.DOWNLOAD_DIR_NAME + '/' + anyDownloadRequest.filename;
                    anyDownloadRequest.downloadId = downloadId;
                    this.currentDownloadRequest$.next(anyDownloadRequest);
                }).mapTo(anyDownloadRequest)
    }

    public getDownloadProgress(downloadRequest: DownloadRequest): Observable<DownloadProgress> {
        return Observable.create((observer:Observer<any>) => {
            downloadManager.query({ids: [downloadRequest.downloadId!]}, (err, entries) => {
                if (err) {
                    observer.next({
                        type: DownloadEventType.PROGRESS,
                        payload: {
                            downloadId: downloadRequest.downloadId,
                            identifier: downloadRequest.identifier,
                            progress: -1,
                            status: DownloadStatus.STATUS_FAILED
                        }
                    } as DownloadProgress);
                    observer.complete();
                    return;
                }
                const entry = entries[0];
                observer.next({
                    type: DownloadEventType.PROGRESS,
                    payload: {
                        downloadId: downloadRequest.downloadId,
                        identifier: downloadRequest.identifier,
                        progress: Math.round(entry.totalSizeBytes >= 0 ? (entry.bytesDownloadedSoFar / entry.totalSizeBytes) * 100 : -1),
                        status: entry.status
                    }
                } as DownloadProgress);
                observer.complete();

            });
        });
    }
}
