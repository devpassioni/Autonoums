import {Obra} from "../models/Obra";
import { Persistencia } from '../utils/Persistencia';

export class GerenciarObras{
    private obras: Obra[] = [];
    constructor(){
        this.carregar();
    }


    private carregar(): void {
        const dados = Persistencia.ler('obrasemandamento.json');
        this.obras = dados.map((ob: any) => {
            const obra = new Obra(ob.orcamento, new Date(ob.dataInicio));
            obra.status = ob.status;
            return obra;
        });
    }

    private sincronizar(): void {
        Persistencia.salvar('obrasemandamento.json', this.obras);
    }

public adicionarObra(obra: Obra): void{
    this.obras.push(obra);
    this.sincronizar();
}

public listarObrasAtivas(): Obra[] {
    return this.obras.filter(o => o.status === `EM_ANDAMENTO`);
}

public listarObrasEncerradas(): Obra[] {
    return this.obras.filter(o => o.status === `CONCLUIDA`);
}

}