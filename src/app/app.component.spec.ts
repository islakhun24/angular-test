import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpServiceUrl } from './services/http.service';
import {  TestBed } from '@angular/core/testing';

describe('Service Test', () => {
  let service: HttpServiceUrl
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HttpServiceUrl, HttpClient, HttpHandler] });
    service = TestBed.inject(HttpServiceUrl);
  });

  it("countWords(text: string) => [{word: string, occurences: number}]",() => {
    const sample = "Our mission is to be a leader in the distribution and merchandising of food, pharmacy, health and personal care items, seasonal merchandise, and related products and services. We place considerable importance on forging strong supplier partnerships. Our suppliers, large or small, local or global, are essential components in accomplishing our mission.";
    service.input = sample;
    service.getTopText()
    service.result.forEach((val: any) =>{
      expect(val).toEqual(jasmine.objectContaining({
        word: val.word,
        occurences: val.occurences
      }));
    })
  })


});
