import { Component, OnInit, Input } from '@angular/core';
import { PostModel } from '../post-model';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../auth/shared/auth.service';
import { PostService } from '../post.service';
import { ToastrService } from 'ngx-toastr';
import { VoteService } from '../vote.service';
import { VotePayload } from './vote-payload';
import { VoteType } from './vote-type';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css']
})
export class VoteButtonComponent implements OnInit {

  @Input() post: PostModel;
  votePayload: VotePayload;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  upvoteColor: string;
  downvoteColor: string;

  constructor(private voteService: VoteService,
              private authService: AuthService,
              private postService: PostService,
              private toastr: ToastrService) {
    this.votePayload = {
      voteType: undefined,
      postId: undefined
    };
  }

  ngOnInit(): void {
    this.updateVoteDetails();
  }

  upvotePost(): void {
    this.votePayload.voteType = VoteType.UPVOTE;
    this.vote();
    this.upvoteColor = '';
  }

  downvotePost(): void {
    this.votePayload.voteType = VoteType.DOWNVOTE;
    this.vote();
    this.upvoteColor = '';
  }

  private vote(): void {
    this.votePayload.postId = this.post.id;
    this.voteService.vote(this.votePayload).subscribe(() => {
      this.updateVoteDetails();
    }, error => {
      this.toastr.error(error.error.message);
      throwError(error);
    });
  }

  private updateVoteDetails(): void {
    this.postService.getPost(this.post.id).subscribe(post => {
      this.post = post;
    });
  }
}
