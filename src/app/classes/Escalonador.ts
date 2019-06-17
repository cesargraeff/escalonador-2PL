import { Bloqueio } from './Bloqueio';
import { Operacao } from './Operacao';
import { Transacao } from './Transacao';
import { __asyncDelegator } from 'tslib';
export class Escalonador
{

    private transacoes: Transacao[] = [];
    private bloqueios: Bloqueio[] = [];
    private historia: string[] = [];
    
    constructor(transacoes: any[]){
        for(let i=0; i < transacoes.length; i++){
            this.addTransacao(transacoes[i]);
        }
    }

    escalonar(){

        while(this.transacoes.length > 0){

            let executou = false;

            for(let i = 0; i < this.transacoes.length; i++){

                const transacao: Transacao = this.transacoes[i];
                const operacao: Operacao = transacao.getOperacao();

                if(operacao.getOperacao() == Operacao.COMMIT){
                    this.historia.push('c'+transacao.getId());
                    this.desbloqueia(transacao.getId());
                    this.transacoes.splice(i,1);
                    executou = true;
                    i--;
                }else{

                    let tipo;
                    if(operacao.getOperacao() == Operacao.READ){
                        tipo = Bloqueio.COMPARTILHADO;
                    }else if(operacao.getOperacao() == Operacao.WRITE){
                        tipo = Bloqueio.EXCLUSIVO;
                    }
                    
                    if(this.bloqueio(operacao.getDado(),tipo,transacao.getId())){
                        this.historia.push(operacao.getOperacao()+transacao.getId()+'['+operacao.getDado()+']');
                        transacao.nextOperacao();
                        executou = true;
                    }
                }
            }

            if(!executou){
                alert('DEADLOCK');
                this.deadlock();
                break;
            }
        }

        return this.historia;
    }

    private deadlock(){

    }

    private bloqueio(dado: string, tipo: string, transacao: number){
        let permite = true;
        let adiciona = true;

        if(tipo == Bloqueio.COMPARTILHADO){
            for(let i = 0; i< this.bloqueios.length; i++){
                const bloqueio: Bloqueio = this.bloqueios[i];
                if(bloqueio.dado == dado){
                    if(bloqueio.tipo == Bloqueio.EXCLUSIVO){
                        if(bloqueio.transacao == transacao){
                            adiciona = false;
                        }else{
                            permite = false;
                        }
                    }

                    if(bloqueio.tipo == Bloqueio.COMPARTILHADO && bloqueio.transacao == transacao){
                        adiciona = false;
                    }
                }
            }
        }else if (tipo == Bloqueio.EXCLUSIVO){
            for(let i = 0; i< this.bloqueios.length; i++){
                const bloqueio: Bloqueio = this.bloqueios[i];
                if(bloqueio.dado == dado){
                    if(bloqueio.transacao == transacao){
                        if(bloqueio.tipo == Bloqueio.COMPARTILHADO){

                            let existe = false;
                            for(let i = 0; i< this.bloqueios.length; i++){
                                const bloqueio: Bloqueio = this.bloqueios[i];
                                if(bloqueio.dado == dado && bloqueio.tipo == Bloqueio.COMPARTILHADO && bloqueio.transacao != transacao){
                                    existe = true;
                                }
                            }

                            // TRANSFORMA EM EXCLUSIVO

                            if(!existe){
                                adiciona = false;
                                bloqueio.tipo = Bloqueio.EXCLUSIVO;
                                const bloq = this.historia.indexOf('ls'+bloqueio.transacao+'['+bloqueio.dado+']');
                                this.historia[bloq] = 'lx'+bloqueio.transacao+'['+bloqueio.dado+']';
                            }
                            

                        }else if(bloqueio.tipo == Bloqueio.EXCLUSIVO){
                            adiciona = false;
                        }
                    }else{
                        permite = false;
                    }
                }
            }
        }

        if(permite){
            if(adiciona){
                const bloqueio = new Bloqueio(dado,tipo,transacao);
                this.bloqueios.push(bloqueio);
                this.historia.push(`l${bloqueio.tipo}${bloqueio.transacao}[${bloqueio.dado}]`);
            }
            return true;
        }

        return false;
    }


    private desbloqueia(transacao: number){
        for(let i = 0; i< this.bloqueios.length; i++){
            const bloqueio: Bloqueio = this.bloqueios[i];
            if(bloqueio.transacao == transacao){
                this.historia.push(`u${bloqueio.tipo}${bloqueio.transacao}[${bloqueio.dado}]`);
                this.bloqueios.splice(i,1);
                i--;
            }
        }
    }


    private addTransacao(transacao: any){
        const t: Transacao = new Transacao(transacao.id, transacao.historia);
        this.transacoes.push(t);
    }

}