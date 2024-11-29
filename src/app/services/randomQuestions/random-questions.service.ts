import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { nbRandom } from '../../functionGenerales/randomNumber';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RandomQuestionsService {

  linkApi: string = "https://opentdb.com/api.php?"
  //https://opentdb.com/api.php?amount=30&category=9&difficulty=easy&type=multiple


  constructor(
    private http: HttpClient
  ) { }



  getQuestions(): Observable<any> {

    // Questions aléatoires
    const nbRandomQuestions = nbRandom(50, 5)
    // console.log("nbRandomQuestions : ", nbRandomQuestions);

    // // Catégory aléatoire
    // const nbRandomCategory = nbRandom(24, 1)
    // console.log("nbRandomCategory : ", nbRandomCategory);

    // Difficultys random
    // const difficultyLevel = levelDifficulty()
    // console.log("difficultyLevel : ", difficultyLevel);

    // console.log(`${this.linkApi}?amount=${nbRandomQuestions}&type=multiple`)

    return this.http.get(`${this.linkApi}amount=${nbRandomQuestions}&type=multiple`)
  }



}
