import { Operacao } from './Operacao';

export class Transacao
{

    private id: number;

    private index: number = 0;

    private operacoes: Operacao[] = [];

    constructor(id: string, historia: string)
    {
        this.id = +id;

        const historias: any[] = historia.split(' ');
        for(let i=0; i < historias.length; i++){
            this.addOperacao(historias[i]);
        }
        this.operacoes.push(new Operacao(Operacao.COMMIT));
    }

    getId(): number{
        return this.id;
    }

    getOperacao(): Operacao{
        return this.operacoes[this.index];
    }

    nextOperacao(){
        this.index++;
    }

    abort(){
        this.index = 0;
    }

    private addOperacao(operacao: string){
        const op = operacao.slice(0,1);
        const dado = operacao.slice(2,3);

        const o: Operacao = new Operacao(op,dado);
        this.operacoes.push(o);
    }
    
}