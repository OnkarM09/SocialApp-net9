import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../models/member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../../services/account.service';
import { environment } from '../../../environments/environment';
import { Photo } from '../../models/photo';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgStyle, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss'
})
export class PhotoEditorComponent implements OnInit {
  accountService = inject(AccountService);

  memberInput = input.required<Member>();
  memberChangeOutput = output<Member>();

  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  ngOnInit(): void {
    this.initializeFileUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeFileUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken:  'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 //Max file size 10MB
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      const updateMember = { ...this.memberInput() };
      updateMember.photos.push(photo);
      this.memberChangeOutput.emit(updateMember);
    }
  }
}
