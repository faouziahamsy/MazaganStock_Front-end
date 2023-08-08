import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Article } from 'src/app/demo/api/article';
import { Category } from 'src/app/demo/api/category';
import { ArticleService} from 'src/app/demo/service/article.service';

enum EtatEnum {
  INSTOCK = 'INSTOCK',
  LOWSTOCK = 'LOWSTOCK',
  OUTOFSTOCK = 'OUTOFSTOCK',
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent {
  
  articleForm: FormGroup;

  articleDialog: boolean = false;

  deleteArticleDialog: boolean = false;

  deleteArticlesDialog: boolean = false;

  articles: Article[] = [];

  article: Article = {};

  selectedArticles: Article[] = [];
  
  selectedMatricule: String;


  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  etatValues: string[] = Object.values(EtatEnum);

  selectedEtat: EtatEnum;

  quantityValue: number;

  isEditMode: boolean = false;
  
  constructor(private articleService: ArticleService,  
              private messageService: MessageService, 
              private fb: FormBuilder) { }
 
  ngOnInit() {
      this.createForm();
      this.loadArticles();  
      this.selectedMatricule = '';
  }

  createForm() {
      this.articleForm = this.fb.group({
          matricule: ['',Validators.required],
          quantity: ['',Validators.required],
          category:[''],
          dateEntree:[''],
          dateSortie:[''],
          etat:['']
      });
      //console.log(this.articleForm);
  }

 
  loadArticles() {
      this.articleService.getArticles().subscribe(
          (data: Article[]) => {
              this.articles = data;
             // console.log("dataaa",data)
          },
          (error) => {
              console.error('Error fetching articles:', error);
          }
      );
  }

  
onSubmit() {
  const articleData: Article = {
    matricule: this.selectedMatricule.toString(),
    quantity: this.quantityValue,
    dateEntree: this.articleForm.value.dateEntree,
    dateSortie: this.articleForm.value.dateSortie,
    etat: this.selectedEtat,
  };
//  console.log(articleData);
 
  this.articleService.createArticles(articleData).subscribe(
    (response) => {
      const newArticle: Article = {...response}
        // const newProduct: Product = {...response} {id: response.id, name: response.name}
        this.articles.push(newArticle)

      console.log('Article saved successfully!', response);
    },
    (error) => {
      
      console.error('Error while saving article:', error);
    }
    
  );
  this.articleDialog = false;
}
onUpdateArticle() {
  const article: Article ={  
      matricule: this.article.matricule.toString(),
      dateSortie:this.article.dateSortie,
      quantity:this.articleForm.value.quantity,
      etat:this.article.etat,
  };
  this.articleDialog = false;
 }
  openNew() {
      this.article = {};
      this.submitted = false;
      this.isEditMode = false;
      this.articleDialog = true;
  }
  deleteSelectedArticles() {
      this.deleteArticlesDialog = true;
  }
  editArticle(article: Article) {
      this.article = { ...article };
      console.log('====================================');
      console.log(this.article);
      console.log('====================================');
      this.articleDialog = true;
      this.isEditMode = true;
  }
  updateArticle(article: Article) {
    const articleId = this.article.id;
    this.articleService.updateArticle(articleId, article).subscribe(
        (updatedarticle: Article) => {
            // Update the category in the list with the updated values
            const index = this.articles.findIndex(c => c.id === updatedarticle.id);
            if (index !== -1) {
                this.articles[index] = updatedarticle;
            }
            // Show a success message or perform any other necessary actions
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Article updated successfully', life: 3000 });
        },
        (error) => {
            console.error('Error updating article:', error);
            // Show an error message or perform error handling
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update article', life: 3000 });
        }
    );
}
  deleteArticle(article: Article) {
      this.deleteArticleDialog = true;
      this.article = { ...article };
  }
  confirmDeleteSelected() {
      this.deleteArticlesDialog = false;
      this.articles = this.articles.filter(val => !this.selectedArticles.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Articles Deleted', life: 3000 });
      this.selectedArticles = [];
  } 
  confirmDelete() {
    if (this.article.id) {
      const articleId = this.article.id;
      this.articleService.deleteArticle(articleId).subscribe(
        () => {
          console.log('Article deleted successfully:', this.article);
          // Remove the deleted category from the list
          this.articles  = this.articles.filter((val) => val.id !== this.article.id);
          this.deleteArticleDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Article Deleted',
            life: 3000
          });
        },
        (error) => {
          console.error('Error deleting article:', error);
        }
      );
    } else {
      console.error('article ID is null or undefined');
    }
  }
  hideDialog() {
      this.articleDialog = false;
      this.submitted = false;
  }
}



