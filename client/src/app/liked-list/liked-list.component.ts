import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LikesService } from '../../services/likes.service';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { ButtonsModule } from 'ngx-bootstrap/buttons'
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-liked-list',
  standalone: true,
  imports: [FormsModule, MemberCardComponent, ButtonsModule, PaginationModule],
  templateUrl: './liked-list.component.html',
  styleUrl: './liked-list.component.scss'
})
export class LikedListComponent implements OnInit, OnDestroy {
  likesService = inject(LikesService);
  predicate: string = 'liked';
  pageNumber: number = 1;
  pageSize: number = 4;

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize)
  }

  getTitle() {
    switch (this.predicate) {
      case 'liked':
        return 'People you like';
      case 'likedBy':
        return 'People who liked you'
      default:
        return 'Mutual'
    }
  }

  pageChanged(event: any) {
    if (this.pageNumber != event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
  ngOnDestroy(): void {
      this.predicate = 'liked';
  }
}
