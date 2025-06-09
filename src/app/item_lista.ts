export class ItemLista {
  id?: number;
  nome?: string;
  comprar: boolean = false;
  agora: Date = new Date();
  quantidade: String | undefined;
  mensagemErro: String | undefined;
}
