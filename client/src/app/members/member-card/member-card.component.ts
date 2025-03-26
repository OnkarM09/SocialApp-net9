import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../../services/likes.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent {
  private readonly likeService = inject(LikesService);

  member = input.required<Member>();

  hasLiked = computed(()=> this.likeService.likeIds().includes(this.member().id))

}
