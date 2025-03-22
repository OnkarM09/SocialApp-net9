import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../models/member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../../services/account.service';
import { environment } from '../../../environments/environment';
import { Photo } from '../../models/photo';
import { MembersService } from '../../../services/members.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgStyle, FileUploadModule, DecimalPipe, SweetAlert2Module],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss'
})
export class PhotoEditorComponent implements OnInit {
  accountService = inject(AccountService);
  private readonly memberService = inject(MembersService);

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
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
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
  setMainPhoto(photo: Photo): void {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        const user = this.accountService.currentUser();
        if (user) {
          user.photoUrl = photo.url;
          this.accountService.setCurrentUser(user);
        }

        //To update the main photo in the profile details section
        const updateMember = { ...this.memberInput() };
        updateMember.photoUrl = photo.url;
        updateMember.photos.forEach(p => {
          if (p.isMain) p.isMain = false;
          if (p.id == photo.id) p.isMain = true;
        });
        this.memberChangeOutput.emit(updateMember);
        Swal.fire({
          title: "Updated",
          text: "Your profile photo has been updated.",
          icon: "success"
        });
      }
    });
  }

  deletePhoto(photo: Photo): void {
    this.memberService.deletePhoto(photo.id).subscribe({
      next: _ => {
        const updateMember = { ...this.memberInput() };
        updateMember.photos = updateMember.photos.filter(p => p.id !== photo.id);
        this.memberChangeOutput.emit(updateMember);
        Swal.fire({
          title: "Deleted!",
          text: "Your photo has been deleted.",
          icon: "success"
        });
      }
    });
  }

  deletePhotoConfirmation(photo: Photo): void {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletePhoto(photo);
      }
    });
  }
}
