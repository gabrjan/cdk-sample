import { Product } from './product';
import {Customer} from "./customer";
export interface Order  {
    orderId: string,
    customerId: string,
    date: string,
    totalAmount: number,
    products: Array<Product>
    customer: Customer
}