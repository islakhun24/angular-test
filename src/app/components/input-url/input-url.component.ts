import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-url',
  templateUrl: './input-url.component.html',
  styleUrls: ['./input-url.component.scss']
})
export class InputUrlComponent implements OnInit {
  @Input() placeholder: string = ''
  @Input() label: string = '';

  @Output() getUrl = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  onChange(e: any){
    e.preventDefault()
    this.getUrl.emit(e.target.value)
  }
}
