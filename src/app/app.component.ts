import { Component, OnDestroy, OnInit, VERSION } from "@angular/core";
import { Router } from '@angular/router';
import { OrderService } from "./data.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  name = "Angular " + VERSION.major;
  data = [];
  showCartData:boolean=false;
  cartItems=[];
  cartItemIndex=0;
  cartSize=0;
  cartActualPrice=0;
  cartDiscountPrice=0;
  itemsPrice=0;
  show:boolean=false;
  cartItemName='';

  constructor(private service:OrderService) {
  }
  ngOnInit(){
    this.data=this.service.getData();
    this.cartItems=JSON.parse(localStorage.getItem('cartData'));
    console.log(this.cartItems)
    if(this.cartItems){
      this.showCartData=true;
      this.calculate();
    }  
    console.log(this.showCartData)
  }
  RemoveCart(){
    localStorage.removeItem('cartData');
    this.cartItems=[];
    this.showCartData=false;
    this.show=false;
  }

  calculate(){
    this.cartDiscountPrice=0;
    this.cartActualPrice=0;
    for(let i=0; i<this.cartItems.length; i++){
      this.cartSize+=this.cartItems[i].total;
      this.cartDiscountPrice += (this.cartItems[i].total * this.cartItems[i].price.actual);
      this.cartActualPrice +=(this.cartItems[i].total * this.cartItems[i].price.display);
    }
    console.log(this.cartActualPrice+'----'+this.cartDiscountPrice);
    this.itemsPrice=this.cartActualPrice-(this.cartActualPrice - this.cartDiscountPrice);
  }

  addToCart(data){
    if(this.cartItems == null){
      this.cartItems=[{name:data.name, image:data.image, price:data.price,total:1}];
      localStorage.setItem('cartData',JSON.stringify(this.cartItems));
      this.calculate();
      this.show=true;
      this.cartItemName=data.name;
      if(this.cartItems){
        this.showCartData=true;
      }  
    }else{
      let sameItem=this.cartItems.find((item,index)=> {
        this.cartItemIndex=index;
        console.log(this.cartItemIndex);
      return data.name == item.name;
      });
      if(sameItem){
        this.cartItems[this.cartItemIndex].total=this.cartItems[this.cartItemIndex].total+1;
        localStorage.setItem('cartData',JSON.stringify(this.cartItems));
        this.show=true;
        this.cartItemName=data.name;
        this.showCartData=true;
        this.calculate();
      }else{
        this.cartItems.push({name:data.name,image:data.image, price:data.price,total:1});
        localStorage.setItem('cartData',JSON.stringify(this.cartItems));
        this.show=true;
        this.cartItemName=data.name;
        this.showCartData=true;
        this.calculate();
      }
      
    }



  }
}
