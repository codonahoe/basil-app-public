import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MainServiceService } from '../services/main.service';



@Component({
  selector: 'app-ai-modal',
  templateUrl: './ai-modal.component.html',
  styleUrls: ['./ai-modal.component.scss']
})
export class AiModalComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() generatePrompt: string = '';

  constructor(public mainService:MainServiceService){

  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.mainService.setUpModal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes) this.mainService.generateAiResponse()
      .pipe()
      .subscribe((res) => console.log(res)
    )

  }
}
