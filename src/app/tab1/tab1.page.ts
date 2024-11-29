import { Component } from '@angular/core';
import { RandomQuestionsService } from '../services/randomQuestions/random-questions.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedResultsService } from '../services/shared-results.service';
import { shuffleArray } from '../functionGenerales/shuffleArray';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})





export class Tab1Page {

  // Je stock toutes mes questions
  questions: Array<any> = [];

  // Je stock l'index où je me situe dans mon tableau de questions
  currentQuestionsIndex = 0

  // Stock les réponses sélectionnées par l'utilisateur
  /*
  Un Set en JavaScript (et donc aussi en TypeScript) est une structure 
  de données qui permet de stocker des valeurs uniques. Contrairement 
  à un tableau (Array), un Set ne peut contenir qu'une seule occurrence 
  de chaque valeur. Si j'essaies d'ajouter une valeur déjà présente 
  dans le Set, elle sera ignorée.
  */
  selectedResponses: Set<string> = new Set()

  // Indicateur pour savoir si la question à été répondu
  answered: boolean = false

  // Compteur du nombre de réponses correctes
  correctResponseCount: number = 0

  // Ma variable pour compter le nombre de parties total
  nombreOfPartys: number = 0


  // J'importe mon service de paramètre de l'URL aléatoir
  constructor(
    private randomQuestionsService: RandomQuestionsService,
    private sharedResultsService: SharedResultsService,
    private sanitizer: DomSanitizer
  ) { }

  // Permet de décoder les réponses
  getSanitizedAnswer(answer: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(answer);
  }

  // Méthode appelée à l'initialisation du composant
  ngOnInit() {

    // Appel du servcie pour récupérer les questions depuis l'API
    this.randomQuestionsService.getQuestions().subscribe({

      next: (response) => {
        // console.log("response : ", response);

        // si la réponse est un tableau
        // Je regroupe toutes les mauvaises réponses ainsi que les bonnes 
        // prend un argument question qui est un objet représentant une question avec les propriétés incorrect_answers et correct_answer
        this.questions = response.results.map((question: { incorrect_answers: any; correct_answer: any; }) => {
          // Je Regroupe les réponses incorrect et correctes dans le même tableau
          /*
          incorrect_answers : un tableau de mauvaises réponses.
          correct_answer : la bonne réponse.
          */
          // console.log("incorrect_answers : ", question.incorrect_answers);
          // console.log("correct_answer : ", question.correct_answer);


          /*
          L'opérateur ... (spread operator) permet de "décomposer" 
          les éléments du tableau incorrect_answers et de les insérer 
          dans un nouveau tableau avec correct_answer à la fin.
          */
          const allResponses = [...question.incorrect_answers, question.correct_answer]
          // console.log("allResponses : ", allResponses);

          // Je mélange les réponses graçe à ma méthode
          // Méthode shuffleArray pour mélanger le tableau de réponse 
          shuffleArray(allResponses)


          // Créer une nouvelle question avec les réponses mélangées
          // Retour d'un nouvel objet question avec toutes les réponses mélangées :
          return { ...question, allResponses }
        });
        // console.log("questions : ", this.questions);
      },
      error: (error) => {
        console.error("error lors de la configuration de l'URL aléatoire : ", error)
        return
      },
      complete: () => {
        console.log("Requête terminé !");
      }
    }
    )
  }


  // Méthode pour traiter la selection d'une réponse par l'utilisateur
  selectResponse(answer: string, correctAnswer: string) {

    // Si la question a été répondu
    if (!this.answered) {
      // J'ajoute la réponse selectionné dans mon Set
      this.selectedResponses.add(answer)
      // Je marque la question comme répondu
      this.answered = true
      // je vérifie si la réponse est correcte
      if (answer == correctAnswer) {
        this.correctResponseCount++
        // console.log("correct : ", this.correctResponseCount);
      }
    }

  }

  // Méthode pour passer à la question suivante
  nextQuestion() {
    // J'incrémente mon index pour correspondre à la position de la question de mon tableau de questions
    this.currentQuestionsIndex++;

    // Si je n'ai plus de questions
    if (this.currentQuestionsIndex === this.questions.length) {
      // console.log("Partie terminée !");

      // Mise à jour des données globales à la fin de la partie
      this.sharedResultsService.incrementParties();
      this.sharedResultsService.addCorrectResponses(this.correctResponseCount);
      this.sharedResultsService.addTotalQuestions(this.questions.length);
      return
    }

    // Je rénitialise la réponse selectionné
    this.selectedResponses.clear();
    this.answered = false;

    // console.log("currentQuestionsIndex : ", this.currentQuestionsIndex);
    // console.log("questions.length : ", this.questions.length);

  }



  // Méthode pour revenir en arrière
  back(): void {
    window.location.reload(); // Rafraîchit la page
  }



}