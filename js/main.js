//Variaveis
const btnAdicionarTransacao = document.querySelector("#btn-adicionar");
const listaTransacoesGlobal = getLocalStorage();
const lengthListaTransacoes = listaTransacoesGlobal.length;

//Main
btnAdicionarTransacao.addEventListener("click", adicionarTransacao);
criarLisTransacao();
atualizarSaldo();

if (lengthListaTransacoes > 2){
    scroll();
}

//Funções
function criarLisTransacao(){
    const listaTransacoes = getLocalStorage();
    const ulTransacoes = document.querySelector("#lista-transacoes");

    ulTransacoes.innerHTML = "";

    for (let i = 0; i < listaTransacoes.length; i++) {
        const liTransacao = document.createElement("li");
        const nome = listaTransacoes[i].nome
        let valor = listaTransacoes[i].valor;

        let sinal = "+";
        let tipo = "positivo";
        
        if (valor < 0){
            valor *= -1;
            sinal = "-";
            tipo = "negativo"
        }

        liTransacao.innerHTML = 
        `<p class="nome-transacao">${nome}</p>
        <div class="valor-e-excluir">
            <div>
                <span>${sinal}</span>
                <span class="span-${tipo}">R$${valor.toFixed(2)}</span>
            </div>
        
            <div class="icone-excluir">
                <i class="fa-solid fa-square-xmark"></i>
            </div>
        </div>`
        ulTransacoes.appendChild(liTransacao);   
    };

    adicionaEventoExcluir()
};

function adicionaEventoExcluir(){
    const btnsExcluir = document.querySelectorAll(".icone-excluir i");
    btnsExcluir.forEach((btn, index) => {
        btn.addEventListener("click", excluirTransacao);
        btn.setAttribute("data-id", index)
    });
}

function getLocalStorage(){
    const listaTransacoes = JSON.parse(localStorage.getItem("db_trans")) ??[]
    return listaTransacoes
};

function adicionarTransacaoLocalStorage(transacao){
    const listaTransacoes = getLocalStorage();
    listaTransacoes.push(transacao);

    localStorage.setItem("db_trans", JSON.stringify(listaTransacoes));
};

function adicionarTransacao(event){
    const nome = document.querySelector("#nome").value;
    const valor = document.querySelector("#valor").value;
    const valorNum = parseFloat(valor);

    event.preventDefault();

    if (nome !== "" && valor !== "") {
        const novaTransacao = {
            nome: nome,
            valor: valorNum,
        };

        adicionarTransacaoLocalStorage(novaTransacao);
        criarLisTransacao();
        atualizarSaldo();
        limparInput();
        scroll()
        setTimeout(scrollParaBaixo, 900);
    } else if (nome === "") {
        alert("Digite o nome da transação");
    } else if (valor === "") {
        alert("Digite o valor da transação")
    }
};

function excluirTransacao(){
    const listaTransacoes = getLocalStorage();
    const idTransacao = this.getAttribute("data-id");

    listaTransacoes.splice(idTransacao, 1);
    localStorage.setItem("db_trans", JSON.stringify(listaTransacoes));

    criarLisTransacao();
    atualizarSaldo();

    scroll()
}

function atualizarSaldo(){
    const listaTransacoes = getLocalStorage();
    const spanReceita = document.querySelector("#receita");
    const spanDespesa = document.querySelector("#despesa");
    const spanSaldoAtual = document.querySelector("#saldo");
    const paragrafoSaldo = document.querySelector("#p-saldo")

    let receita = 0;
    let despesa = 0;

    for (let i = 0; i < listaTransacoes.length; i++){
        const valor = listaTransacoes[i].valor;
        if (valor >= 0) {
            receita += valor;
        } else {
            despesa += valor;
        }
    };

    const saldoTotal = receita - ( despesa *= -1);

    if (saldoTotal < 0){
        spanSaldoAtual.classList.remove("saldo-positivo");
        paragrafoSaldo.classList.remove("saldo-positivo");

        spanSaldoAtual.classList.add("saldo-negativo");
        paragrafoSaldo.classList.add("saldo-negativo");
    } else if (saldoTotal > 0) {
        spanSaldoAtual.classList.remove("saldo-negativo");
        paragrafoSaldo.classList.remove("saldo-negativo");

        spanSaldoAtual.classList.add("saldo-positivo");
        paragrafoSaldo.classList.add("saldo-positivo");
    } else{
        spanSaldoAtual.classList.remove("saldo-negativo");
        paragrafoSaldo.classList.remove("saldo-negativo");

        spanSaldoAtual.classList.remove("saldo-positivo");
        paragrafoSaldo.classList.remove("saldo-positivo");
    }

    spanReceita.innerHTML = receita.toFixed(2);
    spanDespesa.innerHTML = despesa.toFixed(2);
    spanSaldoAtual.innerHTML = saldoTotal.toFixed(2);
};

function limparInput(){
    document.querySelector("#nome").value = "";
    document.querySelector("#valor").value = "";
};

function scroll(){
    const listaTransacoes = getLocalStorage();

    if (listaTransacoes.length > 2){
        const divScroll = document.querySelector("#div-scroll");
        divScroll.classList.add("transacoes-scroll");
    } else {
        const divScroll = document.querySelector("#div-scroll");
        divScroll.classList.remove("transacoes-scroll")
    }
};

function scrollParaBaixo(){
    const divScroll = document.querySelector("#div-scroll")
    const ulTransacoes = document.querySelector("#lista-transacoes").childNodes
    const ultimaLi = ulTransacoes[ulTransacoes.length - 1];
    const posicaoUltimaLi = ultimaLi.getBoundingClientRect().y;
    divScroll.scrollTo(0, posicaoUltimaLi);
}