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

    public sincronizar(){
        Persistencia.salvar('orcamentos.json',this.orcamentos);
    }
public adicionar(orcamento: Orcamento): void{
    this.orcamentos.push(orcamento);
    this.sincronizar()
}

public listarPendentes(): Orcamento[]{
   return this.orcamentos.filter(o => o.status == `PENDENTE`);
}

public listarEncerrados(): Orcamento[]{
    return this.orcamentos.filter(o => o.status === `APROVADO`);
}

public buscarPorId(id: number): Orcamento | undefined {
        return this.orcamentos.find(o => o.id === id);
    }


public listarTodos(): Orcamento[]{
    return this.orcamentos;
}

public aprovarOrcamento(id: number): boolean {
        const orcamento = this.buscarPorId(id);
        if (!orcamento) return false;

        orcamento.status = 'APROVADO'; // Muda o status
        this.sincronizar(); // Salva no arquivo
        return true;
    }

}