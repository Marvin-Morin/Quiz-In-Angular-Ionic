import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ParmeterQuizService } from '../services/parameterQuestions/parmeter-quiz.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedResultsService } from '../services/shared-results.service';
import { shuffleArray } from '../functionGenerales/shuffleArray';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})



export class Tab2Page {



  // J'importe mes deux services API et partage de données
  constructor
    (
      private parameterQuiz: ParmeterQuizService,
      private sharedResultsService: SharedResultsService,
      private sanitizer: DomSanitizer,

    ) { }

  // Permet de décoder les réponses
  getSanitizedAnswer(answer: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(answer);
  }

  getSanitizedQuestion(question: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(question);
  }

  linkApiBeforeParameters: string = "https://opentdb.com/api.php?"

  // Une variable pour stocker le nombre de questions voulus (minimum 5)
  numberOfQuestions: number = 5

  // Une variable pour stocker la catégorie chosis
  categoryQuestion: number = 0

  // Une variable pour stocker le niveau de difficulté 
  difficultyQuestion: string = ""

  // Une variable pour stocker le type de réponse, true / fals ou multiple choice
  typeResponse: boolean | string = false

  // Une variable pour connaitre le status de la réponse si c'est une erreur ou non
  hasError: boolean = false



  // Gérer les réponses et questions 

  // Vérifier si des questions sont présentes dans mon tableau de questions pour les afichers
  questions: Array<any> = []
  verifyQuestionsOfTheList: boolean = false

  // Je stock l'index où je me situe dans mon tableau de questions
  currentQuestionsIndex = 0

  // Stock les réponses sélectionnées par l'utilisateur
  selectedResponses: Set<string> = new Set()

  // Indicateur pour savoir si la question à été répondu
  answered: boolean = false

  // Compteur du nombre de réponses correctes
  correctResponseCount: number = 0



  OnSubmit() {

    // S'il manque un paramètre, j'initialise hasError à true
    if (!this.numberOfQuestions || !this.numberOfQuestions || !this.difficultyQuestion || !this.typeResponse) {
      this.hasError = true;
    } else {
      this.hasError = false;
    }

    // La fonction de mon API passé en paramètre la configuration du questionnaire 
    this.parameterQuiz.parameterQuiz(this.numberOfQuestions, this.categoryQuestion, this.difficultyQuestion, this.typeResponse).subscribe({

      next: response => {

        // console.log("response : ", response);

        this.numberOfQuestions = response.numberOfQuestions,
          this.categoryQuestion = response.categoryQuestion,
          this.difficultyQuestion = response.difficultyQuestion,
          this.typeResponse = response.typeResponse

        // console.log("response: " + JSON.stringify(response));
        // console.log("hasError : ", this.hasError);

        // si la réponse est un tableau
        // Je regroupe toutes les mauvaises réponses ainsi que les bonnes 
        // Prend un argument question qui est un objet représentant une question avec les propriétés incorrect_answers et correct_answer
        this.questions = response.results.map((question: { incorrect_answers: any; correct_answer: any; }) => {
          // Je Regroupe les réponses incorrect et correctes dans le même tableau
          /*
          incorrect_answers : un tableau de mauvaises réponses.
          correct_answer : la bonne réponse.
          */
          const allResponses = [...question.incorrect_answers, question.correct_answer]

          // Je mélange les réponses
          shuffleArray(allResponses)

          // Créer une nouvelle question avec les réponses mélangées
          // Retour d'un nouvel objet question
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
      // J'ajoute la réponse selectionné
      this.selectedResponses.add(answer)
      // Je marque la question comme répondu
      this.answered = true
      // je vérifie si la réponse est correcte
      if (answer == correctAnswer) {
        // J'incrémente le nombre de bonne réponse répondu de l'utilisateur
        this.correctResponseCount++
        // console.log("correct : ", this.correctResponseCount);
      }

    }
  }


  // Méthode pour passer à la question suivante
  nextQuestion() {
    this.currentQuestionsIndex++;

    if (this.currentQuestionsIndex === this.questions.length) {
      console.log("Partie terminée !");

      // Mise à jour des données globales à la fin de la partie
      this.sharedResultsService.incrementParties();
      this.sharedResultsService.addCorrectResponses(this.correctResponseCount);
      this.sharedResultsService.addTotalQuestions(this.questions.length);
      return
    }

    this.selectedResponses.clear();
    this.answered = false;

    // console.log("currentQuestionsIndex : ", this.currentQuestionsIndex);
    // console.log("questions.length : ", this.questions.length);
  }


  // Gérer l'affichage
  ngOnInit() {

    // Si des questions sont présentes dans mon tableau
    if (!this.questions) {
      this.verifyQuestionsOfTheList = true
    } else {
      this.verifyQuestionsOfTheList = false
    }

    // console.log("hasError : ", this.hasError);
  }


  // Méthode pour revenir en arrière
  back(): void {
    window.location.reload(); // Rafraîchit la page
  }



}