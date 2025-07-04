import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemLista } from '../item_lista';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


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

    const itemLista = new ItemLista();
    itemLista.id = this.lista.length + 1;
    itemLista.nome = nomeItem;
    itemLista.quantidade = "1";

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
  doc.text(`Data: ${dataHoraFormatada}`, 200, 15, { align: 'right' });

  // Montar dados da tabela
  const body = this.lista.map((item, index) => {
    const quantidade = Number(item.quantidade) || 0;
    const valor = Number(item.valor) || 0;
    const valorTotalItem = quantidade * valor;
    return [
      index + 1,
      item.nome ?? '',
      quantidade,
      valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      valorTotalItem.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    ];
  });

  // Cabeçalho
  const head = [['#', 'Item', 'Quantidade', 'Valor', 'Valor Total']];

  autoTable(doc, {
  startY: 25,
  head,
  body,
  theme: 'striped',
  headStyles: {
    fillColor: [33, 150, 243],
    textColor: 255,
    halign: 'center',
    valign: 'middle',
  },
  bodyStyles: {
    fontSize: 10,
    valign: 'middle',
  },
  columnStyles: {
    0: { cellWidth: 10, halign: 'center' },  // #
    1: { cellWidth: 45 },                    // Item
    2: { cellWidth: 25, halign: 'center' },  // Quantidade
    3: { cellWidth: 30, halign: 'right' },   // Valor
    4: { cellWidth: 80, halign: 'right' },   // Valor Total
  },
});


  // Totais
  const totalItens = this.lista.length;
  const totalQuantidade = this.lista.reduce((sum, item) => sum + (Number(item.quantidade) || 0), 0);
  const valorTotalGeral = this.lista.reduce(
    (sum, item) => sum + ((Number(item.quantidade) || 0) * (Number(item.valor) || 0)),
    0
  );

  // Posição abaixo da tabela
     const finalY = (doc as any).lastAutoTable.finalY + 10;


  // Ajustar colunas para os rodapés ficarem na mesma linha
  const posicoesX = {
    totalItens: 20,      // à esquerda
    quantidadeTotal: 80, // centro
    valorTotalLabel: 160,// mais à direita
    valorTotalValor: 200 // mais à direita
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.text(`Total de itens: ${totalItens}`, posicoesX.totalItens, finalY, { align: 'left' });
  doc.text(`Qtd total: ${totalQuantidade}`, posicoesX.quantidadeTotal, finalY, { align: 'center' });
  doc.text(``, posicoesX.valorTotalLabel, finalY, { align: 'right' });
  doc.text(valorTotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), posicoesX.valorTotalValor, finalY, { align: 'right' });

  // Salvar PDF
  doc.save('lista.pdf');
}

}

