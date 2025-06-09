import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemLista } from '../item_lista';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-shopping',
  imports: [FormsModule, CommonModule],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.css'
})
export class ShoppingComponent {

  item: string = '';
  lista: ItemLista[] = [];

  adicionarItem() {
    let itemLista = new ItemLista();
    itemLista.nome = this.item;
    itemLista.id = this.lista.length + 1;

    this.lista.push(itemLista);

    this.item = "";
  }

  // comando para riscar o item, mas não vejo necessário, vai ser substituído por um botão de remover.
  // item_riscado(item: ItemLista) {
  //   item.comprar = !item.comprar;
  // }

  removerItem(item: ItemLista) {
    const index = this.lista.indexOf(item);
    if (index > -1) {
      this.lista.splice(index, 1);
    }
  }

  limparLista() {
    this.lista = [];
  }

  downloadPDF() {
    const doc = new jsPDF();
    const element = document.getElementById('lista');

    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        doc.save('lista_de_compras.pdf');
      });
    }
  }
}

