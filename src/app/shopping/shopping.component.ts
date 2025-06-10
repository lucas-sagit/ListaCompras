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

removerItem(item: ItemLista){
  const index = this.lista.indexOf(item);
  if (index > -1) {
    this.lista.splice(index, 1);
    this.reculcularIds();
  }
}

// Método para recalcular os IDs dos itens após remoção
  reculcularIds() {
    this.lista.forEach((item, index) => {
      item.id = index + 1;
  })
}

  item: string = '';
  lista: ItemLista[] = [];

  adicionarItem() {
    const nomeItem = this.item?.trim();

    // Verifica se o campo está vazio
    if (!nomeItem) {
      alert('Por favor, insira um item.');
      return;
    }

    // Verifica se o item já foi adicionado (comparação sem acento e sem diferenciar maiúsculas/minúsculas)
    const itemExiste = this.lista.some(el =>
      el.nome?.toLowerCase() === nomeItem.toLowerCase()
    );

    if (itemExiste) {
      alert(`O item "${nomeItem}" Já foi adicionado à lista.`);
      return;
    }

    // Criação do novo item
    const itemLista = new ItemLista();
    itemLista.id = this.lista.length + 1;
    itemLista.nome = nomeItem;
    itemLista.quantidade = "1"; // valor padrão como string

    // Adiciona à lista e limpa o campo
    this.lista.push(itemLista);
    this.item = '';
  }


  limparLista() {

    if (this.lista.length === 0) {
      alert('A lista já está vazia.');
      return;
    }

    this.lista = [];
  }

  downloadPDF() {

    if (this.lista.length === 0) {
      alert('A lista está vazia, adicione itens antes de gerar o PDF.');
      return;
    }

    const agora = new Date();
    const dataHoraFormatada = agora.toLocaleString('pt-BR');
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
    doc.text(`Data: ${dataHoraFormatada}`, 160, y); // x = 160 coloca à direita

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

