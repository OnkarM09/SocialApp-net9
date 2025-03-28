import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../../services/likes.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink, TooltipModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent {
  private readonly likeService = inject(LikesService);

  member = input.required<Member>();

  hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id));

  toggleLike() {
    this.likeService.toggleLike(this.member().id).subscribe({
      next: _ => {
        if (this.hasLiked()) {
          this.likeService.likeIds.update(ids => ids.filter(x => x != this.member().id));
        } else {
          this.likeService.likeIds.update(ids => [...ids, this.member().id])
        }
      }
    })
  }

}
