/***
PROBLEMA 2.2: Encontrando um Alvo em um Labirinto
***/

// Definição dos Dados

// Posição
// Uma posição é um ponto no labirinto
// Pode estar em um dos estados abaixo:
const POSICAO = {
  VAZIA: " ", // posição vazia
  BLOQUEADA: "X", // essa posição não pode ser ocupada
  INICIAL: "I", // posição inicial no labirinto
  FINAL: "F", // posição final desejada
  CAMINHO: "*"
}; // posição livre

//Ex:
const P1 = POSICAO.BLOQUEADA; // 'X'
const P2 = POSICAO.CAMINHO; // '*'

// Posição no labirinto: Pos
// Uma posição é definida por: linha(lin), coluna(col), estado e posição anterior (pai)
class Pos {
  constructor(lin, col) {
    this.lin = lin;
    this.col = col;
  }
  
  // produz true se a posição atual é igual à posição fornecida
  igual(pos) {
    return ((this.lin == pos.lin) &&
            (this.col == pos.col));
  }
  
  // retorna uma nova posição acima da atual
  acima() {
    return new Pos(this.lin - 1, this.col);
  }

  // retorna uma nova posição à direita da atual
  direita() {
    return new Pos(this.lin, this.col + 1);
  }

  // retorna uma nova posição abaixo da atual
  abaixo() {
    return new Pos(this.lin + 1, this.col);
  }

  // retorna uma nova posição à esquerda da atual
  esquerda() {
    return new Pos(this.lin, this.col - 1);
  }

  // gera um id para o objeto em questão
  getKey() {
    return this.lin.toString() +
           this.col.toString();
  }   
  
} // class Pos





// Ex1:
const pos1 = new Pos(8, 0);
const pos2 = new Pos(0, 8);
const pos3 = new Pos(0, 0);
const pos4 = new Pos(2, 1);
const pos5 = new Pos(4, 5);
const pos6 = new Pos(7, 5);
const pos7 = new Pos(8, 8);

// Lista de posições: LPos
// Array contendo várias posições
// Ex:
const LPos3 = [new Pos(0, 1), new Pos(1, 0)];
const LPos4 = [new Pos(1, 1), new Pos(2, 2)];
const LPos5 = [new Pos(4, 6), new Pos(5, 5), new Pos(4, 4)];
const LPos6 = [new Pos(6, 5), new Pos(8, 5), new Pos(7, 4)];
const LPos7 = [new Pos(7, 8)];

// Labirinto: Lab
// É uma matriz com n linhas, m colunas, uma posição inicial (posi) e uma final (posf).
// O labirinto é preenchido aleatoriamente com obstáculos.
// Os obstáculos não ocupam mais do que x% das células do labirinto.
class Labirinto {
  constructor(lin, col, posi, posf, x) {
    this.lin = lin;
    this.col = col;
    this.posi = posi;
    this.posf = posf;
    this.x = x;
    this.grid = this.criarLabirinto();
  } // constructor

  criarLabirinto() {
    let lab = this.criarBloqueios(this.criarGrid());
    lab[this.posi.lin][this.posi.col] = POSICAO.INICIAL;
    lab[this.posf.lin][this.posf.col] = POSICAO.FINAL;
    return lab;
  } // criarLabirinto()

  // cria a matriz com céluas vazias
  criarGrid() {
    let matriz = [];
    for (let i = 0; i < this.lin; i++) {
      matriz[i] = []; // cada linha é um novo vetor
      for (let j = 0; j < this.col; j++) {
        matriz[i][j] = POSICAO.VAZIA;
      }
    }
    return matriz;
  } // criarGrid()

  // coloca um 'X' em lugares aleatórios no labirinto
  criarBloqueios(lab) {
    // preencho o grid com percentual x de obstáculos
    for (let i = 0; i < this.lin; i++) {
      for (let j = 0; j < this.col; j++) {
        if (Math.random() < this.x) {
          lab[i][j] = POSICAO.BLOQUEADA;
        }
      }
    }
    return lab;
  }

  // verifica se o alvo foi atingido
  // produz true se a posição fornecida for no alvo
  noAlvo(pos) {
    return pos.igual(this.posf);
  }

  // visualiza o labirinto na console
  visualizar() {
    console.log(this.grid.join("\n"));
  }
  
  // muda o conteúdo da posição para o valor fornecido
  setPos(pos, valor) {
    this.grid[pos.lin][pos.col] = valor;
  } 

  // atribui o caminho ao labirinto a partir da lista com os caminhos fornecidos
  setCaminho(lpos) {
    for (let i = 0; i < lpos.length; i++) {
      this.setPos(lpos[i], POSICAO.CAMINHO);
    }
  }
  
  // retorna um novo labirinto criado a partir do lab atual
  
  static copiar(lab) {
    let newLab =  new Labirinto(lab.lin, lab.col, lab.posi, lab.posf, lab.x);
    // varro o grid e copio elemento a elemento
    for (let i = 0; i < lab.lin; i++) {
      for (let j = 0; j < lab.col; j++) {
        newLab.grid[i][j] = lab.grid[i][j];                
      }   
    }
    return newLab;
  }
  
  
  // retorno o conteúdo da posição fornecida
  getPos(pos) {
    return this.grid[pos.lin][pos.col];
  }
  
  /* Dando apenas uma passo, quais seriam os próximos
     movimentos possíveis de serem feitos a partir da posição fornecida?
     Produz uma lista de movimentos possíveis no sentido horário a partir da posição forneceida 
     Um movimento possível respeita os limites do labirinto e os bloqueios */
  // proximosMovimentos(Pos): LPos
  
  proximosMovimentos(pos) {
    let lpos = [];
    // é possível dar um passo acima da posição fornecida?
    if (this.moverAcimaOK(pos)) { lpos.push(pos.acima()); }
    // é possível dar um passo à direita da posição fornecida?
    if (this.moverDireitaOK(pos)) { lpos.push(pos.direita()); }
    // é possível dar um passo abaixo da posição fornecida?
    if (this.moverAbaixoOK(pos)) { lpos.push(pos.abaixo()); }
    // é possível dar um passo à esquerda da posição fornecida?
    if (this.moverEsquerdaOK(pos)) { lpos.push(pos.esquerda()); }
    // retorno a lista de movimentos possíveis
    return lpos;
  }
  
  // a partir da posição fornecida produz true se o movimento
  // para cima é possível considerando as fronteiras
  // do labirinto e os obstáculos
  moverAcimaOK(pos) {
    if (pos.acima().lin >= 0) {
      return (this.getPos(pos.acima()) !== POSICAO.BLOQUEADA);
    } else {
      return false;
    }
  } //moverAcimaOK(pos)

  moverDireitaOK(pos) {
    if (pos.direita().col <= this.col - 1) {
      return (this.getPos(pos.direita()) !== POSICAO.BLOQUEADA);
    } else {
      return false;
    }
  } //moverDireitaOK(pos)

    moverAbaixoOK(pos) {
    if (pos.abaixo().lin <= this.lin - 1) {
      return (this.getPos(pos.abaixo()) !== POSICAO.BLOQUEADA);
    } else {
      return false;
    }
  } //moverAbaixoOK(pos)

    moverEsquerdaOK(pos) {
    if (pos.esquerda().col >= 0) {
      return (this.getPos(pos.esquerda()) !== POSICAO.BLOQUEADA);
    } else {
      return false;
    }
  } //moverEsquerdaOK(pos)
    
} // class Labirinto

// Ex:
// Um labirinto com:
// - 9 linhas
// - 9 colunas
// - início em p1(8, 0)
// - objetivo em p2(0,8)
// - taxa de bloqqueio = 15%
let lab1 = new Labirinto(9, 9, pos1, pos2, 0.15);

// Um labirinto usado nos testes
let lab2 = new Labirinto(9, 9, pos1, pos2, 0);
lab2.setPos(new Pos(2, 0), POSICAO.BLOQUEADA);
lab2.setPos(new Pos(3, 1), POSICAO.BLOQUEADA);
lab2.setPos(new Pos(4, 2), POSICAO.BLOQUEADA);
lab2.setPos(new Pos(0, 4), POSICAO.BLOQUEADA);
lab2.setPos(new Pos(3, 5), POSICAO.BLOQUEADA);
lab2.setPos(new Pos(7, 6), POSICAO.BLOQUEADA);
lab2.setPos(new Pos(8, 7), POSICAO.BLOQUEADA);


// Testes:

QUnit.module("Problema do Labirinto");
QUnit.test("moverAcimaOK", function (assert) {
  assert.deepEqual(lab2.moverAcimaOK(pos3), false);
  assert.deepEqual(lab2.moverAcimaOK(pos4), true);
  assert.deepEqual(lab2.moverAcimaOK(pos5), false);
});

QUnit.module("Problema do Labirinto");
QUnit.test("moverDireitaOK", function (assert) {
  assert.deepEqual(lab2.moverDireitaOK(pos5), true);
  assert.deepEqual(lab2.moverDireitaOK(pos6), false);
  assert.deepEqual(lab2.moverDireitaOK(pos7), false);
});

QUnit.module("Problema do Labirinto");
QUnit.test("moverAbaixoOK", function (assert) {
  assert.deepEqual(lab2.moverAbaixoOK(pos3), true);
  assert.deepEqual(lab2.moverAbaixoOK(pos4), false);
  assert.deepEqual(lab2.moverAbaixoOK(pos7), false);
});

QUnit.module("Problema do Labirinto");
QUnit.test("moverEsquerdaOK", function (assert) {
  assert.deepEqual(lab2.moverEsquerdaOK(pos3), false);
  assert.deepEqual(lab2.moverEsquerdaOK(pos4), false);
  assert.deepEqual(lab2.moverEsquerdaOK(pos5), true);
});

QUnit.module("Problema do Labirinto");
QUnit.test("proximosMovimentos", function (assert) {
  assert.deepEqual(lab2.proximosMovimentos(pos3), LPos3);
  assert.deepEqual(lab2.proximosMovimentos(pos4), LPos4);
  assert.deepEqual(lab2.proximosMovimentos(pos5), LPos5);
  assert.deepEqual(lab2.proximosMovimentos(pos6), LPos6);
  assert.deepEqual(lab2.proximosMovimentos(pos7), LPos7);
});

/* O Algoritmo Busca em Largura (BFS)*/

// a partir do labirinto fornecido produz um novo labirinto com as posições que representa o caminho descoberto pelo algoritmo entre a posição inicial e a final
// bfs(Lab): LPos 

// Testes do BFS:

/* Saída do Algoritmo:

   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
----------------------------------------
0  |   |   |   |   | X | * | * | * | F |
----------------------------------------
1  |   |   |   | * | * | * |   |   |   |
----------------------------------------
2  | X |   |   | * |   |   |   |   |   |
----------------------------------------
3  |   | X |   | * |   | X |   |   |   |
----------------------------------------
4  |   |   | X | * |   |   |   |   |   |
----------------------------------------
5  | * | * | * | * |   |   |   |   |   |
----------------------------------------
6  | * |   |   |   |   |   |   |   |   |
----------------------------------------
7  | * |   |   |   |   |   | X |   |   |
----------------------------------------
8  | I |   |   |   |   |   |   | X |   |
----------------------------------------

I = inicio
F = fim
X = bloqueio
* = caminho criado pelo algoritmo

*/

//function bfs(lab) { return []; } // stub

QUnit.module("Problema do Labirinto");
QUnit.test("Busca em Largura", function (assert) {
  const posi = new Pos(8, 0);
  const posC1 = new Pos(7, 0);
  const posC2 = new Pos(6, 0);
  const posC3 = new Pos(5, 0);
  const posC4 = new Pos(5, 1);
  const posC5 = new Pos(5, 2);
  const posC6 = new Pos(5, 3);
  const posC7 = new Pos(4, 3);
  const posC8 = new Pos(3, 3);
  const posC9 = new Pos(2, 3);
  const posC10 = new Pos(1, 3);
  const posC11 = new Pos(1, 4);
  const posC12 = new Pos(1, 5);
  const posC13 = new Pos(0, 5);
  const posC14 = new Pos(0, 6);
  const posC15 = new Pos(0, 7);
  const posf = new Pos(0, 8);
  // lista com as posições do caminho
  const lPosC = [posi, posC1, posC2, posC3, posC4, posC5, posC6, posC7, posC8, 
                posC9, posC10, posC11, posC12, posC13, posC14, posC15, posf];
  let lab3 = Labirinto.copiar(lab2);
  lab3.setCaminho(lPosC);
  assert.deepEqual(bfs(lab2), lab3);
});







function bfs(lab) {
  let filaPesquisa = [];
  // crio uma cópia do labirinto
  let newLab = Labirinto.copiar(lab);
  // inicio a fila de pesquisa com o ponto inicial
  filaPesquisa.push(newLab.posi);
  // registro das posições que já foram verificadas
  let posicoesVerificadas = new Map();
  let pm = []; // proximos movimentos
  while (filaPesquisa.length > 0) {
    // retiro a primeira posição da fila
    let pos = filaPesquisa.shift();
    // cheguei no alvo?
    if (newLab.noAlvo(pos)) {
      return pos.getKey();        
      } else { // ainda não cheguei no alvo
        pm = newLab.proximosMovimentos(pos);
        for (let i = 0; i < pm.length; i++) {
          if (!posicoesVerificadas.has(pm[i].getKey())) {
              posicoesVerificadas.set(pm[i].getKey());
              filaPesquisa.push(pm[i]);
          }
        }
      }   
  } // while
  // se o while terminou e cheguei até aqui é porque o alvo não foi encontrado ('ANE')
  return 'ANE';
} //bfs


  


