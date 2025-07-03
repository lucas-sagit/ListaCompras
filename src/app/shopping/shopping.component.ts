import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemLista } from '../item_lista';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
// import html2canvas from 'html2canvas';

@Component({
  selector: 'app-shopping',
  imports: [FormsModule, CommonModule],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.css'
})

export class ShoppingComponent {

  removerItem(item: ItemLista) {
    const index = this.lista.indexOf(item);
    if (index > -1) {
      this.lista.splice(index, 1);
      this.reculcularIds();
    }
  }

  editarItem(item: ItemLista) {
    const novoNome = prompt('Editar item:', item.nome);
    if (novoNome !== null && novoNome.trim() !== '') {
      // Verifica se o novo nome já existe na lista (comparação sem acento e sem diferenciar maiúsculas/minúsculas)
      const itemExiste = this.lista.some(el =>
        el.nome?.toLowerCase() === novoNome.toLowerCase() && el.id !== item.id
      );
      item.nome = novoNome.trim();
    }
  }

  reculcularIds() {
    this.lista.forEach((item, index) => {
      item.id = index + 1;
    })
  }

  item: string = '';
  lista: ItemLista[] = [];

  adicionarItem() {
    const nomeItem = this.item?.trim();

    if (!nomeItem) {
      alert('Por favor, insira um item.');
      return;
    }

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

  calcularTotalGeral(): number {
    return this.lista.reduce((total, item) => {
      const quantidade = Number(item.quantidade) || 0;
      const valor = Number(item.valor) || 0;
      return total + (quantidade * valor);
    }, 0);
  }

  formatarValor(valor: number): string {
    // Exibe com 2 casas decimais (ex: 2.5 -> '2,50')
    return (valor || 0).toFixed(2).replace('.', ',');
  }

 atualizarValor(event: Event, atributo: any) {
  const input = event.target as HTMLInputElement;
  const valorDigitado = input?.value || '';

  const soNumeros = valorDigitado.replace(/\D/g, '');
  const valorConvertido = parseFloat((parseInt(soNumeros || '0', 10) / 100).toFixed(2));

  atributo.valor = valorConvertido;
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

    // Título
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Lista de Compras", 14, 15);

    // Data no canto superior direito
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Data: ${dataHoraFormatada}`, 170, 15, { align: 'right' });

    // Corpo da tabela
    const body = this.lista.map((item: any, index: number) => [
      index + 1,
      item.nome,
      item.quantidade
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['#', 'Item', 'Quantidade']],
      body,
      theme: 'striped',
      headStyles: {
        fillColor: [33, 150, 243], // azul Material
        textColor: 255,
        halign: 'center',
        valign: 'middle',
      },
      bodyStyles: {
        fontSize: 10,
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 130 }, // Item (maior)
        2: { cellWidth: 30, halign: 'center' },
      },
    });

    // Totais
    const totalQuantidade = this.lista.reduce((sum, item) => sum + (Number(item.quantidade) || 0), 0);
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Definindo as posições alinhadas com as colunas da tabela
    const colIdX = 15;        // alinhado com a coluna "#"
    const colQuantidadeX = 170; // alinhado com "Quantidade"

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    // Alinha "Total de itens" à esquerda na primeira coluna
    doc.text(`Total de itens: ${this.lista.length}`, colIdX, finalY, { align: 'left' });

    // Alinha "Quantidade total" à direita na última coluna
    doc.text(`Quantidade total: ${totalQuantidade}`, colQuantidadeX, finalY, { align: 'right' });


    // Salvar
    doc.save('lista.pdf');
  }
}

