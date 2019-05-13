import {Observable} from 'rxjs';
import {DownloadRequest} from './requests';
import { DownloadProgress } from './download-event';

export interface DownloadService{
    getDownloadInstance();
    download(downloadRequest: DownloadRequest): Observable<DownloadRequest>;
    getDownloadProgress(downloadRequest: DownloadRequest): Observable<DownloadProgress>

    // cancel(cancelRequest: DownloadCancelRequest): Observable<undefined>;

}
