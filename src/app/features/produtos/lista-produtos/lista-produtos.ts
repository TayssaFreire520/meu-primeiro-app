import { Component, signal, computed, effect, inject } from '@angular/core';
import { ProdutosService } from '../produtos.service';

import { Produto } from '../produto/produto';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lista-produtos',
  imports: [Produto, MatButtonModule],
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.css',
})
export class ListaProdutos {
  private produtosService = inject(ProdutosService);
  //========================================
  //                   SIGNALS
  //=============================================
  //Writesignal -> signal (reativo) que permite alterações (com set ou update)
  produtos = signal<{ nome: string; preco: number }[]>([]); //add hj (13.08.26) papai, Aprendndo API

  carregando = signal(true);

  produtoSelecionado = signal<string | null>(null);

  // o começo de uma nova era (Carrinho de compras)
  carrinho = signal<{ nome: string; preco: number }[]>([]);

  erro = signal<string | null>(null);

  //computed
  totalProdutos = computed(() => this.produtos().length); // observa outro sinal automaticamente

  valorTotal = computed(() => {
    return this.produtos().reduce((total, item) => total + item.preco, 0); // reduce -> pega so quem tá interessada
  }); // essa linha faz a soma dos produtos.

  quantidadeCarrinho = computed(() => this.carrinho().length);

  totalCarrinho = computed(() => {
    return this.carrinho().reduce((total, item) => total + item.preco, 0);
  });

  constructor() {
    // carrega da API
    this.carregarProdutos();

    // effects continuam iguais
    effect(() => {
      console.log('Lista de produtos alterada:', this.produtos());
    });

    effect(() => {
      console.log('Valor total atualizado:', this.valorTotal());
    });
    effect(() => {
      if (typeof document !== 'undefined') {
        document.title = `(${this.totalProdutos()}) Minha Loja`;
      }
    });
  } // fim do constructor

  carregarProdutos() {
    this.erro.set(null); // limpa erro anterior
    this.carregando.set(true);
    this.produtosService.buscarProdutos().subscribe({
      next: (dados) => {
        const produtos = this.produtosService.transformarProdutos(dados);
        this.produtos.set(produtos);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos:', erro);
        this.erro.set('Erro ao carregar produtos. Verifique sua conexão e tente novamente.');
        this.carregando.set(false);
      },
    });
  }

  exibirProduto(nome: string) {
    this.produtoSelecionado.set(nome); // Aqui você pode atualizar o estado, abrir modal, etc.
  }

  // update -> adiciona um item do writeblesignal
  adicionarProduto() {
    this.produtos.update((listaAtual) => [
      ...listaAtual,
      { nome: 'Teclado', preco: 250 },
      { nome: 'Monitor Curvo', preco: 4999.99 },
    ]);
  }
  //
  substituirProdutos() {
    this.produtos.set([{ nome: 'Produto novo', preco: 0 }]);
  }

  adicionarAoCarrinho(produto: { nome: string; preco: number }) {
    this.carrinho.update((listaAtual) => [...listaAtual, produto]);
  }
}
