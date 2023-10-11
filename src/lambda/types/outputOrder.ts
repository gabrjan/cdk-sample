import {Product} from "./product";
import {Customer} from "./customer";

export interface OutputOrder {
    orderId: string,
    date: string,
    totalAmount: number,
    products?: Array<Product>
    customer?: Customer
}
