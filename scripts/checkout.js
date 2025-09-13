import {cart,removeFromCart,calculateCartQuantity,updateCartItem,updateQuantity} from '../data/cart.js' ;
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { deliveryOptions } from '../data/deliveryoptions.js';
/* console.log(dayjs());
const today = dayjs();
const delivery=today.add(7, 'days');
console.log(delivery.format('dddd, MMMM D')); */
let cartHTML= '';
cart.forEach ( (cartItem) => {
    const productId= cartItem.productId;
    let matchingProduct;
    products.forEach ( (product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    } );
    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;
    
    deliveryOptions.forEach((option) =>{
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    cartHTML += `  
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image" 
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number" min="1">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
        </div>
    `;
    
}); 

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';
    deliveryOptions.forEach((option) => {
      const today = dayjs();
      const deliveryDate = today.add(option.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');
      const priceString = option.priceCents === 0 ? 'FREE Shipping' : `$${formatCurrency(option.priceCents)} -`;
      const isChecked = option.id === cartItem.deliveryOptionId ;
      html +=`
                <div class="delivery-option">
                  <input type="radio"
                  ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString}- Shipping
                    </div>
                  </div>
                </div>
      `
});
    return html;
}
document.querySelector('.js-order-summary').innerHTML = cartHTML;

document.querySelectorAll('.js-delete-link').forEach((link) =>{
    link.addEventListener('click', () =>{
       /*  event.target.closest('.cart-item-container').remove(); */ 
       const productId=link.dataset.productId;
       removeFromCart(productId);
       document.querySelector(`.js-cart-item-container-${productId}`).remove();
    });
   updateCartQuantity();
});

function updateCartQuantity() {
  const cartquantity = calculateCartQuantity();
  document.querySelector('.js-return-to-home-link').innerHTML = `${cartquantity} items`;
}
updateCartQuantity();

document.querySelectorAll('.js-update-quantity-link').forEach((link) =>{
  link.addEventListener('click', () => {
      const productId=link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add('is-editing-quantity');
  });
});

    
document.querySelectorAll('.js-save-link').forEach((link) =>{
  link.addEventListener('click', () => {
      const productId=link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove('is-editing-quantity');

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(quantityInput.value);
      if (newQuantity < 0 || newQuantity >=1000){
        alret('Please enter a valid quantity');
        return;
      }
      updateCartItem(productId, newQuantity);
      document.querySelector(`.js-cart-item-container-${productId} .quantity-label`).innerHTML = newQuantity;
      updateCartQuantity();
  });
}); 

