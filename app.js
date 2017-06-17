/**
 * Created by aldebaran on 16.06.2017.
 */

Vue.component('VueCart',{
    props : {
        cart  : { type:  Array, require : true},
        title : { type : String, require: true},
        type  : { type: String,require: true}
    },
    methods : {
      removeFromCart(index) {
       return  this.cart.splice(index,1);
      },
      changeCart(index) {
       const item = this.removeFromCart(index);
       this.$emit('itemchanged',item[0],this.type);
      }
    },
    computed : {
        cartTotal() {
            let total = 0;
            this.cart.forEach((item) => {
                total += parseFloat(item.price,10);
        });
            return total.toFixed(2);
        },
        isShoppingCart () {
            return this.type == 'shoppingCart'
        },
        isSavedCart () {
            return this.type == 'savedCart'
        },
        itemOrItems() {
           if(this.cart.length > 1) {
               return "items"
           }else {
               return "item"
           }
        }
    },
    template: `
    <div class="cart-wrapper">
    <p v-if="!cart.length">No item in cart.</p>
      <h2>{{title}} <span v-if="isSavedCart"> {{itemOrItems}}</span></h2>
      <div class="cart">
        <div class="item" v-for="(item, index) in cart">
          <div class="image">
            <a v-bind:href="item.url">
              <img v-bind:src="item.image" />
            </a>
          </div>
          <div class="info">
            <h4>{{item.name}}</h4>
            <p class="seller">by {{item.seller}}</p>
            <p class="status available" v-if="item.isAvailable">In Stock</p>
            <p class="shipping" v-if="item.isEligible">Eligible for FREE Shipping & FREE Returns</p>
            <a href="#" v-on:click="removeFromCart(index)">Delete</a>
            <a href="#" class="secondary" v-on:click="changeCart(index)" v-if="isShoppingCart">Save for later</a>
            <a href="#" class="secondary" v-on:click="changeCart(index)" v-if="isSavedCart">Move to cart</a>
          </div>
          <p class="price">\${{item.price}}</p>
        </div>
      </div>
      <div class="subtotal" v-if="cart.length">
        Subtotal ({{cart.length}} items): <span class="price">\${{cartTotal}}</span>
      </div>
    </div>
  `

});

window.vue = new Vue ({
    el: '#app',
    name: 'Cart',
    data: {
        isLoading: true,
        cart: [],
        saved: []
    },
    methods : {
        handleItemChange(item, type) {
            if(type === 'shoppingCart') {
                this.saved.push(item);
            }else {
                this.cart.push(item);
            }
        }
    },
    created() {
        fetch('./data.json')
            .then((res) => { return res.json() })
            .then((res) => {
            this.isLoading = false;
            this.cart = res.cart;
            this.saved = res.saved;
            console.log(res);
    })
    }
});