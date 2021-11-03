import { Injectable } from "@angular/core";
import { Favorites, FavoritesService, GetFavorites } from "../shared/favorites.service";

@Injectable({ providedIn: 'root' })
export class FavoritesHelperService {

    constructor(private favoritesService: FavoritesService) { }

    removeFromFavorites = (userID: number, favID: number, favorites: Favorites[]) => {
        if (confirm(`Are you sure?`)) {
            this.favoritesService.removeFromFavorites(userID, favID).subscribe((data: boolean) => {
                if (data) {
                    alert(`Successfully removed from favorites`);
                    favorites.splice(0, favorites.length);
                    this.favoritesService.getFavorites(userID).subscribe((_favorites: GetFavorites[]) => {
                        favorites.push(..._favorites);
                    });
                } else {
                    alert(`Unable to remove from favorites`);
                }
            });
        } else { return; }
    }
}