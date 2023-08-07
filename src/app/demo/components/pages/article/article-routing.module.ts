import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArticleComponent } from './article.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ArticleComponent }
	])],
	exports: [RouterModule]
})
export class ArticleRoutingModule { }
