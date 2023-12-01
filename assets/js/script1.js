document.addEventListener("DOMContentLoaded", function () {
    function toNum(str) {
      const num = Number(str.replace(/ /g, "").replace(/[^\d.-]/g, ""));
      return num;
    }
  
    function toCurrency(num) {
      const format = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
      }).format(num);
      return format;
    }
  
    const cartNum = document.querySelector("#cart_num");
    const cart = document.querySelector("#cart");
    const popup = document.querySelector(".popup");
    const popupClose = document.querySelector("#popup_close");
    const body = document.body;
    const popupContainer = document.querySelector("#popup_container");
    const popupProductList = document.querySelector("#popup_product_list");
    const popupCost = document.querySelector("#popup_cost");
    const popupDiscount = document.querySelector("#popup_discount");
    const popupCostDiscount = document.querySelector("#popup_cost_discount");
  
    cart.addEventListener("click", (e) => {
      e.preventDefault();
      popup.classList.add("popup--open");
      body.classList.add("lock");
    });
  
    popupClose.addEventListener("click", (e) => {
      e.preventDefault();
      popup.classList.remove("popup--open");
      body.classList.remove("lock");
    });
  
    const products = [
      {
        name: "Manifesto Hand",
        price: 550000,
      },
      {
        name: "Manifesto Fingers",
        price: 450000,
      },
      {
        name: "Бионический протез плеча ELBOW",
        price: 600000,
      },
      {
        name: "Бионический протез предплечья INDY Hand",
        price: 350000,
      },
      {
        name: "MeHandA",
        price: 1000000,
      },
      {
        name: "Миоэлектрические пальцы i-Digits Quantum",
        price: 300000,
      },
    ];
  
    class Product {
      constructor(name, price) {
        this.name = name;
        this.price = price;
      }
    }
  
    class Cart {
      products;
      constructor() {
        this.products = [];
      }
      get count() {
        return this.products.length;
      }
      addProduct(product) {
        this.products.push(product);
      }
      removeProduct(index) {
        this.products.splice(index, 1);
      }
      get cost() {
        const prices = this.products.map((product) => {
          return product.price;
        });
        const sum = prices.reduce((acc, num) => {
          return acc + num;
        }, 0);
        return sum;
      }
      get costDiscount() {
        const prices = this.products.map((product) => {
          return product.price;
        });
        const sum = prices.reduce((acc, num) => {
          return acc + num;
        }, 0);
        return sum;
      }
      get discount() {
        return this.cost - this.costDiscount;
      }
    }
  
    const myCart = new Cart();
  
    if (localStorage.getItem("cart") == null) {
      localStorage.setItem("cart", JSON.stringify(myCart));
    }
  
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    myCart.products = savedCart.products;
    cartNum.textContent = myCart.count;
  
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const dataIndex = button.getAttribute("data-index");
    const product = new Product(products[dataIndex].name, products[dataIndex].price);
    myCart.addProduct(product);
    localStorage.setItem("cart", JSON.stringify(myCart));
    cartNum.textContent = myCart.count;

    if (popup.classList.contains("popup--open")) {
      popupContainerFill();
    }
  });
});

  
    function popupContainerFill() {
        popupProductList.innerHTML = null;
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        myCart.products = savedCart.products;
        const productsHTML = myCart.products.map((product, index) => {
            const productItem = document.createElement("div");
            productItem.classList.add("popup__product");
    
            const productWrap1 = document.createElement("div");
            productWrap1.classList.add("popup__product-wrap");
    
            const productTitle = document.createElement("h2");
            productTitle.classList.add("popup__product-title");
            productTitle.innerHTML = product.name;
    
            const productWrap2 = document.createElement("div");
            productWrap2.classList.add("popup__product-wrap");
    
            const productPrice = document.createElement("div");
            productPrice.classList.add("popup__product-price");
            productPrice.innerHTML = toCurrency(product.price);
    
            const productDelete = document.createElement("button");
            productDelete.classList.add("popup__product-delete");
            productDelete.innerHTML = "Remove";
    
            productDelete.addEventListener("click", () => {
                myCart.removeProduct(index);
                localStorage.setItem("cart", JSON.stringify(myCart));
                popupContainerFill();
            });
    
            productWrap1.appendChild(productTitle);
            productWrap2.appendChild(productPrice);
            productWrap2.appendChild(productDelete);
            productItem.appendChild(productWrap1);
            productItem.appendChild(productWrap2);
    
            return productItem;
        });
    
        productsHTML.forEach((productHTML) => {
            popupProductList.appendChild(productHTML);
        });
    
        popupCost.value = toCurrency(myCart.cost);
        popupDiscount.value = toCurrency(myCart.discount);
        popupCostDiscount.value = toCurrency(myCart.costDiscount);
    }
    
      
      
      
  
    popupContainerFill();
  });
  