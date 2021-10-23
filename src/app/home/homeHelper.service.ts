import { Injectable } from "@angular/core";
import { Specials, SpecialsService } from "../shared/specials.service";

@Injectable({ providedIn: 'root' })
export class HomeHelperService {
    constructor(private specialsService: SpecialsService) {}
    
    getSpecialsDetails = (type: string) => {
        const promise = new Promise(resolve => {
            this.specialsService.getSpecials(type).subscribe((data: Specials[]) => {
                resolve(data);
            });
        });
        return promise;
    }

    checkConnection = ():boolean => {
        let status;
        let connection = window.navigator.onLine;
        !connection ? status = false : status = true;
        return status;
    }
}