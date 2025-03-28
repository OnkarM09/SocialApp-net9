import { ResolveFn } from '@angular/router';
import { Member } from '../models/member';
import { MembersService } from '../../services/members.service';
import { inject } from '@angular/core';

export const memberDetailedResolver: ResolveFn<Member | null> = (route, state) => {
  const memberService = inject(MembersService);
  const userName = route.paramMap.get('username');
  if(!userName) return null;
  return  memberService.getMember(userName);
};
