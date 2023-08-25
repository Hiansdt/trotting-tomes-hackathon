import { defineStore } from "pinia";
import cartService from "@/api/cart";
import { useStorage } from "@vueuse/core";
import { useUserStore } from "./user";

export const useCartStore = defineStore("cart", {
    state: () => ({
        booksCart: useStorage("booksCart", []),
        cartId: useStorage("cart", Number),
    }),
    actions: {
        async getCart() {
            try{
              const data = await cartService.getCart(useUserStore().user.id)
              this.cartId = data[0].id
              
            } catch(error) {
              console.log(error)
            }
          },
          async getBooksCart(){
            try {
              const data = await cartService.getBooksCart(this.cartId);
              for (let item of data) {
                item.livro.capa = "http://127.0.0.1:8000/" + item.livro.capa;
              }
              this.booksCart = data;
              
            } catch (error) {
              console.log(error); // Lidar com exceções
            }
          },
          async changeQuantity(id, item, book, quantidade){
            try {
              const values = {
                carrinho: this.cartId,
                livro: book,
                quantidade: item.quantidade + quantidade
              }
              const data = await cartService.changeQuantity(values, id);
              this.getBooksCart(this.cartId)
              console.log('a')
            } catch (error) {
              console.log(error); // Lidar com exceções
            }
          }
          ,
          async addBookCart(book, quantidade){
            try {
              console.log(book)
              const values = {
                carrinho: this.cartId,
                livro: book,
                quantidade: quantidade
              }
              if(this.booksCart.length > 0){
                for (let item of this.booksCart) {
                  if(item.livro.id == book){
                    values.quantidade = item.quantidade + quantidade
                    this.deleteBookCart(item.id)
                  }
                }
              }
              const data = await cartService.addBookCart(values);
              this.getBooksCart()
            } catch (error) {
              console.log(error); // Lidar com exceções
            }
          },
          async deleteBookCart(id){
            try {
              const data = await cartService.deleteBookCart(id);
              this.getBooksCart()
            } catch (error) {
              console.log(error); // Lidar com exceções
            }
          },
    }
});