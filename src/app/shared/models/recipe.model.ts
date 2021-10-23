export interface Ingredient {
  recID: number,
  brand: string,
  category: string,
  quantity: string,
  title: string,
  price: number,
  barcode: string,
  ingredientImage: string
}

export class Recipe {
  constructor(public recipeID: number, public recipeTitle: string, public recipeImage: string) {}
}
