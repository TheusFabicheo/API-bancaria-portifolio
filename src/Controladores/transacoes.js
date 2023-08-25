const dados = require('../bancodedados');
const { get } = require('../servidor');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    const verificaConta = dados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });
    if(!verificaConta){
        return res.status(404).json({mensagem: "Conta não encontrada"});
    };
    if(Number(valor) <= 0){
        return res.status(400).json({mensagem: "O valor de deposito precisa ser maior do que R$0,00"})
    };
    verificaConta.saldo+=valor;

    const now = new Date();
    const novoRegistroDep = {
        data: `${now.toLocaleDateString('pt-BR', {timezone: 'UTC'})} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
        numero_conta,
        valor
    };
    dados.depositos.push(novoRegistroDep);
    return res.status(200).json({mensagem: "Deposito realizado com sucesso"});
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    const contaSelecionada = dados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });
    if(!contaSelecionada){
        return res.status(404).json({mensagem: "A conta informada não foi encontrada"});
    };
    if(senha !== contaSelecionada.usuarios.senha){
        return res.status(401).json({mensagem: "A senha está incorreta"})
    };
    if(valor > contaSelecionada.saldo){
        return res.status(400).json({mensagem: "Saldo insuficiente"});
    };
    contaSelecionada.saldo-=valor;
    const now = new Date();
    const registroSaque = {
        data: `${now.toLocaleDateString('pt-BR', {timezone: 'UTC'})} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
        numero_conta,
        valor 
    };
    dados.saques.push(registroSaque);
    return res.status(200).json({mensagem: "Saque realizado com sucesso"});
};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha} = req.body;
    const contaOrigem = dados.contas.find((conta) =>{
        return conta.numero === Number(numero_conta_origem)
    });
    const contaDestino = dados.contas.find((conta) =>{
        return conta.numero === Number(numero_conta_destino);
    });
    if(!contaOrigem){
        return res.status(404).json({mensagem: "Conta de origem não encontrada"});
    };
    if(!contaDestino){
        return res.status(404).json({mensagem: "Conta de destino não encontrada"});
    };
    if(contaOrigem === contaDestino){
        return res.status(400).json({mensagem: "Não é permitido transferencia para a mesma conta"});
    };
    if(senha !== contaOrigem.usuarios.senha){
        return res.status(401).json({mensagem: "A senha está incorreta!"});
    };
    if(valor > contaOrigem.saldo){
        return res.status(400).json({mensagem: "O valor é maior do que o saldo atual"});
    };
    contaOrigem.saldo-=valor;
    contaDestino.saldo+=valor;
    
    const now = new Date();
    const registroTransferencia = {
        data: `${now.toLocaleDateString('pt-BR', {timezone: 'UTC'})} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
        numero_conta_destino,
        numero_conta_origem,
        valor 
    };
    dados.transferencias.push(registroTransferencia);
    return res.status(200).json({mensagem: "Transferencia realizada com sucesso"});
}

const saldoDaConta = (req, res) => {
    const numero_conta = req.query.numero_conta;
    const senha = (req.query.senha);
    if(!numero_conta){
        return res.status(400).json({mensagem: "O numero da conta é obrigatório"});
    };
    if(!senha){
        return res.status(400).json({mensagem: "A senha é obrigatória"});
    };
    const encontraConta = dados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });
    if(!encontraConta){
        return res.status(404).json({mensagem: "A conta não foi encontrada"});
    };
  
    if(senha !== (encontraConta.usuarios.senha)){
        return res.status(401).json({mensagem: "A senha está incorreta!"});
    };
    return res.status(200).json({mensagem: `O saldo da sua conta é de R$${(encontraConta.saldo / 100).toFixed(2)}`});
}

const extrato = (req, res) => {
    const conta = Number(req.query.numero_conta);
    const senha = req.query.senha;
    const contaEncontrada = dados.contas.find((buscando) => {
        return buscando.numero === conta;
    });
    if(!contaEncontrada){
        return res.status(404).json({mensagem: "Nenhuma conta foi encontrada"});
    };
    if(senha !== contaEncontrada.usuarios.senha){
        return res.status(400).json({mensagem: "A senha está incorreta"});
    };
    const extrato = {
        depositos: dados.depositos.filter((registro) => {
            return registro.numero_conta === Number(conta);
        }),
        saques: dados.saques.filter((registros) => {
            return registros.numero_conta === Number(conta);
        }),
        transferenciasEnviadas: dados.transferencias.filter((registros) => {
            return registros.numero_conta_origem === Number(conta);
        }),
        transferenciasRecebidas: dados.transferencias.filter((registros) => {
            return registros.numero_conta_destino === Number(conta);
        })
    };
    return res.status(200).json(extrato);
};

module.exports = {
    depositar,
    sacar,
    transferir,
    saldoDaConta,
    extrato
};

