import {Orcamento} from "../models/Orcamento";
import {Persistencia} from "../utils/Persistencia";

export class GerenciadorOrcamento{
    private orcamentos: Orcamento[] = []

    constructor(){
        this.carregar()
    }

    private carregar(): void {
        const dados = Persistencia.ler('orcamentos.json');
        this.orcamentos = dados.map((o: any) => {
            const orc = new Orcamento(o.nomeCliente, o.diasPrevistos);
            orc.id = o.id;
            orc.status = o.status;
            orc.equipe = o.equipe;
            orc.itens = o.itens;
            return orc;
        });
    }

    private sincronizar(){
        Persistencia.salvar('orcamentos.json',this.orcamentos);
    }
public adicionar(orcamento: Orcamento): void{
    this.orcamentos.push(orcamento);
    this.sincronizar()
}

public listarPendentes(): void{
    this.orcamentos.filter(o => o.status == `PENDENTE`);
}

public listarEncerrados(): void{
    this.orcamentos.filter(o => o.status === `APROVADO`);
}


}