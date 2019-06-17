export class Operacao
{

    static readonly WRITE = 'w';
    static readonly READ = 'r';
    static readonly COMMIT = 'c';

    private operacao: string;
    private dado: string;

    constructor(operacao: string, dado: string = null){
        this.operacao = operacao;
        this.dado = dado;
    }

    getDado() : string{
        return this.dado;
    }

    getOperacao() : string{
        return this.operacao;
    }

}