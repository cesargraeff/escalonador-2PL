export class Bloqueio
{
    
    static readonly COMPARTILHADO = 's';
    static readonly EXCLUSIVO = 'x';

    dado: string;
    tipo: string;
    transacao: number;

    constructor(dado: string, tipo: string, transacao: number){
        this.dado = dado;
        this.tipo = tipo;
        this.transacao = transacao;
    }

}