class Cliente {
    constructor (nome, cpf, telefone, email, usuario, senha, tipoConta = ''){
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.email = email;
        this.usuario = usuario;
        this.senha = senha;
        this.tipoConta = tipoConta;
    }
}

class Conta {
    constructor(tipo, saldo = 0) {
        this.tipo = tipo;
        this._saldo = saldo;
    }
    
    get saldo() {
        return this._saldo;
    }

    depositar(valor) {
        this._saldo += valor;
        return this._saldo;
    }

    sacar(valor) {
        if (this._saldo >= valor) {
            this._saldo -= valor;
            return this._saldo;
        } else {
            return "Saldo insuficiente";
        }
    }

    toString() {
        return `Saldo atual ${this._saldo}`;
    }
}

window.onload = function() {
    const clienteSalvo = JSON.parse(localStorage.getItem('cliente'));
    if (clienteSalvo !== null) {
        document.getElementById('usuario').value = clienteSalvo.usuario;
        document.getElementById('senha').value = clienteSalvo.senha;
    }
};

function entrar() {
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const clienteSalvo = JSON.parse(localStorage.getItem('cliente'));

    if (clienteSalvo !== null && usuario === clienteSalvo.usuario && senha === clienteSalvo.senha) {
       document.getElementById('resultadoLogin').innerText = 'Login bem-sucedido!';      
    } else {
        document.getElementById('resultadoLogin').innerText = 'Usuário ou senha inválidos.';
    }
}

function criarCliente() {
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const usuario = document.getElementById('usuario').value.trim(); 
    const senha = document.getElementById('senha').value.trim();
    
    if (nome !== '' && cpf !== '' && telefone !== '' && email !== '' && usuario !== '' && senha !== '') {
        const cliente = {
            usuario: usuario,
            senha: senha
        };
        localStorage.setItem('cliente', JSON.stringify(cliente));
        
        exibirDadosCliente();
        
        alert('Conta criada com sucesso!');
    } else {
        alert('Preencha todos os campos para criar a conta.');
    }
}

function exibirDadosCliente() {
    const clienteSalvo = JSON.parse(localStorage.getItem('cliente'));
    if (clienteSalvo !== null) {
        const dadosCliente = document.getElementById('dadosCliente');
        dadosCliente.innerHTML = `
        <p><strong>Usuário:</strong> ${clienteSalvo.usuario}</p>
        <p><strong>Senha:</strong> ${clienteSalvo.senha}</p>
    `;
    }
}

const contaCorrente = new Conta('corrente');
const contaPoupanca = new Conta('poupanca');

function realizarDeposito() {
    const valorDeposito = parseFloat(document.getElementById('valorDeposito').value.trim());
    const tipoConta = document.getElementById('tipoConta').value;

    if (isNaN(valorDeposito) || valorDeposito <= 0) {
        document.getElementById('resultadoDeposito').innerText = 'Insira um valor numérico válido para o depósito.';
        return;
    }

    if (tipoConta === 'poupanca') {
        const deposito = contaPoupanca.depositar(valorDeposito);
        if (deposito) {
            document.getElementById('resultadoDeposito').innerText = `Depósito de ${valorDeposito} na conta poupança realizado com sucesso. Novo saldo: ${contaPoupanca.saldo}`;
        } else {
            document.getElementById('resultadoDeposito').innerText = `Não é possível realizar o depósito na conta poupança.`;
        }
    } else if (tipoConta === 'corrente') {
        const deposito = contaCorrente.depositar(valorDeposito);
        if (deposito) {
            document.getElementById('resultadoDeposito').innerText = `Depósito de ${valorDeposito} na conta corrente realizado com sucesso. Novo saldo: ${contaCorrente.saldo}`;
        } else {
            document.getElementById('resultadoDeposito').innerText = `Não é possível realizar o depósito na conta corrente.`;
        }
    } else {
        document.getElementById('resultadoDeposito').innerText = 'Escolha uma conta válida';
    }
}

function transferirPoupancaParaCorrente() {
    const valorTransferencia = parseFloat(document.getElementById('valorTransferencia').value.trim());
    const tipoContaDestino = document.getElementById('tipoContaDestino').value;

    if (isNaN(valorTransferencia) || valorTransferencia <= 0) {
        document.getElementById('resultadoTransferencia').innerText = 'Insira um valor numérico válido para a transferência.';
        return;
    }

    let saldoDisponivel = 0;

    if (tipoContaDestino === 'poupanca') {
        saldoDisponivel = contaPoupanca.saldo;
    } else if (tipoContaDestino === 'corrente') {
        saldoDisponivel = contaCorrente.saldo;
    }
    
    if (saldoDisponivel < valorTransferencia){
        document.getElementById('resultadoTransferencia').innerText = `Saldo insuficiente para realizar a transferência para a conta ${tipoContaDestino}`;
        return;
    }

    if (tipoContaDestino === 'poupanca') {
        const depositoPoupanca = contaPoupanca.depositar(valorTransferencia);
        if (depositoPoupanca) {
            document.getElementById('resultadoTransferencia').innerText = `Transferência da conta corrente para a poupança no valor de ${valorTransferencia} realizado com sucesso. Novo saldo na conta poupança: ${depositoPoupanca}`;
        } else {
            document.getElementById('resultadoTransferencia').innerText = `Não foi possível realizar a transferência para a conta poupança.`;
        }
    } else if (tipoContaDestino === 'corrente') {
        const saquePoupanca = contaPoupanca.sacar(valorTransferencia);
        if (saquePoupanca === "Saldo Insuficiente") {
            document.getElementById('resultadoTransferencia').innerText = `Não há saldo suficiente na conta poupança para transferir.`;
            return;
        }

        const depositoCorrente = contaCorrente.depositar(valorTransferencia);

        if (depositoCorrente) {
            document.getElementById('resultadoTransferencia').innerText = `Transferência da poupança para a conta corrente no valor de ${valorTransferencia} realizado com sucesso. Novo saldo na conta corrente: ${depositoCorrente}`;
        } else {
            document.getElementById('resultadoTransferencia').innerText = `Não foi possível realizar a transferência para a conta corrente.`;
        }
    } else {
        document.getElementById('resultadoTransferencia').innerText = `Não é possível transferir para a conta ${tipoContaDestino}.`;
    }
}


function realizarSaque() {
    const valorSaque = parseFloat(document.getElementById('valorSaque').value.trim());
    const tipoConta = document.getElementById('tipoConta').value;

    if (isNaN(valorSaque) || valorSaque <= 0) {
        document.getElementById('resultadoSaque').innerText = 'Insira um valor numérico válido.';
        return;
    }

    if (tipoConta === 'poupanca') {
        const saque = contaPoupanca.sacar(valorSaque);
        if (typeof saque === "string") {
            document.getElementById('resultadoSaque').innerText = saque;
        } else {
            document.getElementById('resultadoSaque').innerText = `Saque de ${valorSaque} na conta poupança realizado com sucesso. Novo saldo: ${saque}.`;
        }
    } else if (tipoConta === 'corrente') {
        const saque = contaCorrente.sacar(valorSaque);
        if (typeof saque === "string") {
            document.getElementById('resultadoSaque').innerText = saque;
        } else {
            document.getElementById('resultadoSaque').innerText = `Saque de ${valorSaque} na conta corrente realizado com sucesso. Novo saldo: ${saque}.`;
        }
    } else {
        document.getElementById('resultadoSaque').innerText = 'Escolha uma conta válida.';
    }
}

function limparHistorico(){
    document.getElementById('resultadoDeposito').innerHTML = '';
    document.getElementById('resultadoSaque').innerHTML = '';
    document.getElementById('resultadoTransferencia').innerHTML = '';
}
