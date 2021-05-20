/***
PROBLEMA 2.2: Encontrando um Alvo em um Labirinto
***/

// Definição dos Dados

// Posição
// Representa o estado que uma posição do labirinto pode estar.
const POSICAO = {
    VAZIA: " ",
    BLOQUEADA: "X",
    INICIAL: "I",
    FINAL: "F",
    CAMINHO: "*"
};

// Posição no labirinto: Pos
class Pos {
    constructor(lin, col, pa) {
        this.lin = lin; // linha
        this.col = col; // coluna
        this.pa = pa; // posição anterior
    }

    // produz true se a posição atual é igual à posição fornecida
    igual(pos) {
        return ((this.lin == pos.lin) &&
            (this.col == pos.col));
    }

    // retorna uma nova posição acima e registra a posição anterior
    acima() {
        return new Pos(this.lin - 1, this.col, this);
    }

    // retorna uma nova posição à direita e registra a posição anterior
    direita() {
        return new Pos(this.lin, this.col + 1, this);
    }

    // retorna uma nova posição abaixo e registra a posição anterior
    abaixo() {
        return new Pos(this.lin + 1, this.col, this);
    }

    // retorna uma nova posição à esquerda e registra a posição anterior
    esquerda() {
        return new Pos(this.lin, this.col - 1, this);
    }

    // gera um id para o objeto em questão
    getKey() {
        return this.lin.toString() + this.col.toString();
    }

} // class Pos

// Labirinto: Lab
// É uma matriz com n linhas, m colunas
// Tem uma posição inicial (posi) e uma final (posf).
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

    // retorno o conteúdo da posição fornecida
    getPos(pos) {
        return this.grid[pos.lin][pos.col];
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
        let newLab = new Labirinto(lab.lin, lab.col, lab.posi, lab.posf, lab.x);
        // varro o grid e copio elemento a elemento
        for (let i = 0; i < lab.lin; i++) {
            for (let j = 0; j < lab.col; j++) {
                newLab.grid[i][j] = lab.grid[i][j];
            }
        }
        return newLab;
    }


    /* Dando apenas uma passo, quais seriam os próximos
       movimentos possíveis de serem feitos a partir da posição fornecida?
       Produz uma lista de movimentos possíveis no sentido horário a partir da posição forneceida 
       Um movimento possível respeita os limites do labirinto e os bloqueios */
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

// Um labirinto usado nos testes
let lab1 = new Labirinto(9, 9, new Pos(8, 0), new Pos(0, 8), 0);
lab1.setPos(new Pos(2, 0), POSICAO.BLOQUEADA);
lab1.setPos(new Pos(3, 1), POSICAO.BLOQUEADA);
lab1.setPos(new Pos(4, 2), POSICAO.BLOQUEADA);
lab1.setPos(new Pos(0, 4), POSICAO.BLOQUEADA);
lab1.setPos(new Pos(3, 5), POSICAO.BLOQUEADA);
lab1.setPos(new Pos(7, 6), POSICAO.BLOQUEADA);
lab1.setPos(new Pos(8, 7), POSICAO.BLOQUEADA);

// Testes
QUnit.module("Problema do Labirinto");
QUnit.test("moverAcimaOK", function (assert) {
    const pos3 = new Pos(0, 0);
    const pos4 = new Pos(2, 1);
    const pos5 = new Pos(4, 5);
    assert.deepEqual(lab1.moverAcimaOK(pos3), false);
    assert.deepEqual(lab1.moverAcimaOK(pos4), true);
    assert.deepEqual(lab1.moverAcimaOK(pos5), false);
});

QUnit.module("Problema do Labirinto");
QUnit.test("moverDireitaOK", function (assert) {
    const pos5 = new Pos(4, 5);
    const pos6 = new Pos(7, 5);
    const pos7 = new Pos(8, 8);
    assert.deepEqual(lab1.moverDireitaOK(pos5), true);
    assert.deepEqual(lab1.moverDireitaOK(pos6), false);
    assert.deepEqual(lab1.moverDireitaOK(pos7), false);
});

QUnit.module("Problema do Labirinto");
QUnit.test("moverAbaixoOK", function (assert) {
    const pos3 = new Pos(0, 0);
    const pos4 = new Pos(2, 1);
    const pos7 = new Pos(8, 8);
    assert.deepEqual(lab1.moverAbaixoOK(pos3), true);
    assert.deepEqual(lab1.moverAbaixoOK(pos4), false);
    assert.deepEqual(lab1.moverAbaixoOK(pos7), false);
});

QUnit.module("Problema do Labirinto");
QUnit.test("moverEsquerdaOK", function (assert) {
    const pos3 = new Pos(0, 0);
    const pos4 = new Pos(2, 1);
    const pos5 = new Pos(4, 5);
    assert.deepEqual(lab1.moverEsquerdaOK(pos3), false);
    assert.deepEqual(lab1.moverEsquerdaOK(pos4), false);
    assert.deepEqual(lab1.moverEsquerdaOK(pos5), true);
});

QUnit.module("Problema do Labirinto");
QUnit.test("proximosMovimentos", function (assert) {
    const pos3 = new Pos(0, 0);
    const pos4 = new Pos(2, 1);
    const pos5 = new Pos(4, 5);
    const pos6 = new Pos(7, 5);
    const pos7 = new Pos(8, 8);
    const LPos3 = [new Pos(0, 1, pos3), new Pos(1, 0, pos3)];
    const LPos4 = [new Pos(1, 1, pos4), new Pos(2, 2, pos4)];
    const LPos5 = [new Pos(4, 6, pos5), new Pos(5, 5, pos5), new Pos(4, 4, pos5)];
    const LPos6 = [new Pos(6, 5, pos6), new Pos(8, 5, pos6), new Pos(7, 4, pos6)];
    const LPos7 = [new Pos(7, 8, pos7)];
    assert.deepEqual(lab1.proximosMovimentos(pos3), LPos3);
    assert.deepEqual(lab1.proximosMovimentos(pos4), LPos4);
    assert.deepEqual(lab1.proximosMovimentos(pos5), LPos5);
    assert.deepEqual(lab1.proximosMovimentos(pos6), LPos6);
    assert.deepEqual(lab1.proximosMovimentos(pos7), LPos7);
});

/* O Algoritmo Busca em Largura (BFS)*/


/* Teste: Lab4
 
   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
----------------------------------------
0  |   |   |   |   | X | * | * | * | X |
----------------------------------------
1  |   |   |   |   |   | * | X | * | * |
----------------------------------------
2  |   |   |   |   |   | * | * | X | * |
----------------------------------------
3  | X |   | X | X | X | X | * | X | * |
----------------------------------------
4  |   | X | * | * | F | X | * | X | * |
----------------------------------------
5  |   | X | * | X | X | X | * | X | * |
----------------------------------------
6  |   | X | * | * | * | * | * | X | * |
----------------------------------------
7  | I |   | X | X | X | X | X |   | * |
----------------------------------------
8  | * | * | * | * | * | * | * | * | * |
----------------------------------------
 
*/

let lab4 = new Labirinto(9, 9, new Pos(7, 0), new Pos(4, 4), 0);
lab4.setPos(new Pos(0, 4), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(0, 8), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(1, 6), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(2, 7), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(3, 0), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(3, 2), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(3, 3), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(3, 4), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(3, 5), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(3, 7), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(4, 1), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(4, 5), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(4, 7), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(5, 1), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(5, 3), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(5, 4), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(5, 5), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(5, 7), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(6, 1), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(6, 7), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(7, 2), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(7, 3), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(7, 4), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(7, 5), POSICAO.BLOQUEADA);
lab4.setPos(new Pos(7, 6), POSICAO.BLOQUEADA);
// Alvo não encontrado: ANE
//lab4.setPos(new Pos(4, 3), POSICAO.BLOQUEADA);

class BuscaEmLargura {  
    // executar(Lab): Pos
    static executar(lab) {
        let filaPesquisa = []; //Q
        // crio uma cópia do labirinto
        let newLab = Labirinto.copiar(lab);
        // inicio a fila de pesquisa com o ponto inicial
        filaPesquisa.push(newLab.posi); //Q.enqueue(root)
        // registro das posições que já foram verificadas
        let posicoesVerificadas = new Map();
        let pm = []; // proximos movimentos
        while (filaPesquisa.length > 0) {
            // retiro a primeira posição da fila
            let pos = filaPesquisa.shift(); // v:= Q.dequeue()
            // cheguei no alvo?
            if (newLab.noAlvo(pos)) {
                return pos;
            } else { // ainda não cheguei no alvo
                pm = newLab.proximosMovimentos(pos); // G.adjacentEdges(v)
                for (let i = 0; i < pm.length; i++) { // for all edges from v to w in G.adjacentEdges(v) do
                    if (!posicoesVerificadas.has(pm[i].getKey())) {
                        posicoesVerificadas.set(pm[i].getKey());
                        // coloco a próxima posição no fim da fila
                        filaPesquisa.push(pm[i]);
                    }
                }
            }
        } // while
        // alvo não encontrado ('ANE')
        return 'ANE';
    
    }
    
    // registra no labirinto as posições entre o ponto inicial e final
    // getCaminho(Lab): LPos
    static setCaminho(lab) {
        let p; // posição
        let pa; // posição anterior
        const pf = this.executar(lab); // posição final
        if (pf !== 'ANE') {
            p = pf;
            pa = p.pa;
            lab.setPos(pa, POSICAO.CAMINHO);
            while (typeof pa !== 'undefined') {
                p = pa;
                pa = p.pa;
                lab.setPos(p, POSICAO.CAMINHO);
            }
        }
      }
  }


console.log('BUSCA EM LARGURA:');
const pi = lab4.posi;
BuscaEmLargura.setCaminho(lab4);
lab4.setPos(pi, POSICAO.INICIAL);
lab4.visualizar();

/* 
O teste de fogo
Um labirinto de 1000 posições (20 linhas X 50 colunas) com 35% de bloqueios aleatórios
*/
/*
let lab5 = new Labirinto(20, 50, new Pos(19, 49), new Pos(0, 0), 0.35);
console.log('ANTES DE SETAR O CAMINHO:');
lab5.visualizar();
console.log('DEPOIS DE SETAR O CAMINHO:');
const pi = lab5.posi;
BuscaEmLargura.setCaminho(lab5);
lab5.setPos(pi, POSICAO.INICIAL);
lab5.visualizar();
*/