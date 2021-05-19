var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EcommerceClassRepo } from "./EcommerceClassRepo";
export class ShoppingCartRepo {
    constructor() {
        this.returnShoppingEvent = new Event("return-shopping");
        this.updateTotalsEvent = new Event("update-cart");
    }
    updateTotals() {
        return __awaiter(this, void 0, void 0, function* () {
            var totalToFreeShipping = document.getElementById("free-shipping-promotion");
            var totals = document.getElementById("cart-totals");
            EcommerceClassRepo.ajax("/ShoppingCart/GetTotals").then((response) => {
                return response.text();
            }).then((html) => {
                var item = EcommerceClassRepo.decodeHTML(html) || "";
                totals === null || totals === void 0 ? void 0 : totals.replaceWith(item);
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
            });
            EcommerceClassRepo.ajax("/ShoppingCart/GetTotalTillFreeShipping").then((response) => {
                return response.text();
            }).then((html) => {
                var item = EcommerceClassRepo.decodeHTML(html) || "";
                totalToFreeShipping === null || totalToFreeShipping === void 0 ? void 0 : totalToFreeShipping.replaceWith(item);
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
            });
        });
    }
    updateItem(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/ShoppingCart/Update", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(event.detail),
                headers: EcommerceClassRepo.getPostHeaders()
            }).then((response) => {
                return response.json();
            }).then((json) => {
                if (!json.message && event.detail.priceEl != null) {
                    console.log(event.detail);
                    event.detail.priceEl.innerHTML = json.price;
                }
                else {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
            });
        });
    }
    removeItem(event) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            var parent = event.detail.parent;
            var id = (_b = (_a = parent.querySelector("input[name=ID]")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0;
            return EcommerceClassRepo.ajax("/ShoppingCart/RemoveItem", {
                method: "POST",
                body: id.toString(),
                headers: EcommerceClassRepo.getPostHeaders()
            }).then((response) => {
                return response.json();
            }).then((json) => {
                if (!json.message) {
                    if (json.html) {
                        var cart = EcommerceClassRepo.closest(parent, ".cart-content");
                        var newNode = EcommerceClassRepo.decodeHTML(json.html) || document.createElement("span");
                        cart.insertBefore(newNode, parent);
                    }
                    parent.remove();
                }
                else {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
            });
        });
    }
    returnShopping() {
        history.back();
    }
    updateItemEvent(cartItem) {
        return new CustomEvent("update-cart-item", {
            detail: cartItem
        });
    }
    removeCartItemEvent(parent) {
        return new CustomEvent("remove-cart-item", {
            detail: {
                "parent": parent
            }
        });
    }
}
