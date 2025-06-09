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
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR');
  const doc = new jsPDF();

  const margin = 10;
  const lineHeight = 10;
  let y = margin;

  // Título
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Lista de Compras", margin, y);

  // Data no canto superior direito
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Data: ${dataFormatada}`, 160, y); // x = 160 coloca à direita

  y += lineHeight + 2;

  // Cabeçalho da tabela
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Nº", margin, y);
  doc.text("Item", margin + 20, y);

  y += lineHeight;

  // Conteúdo da lista
  doc.setFont("helvetica", "normal");
  this.lista.forEach((item: any, index: number) => {
    doc.text(`${index + 1}`, margin, y);
    doc.text(`${item.nome}`, margin + 20, y);
    y += lineHeight;
  });

  // Espaço final e total
  y += lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text(`Total de itens: ${this.lista.length}`, margin, y);

  // Salvar PDF
  doc.save('lista_de_compras.pdf');
}


}

