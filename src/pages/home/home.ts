import { DownloadRequest } from './../../backend/download/def/requests';
import { DownloadServiceImpl } from './../../backend/download/impl/download-service-impl';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DownloadProgress } from '../../backend/download/def/download-event';

import { interval } from 'rxjs/observable/interval';
import { timer } from 'rxjs/observable/timer';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Observable } from 'rxjs';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  progress:number = -1;
  downloadsInProgress: DownloadRequest[]=[];
  aliveCheckProgress:boolean = true;
  constructor(public navCtrl: NavController,
              private downloadServiceImpl:DownloadServiceImpl,
              public platform: Platform) {
              platform.ready().then(() => {
                const downloadreq: DownloadRequest = {
                  identifier: 'video1',
                  downloadUrl: 'http://www.html5videoplayer.net/videos/toystory.mp4',
                  mimeType: 'video/mp4',
                  filename: 'play',
                }
                //simulating 1st request
                this.enqueueDownload(downloadreq);
                //simulating 2nd request
                setTimeout(() => {
                  this.enqueueDownload(downloadreq);
                }, 40000);
              });
            }
           enqueueDownload(downloadRequest: DownloadRequest):void {
            this.downloadServiceImpl.download(downloadRequest).subscribe((downloading : DownloadRequest) => {
                this.downloadsInProgress.push(downloading);
                console.log(downloading);
                this.getProgress(downloading);
            })
           }
            getProgress(downloading:DownloadRequest){
              let myInterval = setInterval( () => {
                this.downloadServiceImpl.getDownloadProgress(downloading).subscribe((data: DownloadProgress) => {
                  this.progress = data.payload.progress;
                  console.log(data);
                  if(data.payload.progress===100)
                  clearInterval(myInterval);
                } );
               }, 10000);
              } 
             
            
  // var downloadManager = require('cordova-plugin-android-downloadmanager.DownloadManager')

}
