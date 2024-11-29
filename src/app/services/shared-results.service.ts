import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedResultsService {

  // Clé utilisée pour enregistrer et récupérer le score depuis le localStorage
  private readonly STORAGE_KEY_SCORE = 'quizScore';

  // Clé utilisée pour enregistrer et récupérer le nombre de parties depuis le localStorage
  private readonly STORAGE_KEY_PARTIES = 'quizParties';

  
  constructor() {
    // Initialiser les valeurs dans localStorage si elles n'existent pas
    if (!localStorage.getItem(this.STORAGE_KEY_SCORE)) {
      localStorage.setItem(this.STORAGE_KEY_SCORE, JSON.stringify({ correct: 0, total: 0 }));
    }
    if (!localStorage.getItem(this.STORAGE_KEY_PARTIES)) {
      localStorage.setItem(this.STORAGE_KEY_PARTIES, '0');
    }
  }


  // Récupère le score depuis localStorage
  getScore(): { correct: number; total: number } {
    const score = localStorage.getItem(this.STORAGE_KEY_SCORE);
    return score ? JSON.parse(score) : { correct: 0, total: 0 };
  }

  // Sauvegarde le score dans localStorage
  addCorrectResponses(correct: number): void {
    const currentScore = this.getScore();
    currentScore.correct += correct;
    this.saveScore(currentScore);
  }

  addTotalQuestions(total: number): void {
    const currentScore = this.getScore();
    currentScore.total += total;
    this.saveScore(currentScore);
  }

  private saveScore(score: { correct: number; total: number }): void {
    localStorage.setItem(this.STORAGE_KEY_SCORE, JSON.stringify(score));
  }

  // Gestion des parties jouées
  getTotalParties(): number {
    const parties = localStorage.getItem(this.STORAGE_KEY_PARTIES);
    return parties ? parseInt(parties, 10) : 0;
  }

  incrementParties(): void {
    const currentParties = this.getTotalParties();
    localStorage.setItem(this.STORAGE_KEY_PARTIES, (currentParties + 1).toString());
  }
}
