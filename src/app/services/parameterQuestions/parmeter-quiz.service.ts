import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParmeterQuiz } from 'src/app/interfaces/parmeter-quiz';

@Injectable({
  providedIn: 'root'
})


// Un service pour configurer mes quiz 
export class ParmeterQuizService {


  constructor(private http: HttpClient) { }


  linkApiBeforeParameters: string = "https://opentdb.com/api.php?"


  // Mon Fetch
  parameterQuiz(numberOfQuestions: number, categoryQuestion: number, difficultyQuestion: string, typeResponse: boolean | string): Observable<any> {

    // console.log("link : ",`${this.linkApiBeforeParameters}amount=${numberOfQuestions}&category=${categoryQuestion}&difficulty=${difficultyQuestion}&type=${typeResponse}`);
    return this.http.get<ParmeterQuiz>(`${this.linkApiBeforeParameters}amount=${numberOfQuestions}&category=${categoryQuestion}&difficulty=${difficultyQuestion}&type=${typeResponse}`)
    
  }



}
