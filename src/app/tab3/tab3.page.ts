import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedResultsService } from '../services/shared-results.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule],
})


// Classe pour gérer les scores et les parties jouées, en utilisant le localStorage
export class Tab3Page {


  // Variable pour stocker le score actuel
  // `correct` : nombre de bonnes réponses
  // `total` : nombre total de questions répondues
  myScore: { correct: number; total: number } = { correct: 0, total: 0 };

  // Variable pour stocker le nombre total de parties jouées
  myParty: number = 0;

  // Clé utilisée pour enregistrer et récupérer le score depuis le localStorage
  private readonly STORAGE_KEY_SCORE = 'quizScore';

  // Clé utilisée pour enregistrer et récupérer le nombre de parties depuis le localStorage
  private readonly STORAGE_KEY_PARTIES = 'quizParties';

  constructor(private sharedResultsService: SharedResultsService) {
    // Initialise les valeurs dans localStorage si elles n'existent pas
    if (!localStorage.getItem(this.STORAGE_KEY_SCORE)) {
      localStorage.setItem(this.STORAGE_KEY_SCORE, JSON.stringify({ correct: 0, total: 0 }));
    }
    if (!localStorage.getItem(this.STORAGE_KEY_PARTIES)) {
      localStorage.setItem(this.STORAGE_KEY_PARTIES, '0');
    }
  }


  // Récupère le score depuis localStorage
  getScore(): { correct: number; total: number } {
    const score = localStorage.getItem(this.STORAGE_KEY_SCORE); // Cherche les données dans le localStorage
    return score ? JSON.parse(score) : { correct: 0, total: 0 }; // Parse les données si elles existent, sinon retourne les valeurs par défaut
  }


  // Sauvegarde le score dans localStorage
  addCorrectResponses(correct: number): void {
    const currentScore = this.getScore();
    currentScore.correct += correct;
    this.saveScore(currentScore);
  }


  addTotalResponses(total: number): void {
    // Récupère le score actuel
    const currentScore = this.getScore();
    // Ajoute les réponses correctes au score existant
    currentScore.total += total;
    // Sauvegarde le score mis à jour
    this.saveScore(currentScore);
  }


  private saveScore(score: { correct: number; total: number }): void {
    // Convertit l'objet en JSON et le sauvegarde
    localStorage.setItem(this.STORAGE_KEY_SCORE, JSON.stringify(score));
  }


  // Gestion des parties jouées
  getTotalParties(): number {
    // Cherche le nombre de parties dans le localStorage
    const parties = localStorage.getItem(this.STORAGE_KEY_PARTIES);

    // Convertit la valeur en entier si elle existe, sinon retourne 0
    return parties ? parseInt(parties, 10) : 0;
  }


  incrementParties(): void {
    // Récupère le nombre actuel de parties jouées
    const currentParties = this.getTotalParties();
    // Ajoute 1 et sauvegarde dans le localStorage
    localStorage.setItem(this.STORAGE_KEY_PARTIES, (currentParties + 1).toString());
  }


  ngOnInit() {
    // Récupération des données sauvegardées dans le localStorage
    this.myScore = this.sharedResultsService.getScore();
    // console.log("myScore : ", this.myScore);

    this.myParty = this.sharedResultsService.getTotalParties();
    // console.log("myParty : ", this.myParty);
  }



}
