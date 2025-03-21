import { Component, input } from '@angular/core';
import { Member } from '../../models/member';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss'
})
export class PhotoEditorComponent {
  memberInput = input.required<Member>();
}
