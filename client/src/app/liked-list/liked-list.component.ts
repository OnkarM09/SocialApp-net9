import { Component, inject, OnInit } from '@angular/core';
import { LikesService } from '../../services/likes.service';
import { Member } from '../models/member';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import{ButtonsModule} from 'ngx-bootstrap/buttons'

@Component({
  selector: 'app-liked-list',
  standalone: true,
  imports: [FormsModule, MemberCardComponent, ButtonsModule],
  templateUrl: './liked-list.component.html',
  styleUrl: './liked-list.component.scss'
})
export class LikedListComponent implements OnInit{
  private readonly likesService = inject(LikesService);
  members? : Member[];
  predicate : string = 'liked';

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(){
    this.likesService.getLikes(this.predicate).subscribe({
      next: members => this.members = members
    });
  }

  getTitle(){
    switch(this.predicate){
      case 'liked':
        return 'People you like';
      case 'likedBy':
        return 'People who liked you'
      default :
        return 'Mutual'
    }
  }

}
