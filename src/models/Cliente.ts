import {GeradorIDGeral} from '../utils/GeradorID'
type tipo = "Pessoa Juridica" | "Pessoa Fisica";
export class Cliente{
    public id: number;
    constructor(
        public nome: string,
        public telefone: string,
        public endereco: string,
        public tipo: tipo
    ){
        this.id = GeradorIDGeral.Gcliente();
    }

}