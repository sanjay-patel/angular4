import { Component, AfterViewInit, OnInit, ElementRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GtlComponent } from '../gtl/gtl.component';

import { AssetArray } from '../../model/assetArray';
import { DataService } from '../../services/data.service';
import { UploadDocService } from '../../services/upload-document.service';
import { ConfigService } from '../../services/config.service';

import { MessageModal } from '../../model/message';

declare let jQuery: any;

interface FileObj {
  docCategory: string;
  fileName: any;
  fileType: any;
  imgStrData: any;
}

interface ChooseFileValid {
  fileSize: boolean;
  fileType: boolean;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'my-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.scss']
})

export class DocumentComponent extends GtlComponent implements AfterViewInit, OnInit {

     public nativeEl: any;
     public assetArray: AssetArray = {};
     public uploadProofProcess: boolean = false;

     public idStatusLabel: string;
     public proofIdObj = <FileObj>{};
     public proofId: string = 'id';
     public idProofValid = <ChooseFileValid>{};

     public addressStatusLabel: string;
     public proofAddressObj = <FileObj>{};
     public proofAddress: string = 'address';
     public addressProofValid = <ChooseFileValid>{};

     public otherStatusLabel: string;
     public proofOtherObj = <FileObj>{};
     public proofOther: string = 'other';
     public otherProofValid = <ChooseFileValid>{};

     public file64Base: string;

     uploadMessage: MessageModal;
     uploadMsgShow: boolean = false;

    constructor(private el: ElementRef, public route: ActivatedRoute, public _dataService: DataService,
                 public _configService: ConfigService, public _uploadDocService: UploadDocService) {
            super(_dataService, _configService, route);
            super.loadGtlApi();
          console.log('DocumentComponent constructor called...');
          this.nativeEl = this.el.nativeElement;
    }

    ngOnInit() {
        this.assetArray = this._dataService.getAllAsset();
        this.loadDocuments();
    }
    
    loadDocuments() {
        console.log('loadDocuments called=====');
        let obj = {};
        this._uploadDocService.getPlayerDocument(obj).subscribe(res => {
            try {
                // console.log(res);
                if(res.success === true) {
                    let result = JSON.parse(res.message);
                    // console.log('result called===', result);
                    
                    for(let i = 0; i < result.length; i++){
                        // console.log('result[i] called=====', result[i].docCategory);
                        switch(result[i].docCategory){
                            case "id":
                                switch(result[i].status) {
                                    case 'In Review':
                                        this.idStatusLabel = this.assetArray['document_status_doc_under_process_M'];
                                        break;
                                    case 'Rejected':
                                        this.idStatusLabel = this.assetArray['document_status_doc_not_approved_M'];
                                        break;
                                    case 'Approved':
                                        this.idStatusLabel = this.assetArray['document_status_doc_approved_M'];
                                        break;
                                    default:
                                        this.idStatusLabel = this.assetArray['document_status_no_doc_uploaded_M'];
                                }
                                break;
                            case "address":
                                switch(result[i].status) {
                                    case 'In Review':
                                        this.addressStatusLabel = this.assetArray['document_status_doc_under_process_M'];
                                        break;
                                    case 'Rejected':
                                        this.addressStatusLabel = this.assetArray['document_status_doc_not_approved_M'];
                                        break;
                                    case 'Approved':
                                        this.addressStatusLabel = this.assetArray['document_status_doc_approved_M'];
                                        break;
                                    default:
                                        this.addressStatusLabel = this.assetArray['document_status_no_doc_uploaded_M'];
                                }
                                break;
                            case "other":
                                switch(result[i].status) {
                                    case 'In Review':
                                        this.otherStatusLabel = this.assetArray['document_status_doc_under_process_M'];
                                        break;
                                    case 'Rejected':
                                        this.otherStatusLabel = this.assetArray['document_status_doc_not_approved_M'];
                                        break;
                                    case 'Approved':
                                        this.otherStatusLabel = this.assetArray['document_status_doc_approved_M'];
                                        break;
                                    default:
                                        this.otherStatusLabel = this.assetArray['document_status_no_doc_uploaded_M'];
                                }
                                break;
                            }
                        }
                } else {
                }               
            } catch (e) {
                console.log('exception caught in DocumentComponent saveFileUploadData');                
            }
        });
    }

    saveFileUploadData(fileObj) {
        this._uploadDocService.uploadDocument(fileObj).subscribe(res => {
            try {
                console.log(res);
                if(res.success === true) {
                    this.uploadMessage = <MessageModal> {
                        msgTitle: null,
                        msgBody: this.assetArray['document_upload_dialog_message_text_M'],
                        msgOkBtn: this.assetArray['document_upload_dialog_ok_btn_M'],
                        msgCancelBtn: null
                    };
                    this.uploadMsgShow = true;
                } else {
                    console.log('it is in else');
                    this.uploadMessage = <MessageModal> {
                        msgTitle: null,
                        msgBody: 'Error uploading, try again',
                        msgOkBtn: this.assetArray['document_upload_dialog_ok_btn_M'],
                        msgCancelBtn: null
                    };
                    this.uploadMsgShow = true;
                }               
            } catch (e) {
                console.log('exception caught in DocumentComponent saveFileUploadData');                
            }
        });
    }
    allFileData(dataObj: FileObj) {
        // console.log('dataObj callled');
        if (dataObj.docCategory === this.proofId) {
            this.proofIdObj = dataObj;
            // console.log('<<<this.ProofIdObj>>>>>');
        } else if (dataObj.docCategory === this.proofAddress) {
            this.proofAddressObj = dataObj;
            // console.log('<<<this.proofAddressObj>>>>>');
        } else if (dataObj.docCategory === this.proofOther) {
            this.proofOtherObj = dataObj;
            // console.log('<<<this.proofOtherObj>>>>>');
        } else {
            console.log('file not match');
        }
    }
    checkFileValid(val) {
        console.log('checkFileValid called');
        if (this.proofId === val.fileId) {
            this.idProofValid['fileSize'] = val.fileSizeValid;
            /*this.idProofValid['fileType'] = val.fileTypeValid;*/
        }

        if (this.proofAddress === val.fileId) {
            this.addressProofValid['fileSize'] = val.fileSizeValid;
           /* this.addressProofValid['fileType'] = val.fileTypeValid;*/
        }

        if (this.proofOther === val.fileId) {
            this.otherProofValid['fileSize'] = val.fileSizeValid;
            /*this.addressProofValid['fileType'] = val.fileTypeValid;*/
        }
    }
    
    documentProceed() {
        this.uploadProofProcess = true;
    }
    
    uploadProofDoc(val) {
         let chooseProofId = jQuery(this.nativeEl).find('#upload-file-id');
         let chooseAddressId = jQuery(this.nativeEl).find('#upload-file-address');
         let chooseOtherId = jQuery(this.nativeEl).find('#upload-file-other');
         // console.log('chooseProofId called===', chooseProofId);
        // console.log(this.proofAddressObj);
        if (val === 'id' && this.proofIdObj['docCategory'] !== undefined && this.idProofValid['fileSize'] === true) {
            jQuery(chooseProofId).html(this.assetArray['document_upload_id_no_file_text_M']);
            this.saveFileUploadData(this.proofIdObj);
            this.proofIdObj = <FileObj>{};
        }
        if (val === 'address' && this.proofAddressObj['docCategory'] !== undefined && this.addressProofValid['fileSize'] === true) {
            this.saveFileUploadData(this.proofAddressObj);
            jQuery(chooseAddressId).html(this.assetArray['document_upload_address_no_file_text_M']);
            this.proofAddressObj = <FileObj>{};
        }

        if (val === 'other' && this.proofOtherObj['docCategory'] !== undefined && this.otherProofValid['fileSize'] === true) {
            this.saveFileUploadData(this.proofOtherObj);
            jQuery(chooseOtherId).html(this.assetArray['document_upload_other_no_file_text_M']);
            this.proofOtherObj = <FileObj>{};
        }

    }
    
    uploadSuccCallback(event) {
        if (event === true) {
            this.uploadMsgShow = false;
        }
    }


    ngAfterViewInit() {
    }
}
