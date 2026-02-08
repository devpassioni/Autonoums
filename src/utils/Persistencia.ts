import * as fs from 'fs';
import * as path from 'path';

export class Persistencia{

    private static pastaData = path.resolve(__dirname, '../../data');


    static salvar(arquivo: string, dados: any): void{
        const caminho = path.join(this.pastaData,arquivo);
        const json = JSON.stringify(dados,null, 2);
        fs.writeFileSync(caminho,json, 'utf8');
    }

    static ler(arquivo: string): any{
        const caminho = path.join(this.pastaData,arquivo);
        if (!fs.existsSync(caminho)) return [];
    
        const conteudo = fs.readFileSync(caminho, 'utf-8');
        return JSON.parse(conteudo);
    }



}