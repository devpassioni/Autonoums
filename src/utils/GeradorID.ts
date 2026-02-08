 class GeradorID {
    private static ultimoID = 0;

    static gerar(): number {
        this.ultimoID++;
        return this.ultimoID;
    }

    static setUltimoID(id: number): void {
        this.ultimoID = id;
    }

    static getUltimoID(): number {
        return this.ultimoID;
    }
}



 class GeradorIDCliente {
    private static ultimoIDCliente = 0;

    static gerarIDCliente(): number{
        this.ultimoIDCliente++
        return this.ultimoIDCliente;

    }
    static setUltimoIDCliente(id: number): void {
        this.ultimoIDCliente = id;
    }

    static getUltimoIDCliente(): number {
        return this.ultimoIDCliente;

}
}




 class GeradorIDOrcamento {
    private static ultimoIDOrcamento = 0;

    static gerarIDOrcamento(): number{
        this.ultimoIDOrcamento++
        return this.ultimoIDOrcamento;

    }
    static setUltimoIDCliente(id: number): void {
        this.ultimoIDOrcamento = id;
    }

    static getUltimoIDCliente(): number {
        return this.ultimoIDOrcamento;

}
}

export class GeradorIDGeral {
    private static ultimoIDCliente = 0;
    private static ultimoIDOrcamento = 0;
    private static ultimoIDFuncionario = 0;

    static Gcliente(): number {
        return ++this.ultimoIDCliente;
    }

    static Gorcamento(): number {
        return ++this.ultimoIDOrcamento;
    }

    static Gfuncionario(): number {
        return ++this.ultimoIDFuncionario;
    }
}