import { HttpServiceUrl } from './services/http.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [{ provide: HttpServiceUrl}],
})
export class AppComponent implements OnInit {
  formGroup: any;

  result: any
  response: any
  data = "Our mission is to be a leader in the distribution and merchandising of food, pharmacy, health and personal care items, seasonal merchandise, and related products and services. We place considerable importance on forging strong supplier partnerships. Our suppliers, large or small, local or global, are essential components in accomplishing our mission."

  constructor(public baseUrl: HttpServiceUrl){

  }
  ngOnInit(){
    this.initForm()
    this.baseUrl.input = this.data;
    this.baseUrl.getTopText()
  }

  get input1() { return this.formGroup.get('input1'); }


  initForm() {
    this.formGroup = new FormGroup({
      input1: new FormControl('', [Validators.required ,Validators.minLength(6), Validators.maxLength(8)])
    })
  }
  onSubmit(e: Event){
    e.preventDefault()

    if(this.formGroup.invalid){
     this.result = "Form not valid"
    } else {
      this.result =this.formGroup.value
    }

  }

  onGetUrl(e: any){
    this.baseUrl.getUrlList(e).subscribe((success)=>{
      this.response = success
      this.response.length_word_description = success.description.match(/(\w+)/g).length;

    }, (err)=>{
      this.response = null
    })

  }
}
