import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemLista } from '../item_lista';

@Component({
  selector: 'app-shopping',
  imports: [FormsModule, CommonModule],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.css'
})
export class ShoppingComponent {

  item: string='';
  lista: ItemLista[] = [];



  adicionarItem() {
    let itemLista = new ItemLista();
    itemLista.nome = this.item;
    itemLista.id = this.lista.length + 1;

    this.lista.push(itemLista);

    this.item ="";
  }

  item_riscado(item: ItemLista) {
    item.comprado = !item.comprado;
  }

  limparLista() {
    this.lista = [];
  }
}

