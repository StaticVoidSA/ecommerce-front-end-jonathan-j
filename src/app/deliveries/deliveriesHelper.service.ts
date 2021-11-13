import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthRespData } from "../auth/login/auth-resp-data.model";
import { AddAddressResponse, Address, AddressService } from "../shared/address.service";
import { CompleteCheckoutService } from "../shared/complete-checkout.service";
import { PaidForItemsService, PaidItems } from "../shared/paiditems.service";
import { NotificationService } from '../notification.service';

export enum SelectedChoice {
    Collection,
    Delivery
}

export interface ShopName {
    name: string,
    location: string,
    phone: string,
    closes: string
}

export interface CompleteTransaction {
    userName: string,
    userEmail: string,
    userID: number,
    paidItems: PaidItems[],
    selectedShop?: string,
    selectedAddress?: string,
    selectedCollectionDate?: Date,
    transactionDate: Date,
    deliveryDate?: Date,
    userSelection: SelectedChoice
}

@Injectable({ providedIn: 'root' })
export class DeliveriesHelper {

    constructor(private addressService: AddressService,
        private router: Router,
        private paidService: PaidForItemsService,
        private checkoutService: CompleteCheckoutService,
        private notifyService: NotificationService) { }

    public options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    private shops: ShopName[] = [
        { name: 'Rick n Ray Family Braamfontein', location: 'Braamfontein', phone: '011 403 1170', closes: '6PM' },
        { name: 'Rick n Ray Carlton Center', location: 'Braamfontein', phone: '011 331 0051', closes: '6PM' },
        { name: 'Rick n Ray Family Darras', location: 'Primrose', phone: '011 618 3257', closes: '6PM' },
        { name: 'Rick n Ray Newton', location: 'Fordsburg', phone: '011 492 4120', closes: '7PM' },
        { name: 'Rick n Ray Rosebank Mall', location: 'Rosebank', phone: '011 880 7757', closes: '7PM' },
        { name: 'Rick n Ray Auckland Park', location: 'Auckland Park', phone: '011 482 2601', closes: '6PM' },
        { name: 'Rick n Ray Family Louis Botha', location: 'Oaklands', phone: '011 485 5293', closes: '7PM' },
        { name: 'Rick n Ray Orange Grove', location: 'Orang Grove', phone: '011 485 5293', closes: '7PM' },
        { name: 'Rick n Ray Killarney Mall', location: 'Killarney Mall', phone: '011 646 6883', closes: '7PM' },
        { name: 'Rick n Ray Balfour Park', location: 'Balfour Park', phone: '011 440 0521', closes: '6PM' },
        { name: 'Rick n Ray Rand Stream', location: 'Braamfontien', phone: '087 750 5876', closes: '7PM' },
        { name: 'Rick n Ray Family Brixton', location: 'Brixton', phone: '011 837 9295', closes: '7PM' },
        { name: 'Rick n Ray Express Kensington', location: 'Kensington', phone: '011 782 6672', closes: '12PM' },
        { name: 'Rick n Ray Family Roodepoort', location: 'Roodepoort', phone: '011 762 7558', closes: '6PM' },
        { name: 'Rick n Ray Roodekraans', location: 'Roodekraans', phone: '011 768 5567', closes: '6PM' },
        { name: 'Rick n Ray Keywest', location: 'Krugersdorp', phone: '011 768 9908', closes: '6PM' },
        { name: 'Rick n Ray Northcliff Mall', location: 'Northcliff', phone: '011 764 7783', closes: '7PM' }
    ]

    getShops = (): ShopName[] => {
        return this.shops;
    }
    
    getData = (newAddress: Address, addressForm: NgForm): Promise<any> => {
        const promise = new Promise((resolve, reject) => {
            newAddress.addressID = +sessionStorage.getItem('user_id');
            newAddress.id = +sessionStorage.getItem('user_id');
            newAddress.addressNickName = addressForm.value.addressData.nickname;
            newAddress.isDefault = addressForm.value.addressData.defaultCheckBox;
            newAddress.userAddress = addressForm.value.addressData.userAddress;

            addressForm.value.addressData.defaultCheckBox === true ? newAddress.isDefault = "True" :
                newAddress.isDefault = "False";

            newAddress && addressForm.valid ? resolve(newAddress) 
                : reject('Error gathering data for submission...');
        });
        return promise;
    }

    submitAddress = (newAddress: Address, addressForm: NgForm, user: AuthRespData, addresses: Address[]) => {
        this.getData(newAddress, addressForm)
            .then((address: Address) => {
                this.addressService.createAddress(address).subscribe((response: AddAddressResponse) => {
                    switch (response.toString()) {
                        case 'True':
                            this.addressService.getAddresses(user.userId).subscribe((_addresses: Address[]) => {
                                addresses.splice(0, addresses.length);
                                addresses.push(..._addresses);
                            });
                            this.notifyService.showSuccess(`${newAddress.addressNickName}`, 'Address Added');
                            break;
                        case 'False':
                            this.notifyService.showError(`${newAddress.addressNickName}`, `Unable To Add Address For User ${user.userName}`);
                            break;
                        case 'Exists':
                            this.notifyService.showWarning(``, `Address Already Exists For User ${user.userName}`);
                            break;
                        default:
                            this.notifyService.showError(``, `Unknown Error`);
                            break;
                    }
                });
            }).catch(error => { throw new Error(error); });
    }

    updateAddress = (address: Address, id: number, addressID: number, addressNickName: string,
        userAddress: string, isDefault: string): void => {
        if (confirm('Are you sure?')) {
            address.id = +id;
            address.addressID = +addressID;
            address.addressNickName = addressNickName;
            address.userAddress = userAddress;
            address.isDefault = isDefault;

            this.addressService.updateAddress(address).subscribe((success: boolean) => {
                if (success) {
                    this.notifyService.showSuccess(`${address.addressNickName}`, `Updated Address`)
                    this.router.navigate(['/deliveries']);
                } else {
                    this.notifyService.showError(`${address.addressNickName}`, 'Unable To Update Address');
                    this.router.navigate(['/deliveries']);
                }
            });
        } else { return; }
    }

    deleteAddress = (id: number, addressID: number): Promise<any> => {
        const promise = new Promise(resolve => {
            if (confirm('Are you sure?')) {
                window.scrollTo(0, 0);
                this.addressService.deleteAddress(addressID, id).subscribe((success: boolean) => {
                    resolve(success);
                });
            } else { return; }
        });
        return promise;
    }

    getPaidItems = (userID: number): Promise<any> => {
        const promise = new Promise(resolve => {
            this.paidService.getPaidItems(userID).subscribe((items: PaidItems[]) => {
                resolve(items);
            });
        });
        return promise;
    }

    clearAllPaidItems = (userID: number): Promise<any> => {
        const promise = new Promise(resolve => {
            this.paidService.clearPaidItems(userID).subscribe((success: boolean) => {
                resolve(success);
            });
        });
        return promise;
    }

    completeTransaction = (hasSelectedDelivery: boolean, hasSelectedCollection: boolean, 
        user: AuthRespData, userEmail: string, paidItems: PaidItems[], selectedAddress: string = null, 
        selectedStore: string = null, deliveryStringDate = null): void => {
        let _userSelection: number = 0;
        let transactionDate: Date = new Date();
        let deliveryDate = new Date();
        let body: CompleteTransaction = null;
        deliveryDate.setDate(deliveryDate.getDate() + 4); 

        const SelectionPromise = new Promise(() => {        
            hasSelectedDelivery ? _userSelection = 1 : _userSelection = 0;
            hasSelectedCollection ? _userSelection = 0 : _userSelection = 1;
        });

        const DataPromise = new Promise(() => {
            body = {
                userName: user.userName,
                userEmail: userEmail,
                userID: user.userId,
                paidItems: paidItems,
                selectedAddress: selectedAddress || null,
                selectedShop: selectedStore || null,
                selectedCollectionDate: deliveryStringDate || null,
                deliveryDate: deliveryDate || null,
                transactionDate: transactionDate,
                userSelection: _userSelection
            }
        });

        const CheckoutPromise = new Promise(() => {
            this.checkoutService.completeCheckout(body).subscribe((_success: boolean) => {
                _success ? alert(`Transaction Complete! User selected ${SelectedChoice[_userSelection]}\nPlease check your email account for receipt`)
                    : alert(`Unable to complete transaction ${SelectedChoice[_userSelection]}`);
            });
        });

        async function Complete() {
            await SelectionPromise;
            await DataPromise;
            await CheckoutPromise;
        }

        Complete();
    }
}