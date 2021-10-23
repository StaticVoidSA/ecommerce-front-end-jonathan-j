import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../shared/recipe.service';
import { Recipe } from '../shared/models/recipe.model';
import { HomeHelperService } from '../home/homeHelper.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  public recipes: Recipe[] = [];
  public isLoading: boolean = false;
  public connected: boolean = false;

  constructor(private recipeService: RecipeService,
    private homeHelper: HomeHelperService) { }

  ngOnInit(): void {
    window.addEventListener('online', () => { this.connected = true; });
    window.addEventListener('offline', () => { this.connected = false; });

    const InitPromise = new Promise((resolve) => {
      window.scrollTo(0, 0);
      this.isLoading = true;
      resolve(this.recipes.splice(0, this.recipes.length));
    });

    const RecipesPromise = new Promise((resolve) => {
      resolve(this.recipeService.recipesStartup().subscribe((data: Recipe[]) => { 
        this.recipes.push(...data);
        setTimeout(() => {
          this.isLoading = false;
        }, 500); 
      }));
    });

    async function Recipes() {
      await RecipesPromise;
    }

    async function Init() {
      await InitPromise.then(Recipes);
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }
      Init();
    } catch (error) {
      throw new Error(error);
    }
  }
}
