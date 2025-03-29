import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../../services/likes.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PresenceService } from '../../../services/presence.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink, TooltipModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent {
  private readonly likeService = inject(LikesService);
  private readonly presenceService = inject(PresenceService);

  member = input.required<Member>();

  isOnline = computed(()=> this.presenceService.onlineUsers().includes(this.member().username))
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
