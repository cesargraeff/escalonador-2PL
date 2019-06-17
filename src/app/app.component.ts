import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Escalonador } from './classes/Escalonador';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  transactions: any[] = [];
  transactionForm: FormGroup;
  historia: string[] = [];
  deadlock: boolean = false;

  constructor(
    private fb: FormBuilder
  ){}

  ngOnInit(){

    this.transactions = localStorage.getItem('transactions') ? JSON.parse(localStorage.getItem('transactions')) : [];
    this.transactionForm = this.createTransactionForm();
  }

  createTransactionForm(){
    return this.fb.group({
      id : ['', [Validators.required]],
      historia : ['', [Validators.required, /*Validators.pattern('((r|w)\\[[A-Za-z]\\])*')*/]]
    });
  }


  execute(transactions: number[]){

    const t = this.transactions.filter((value, index) => {
      return transactions.indexOf(index) > -1;
    });

    const escalonador: Escalonador = new Escalonador(t);
    const res = escalonador.escalonar();
    this.historia = res.historia;
    this.deadlock = res.deadlock;

    console.log(escalonador);
  }

  addTransaction(){
    this.transactions.push(this.transactionForm.value);
    this.transactionForm.reset();
    this.saveTransactions();
  }

  deleteTransaction(index: number){
    if('Tem certeza que deseja remover?'){
      this.transactions.splice(index, 1);
      this.saveTransactions();
    }
  }

  saveTransactions(){
    localStorage.setItem('transactions',JSON.stringify(this.transactions));
  }

}
