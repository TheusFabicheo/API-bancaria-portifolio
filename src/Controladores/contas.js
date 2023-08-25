const dados = require('../bancodedados');
let idConta = 1;

const listarContas = (req, res) => {
    return res.status(200).json(dados.contas);
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    if(!nome){
        return res.status(400).json({mensagem: "O nome é obrigatório!"});
    }
    if(!cpf){
        return res.status(400).json({mensagem: "O CPF é obrigatório!"});
    }
    if(!data_nascimento){
        return res.status(400).json({mensagem: "A data de nascimento é obrigatória!"});
    }
    if(!telefone){
        return res.status(400).json({mensagem: "O telefone é obrigatório!"});
    }
    if(!email){
        return res.status(400).json({mensagem: "O email é obrigatório!"});
    }
    if(!senha){
        return res.status(400).json({mensagem: "A senha é obrigatória"});
    }

    const validaCpf = dados.contas.includes(cpf);
    const validaEmail = dados.contas.includes(email);
    if(validaCpf){
        return res.status(400).json({mensagem: "O cpf já está cadastrado"});
    };
    if(validaEmail){
        return res.status(400).json({mensagem: "O email já está cadastrado"});
    }
    const novaConta = {
        numero: idConta++,
        saldo : 0,
        usuarios: {
            nome,
            email,
            cpf,
            data_de_nascimento: data_nascimento,
            telefone,
            senha
    }
}
dados.contas.push(novaConta);
return res.status(201).json({mensagem: "Conta criada com sucesso"});
}

const atualizaUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const encontraConta = dados.contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });
    if(!encontraConta){
        return res.status(404).json({mensagem: "Conta não localizada"});
    };
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    
    if(nome){
        encontraConta.usuarios.nome = nome;
    };

    if(cpf){
        const verificaCpf = dados.contas.find((conta) => {
            return conta.usuarios.cpf === Number(cpf);
        })
        if(!verificaCpf){
            encontraConta.usuarios.cpf = cpf; 
        } else{
            return res.status(400).json({mensagem: "O cpf já está vinculado a uma conta"});
        }};
    if(data_nascimento){
        encontraConta.usuarios.data_de_nascimento = data_nascimento;
        };
    if(telefone){
        encontraConta.usuarios.telefone = telefone;
        };
    if(email){
        const verificaEmail = dados.contas.find((verifica) => {
            return verifica.usuarios.email === email;
        })
        if(verificaEmail){
            return res.status(400).json({mensagem: "O email já está vinculado a uma outra conta"});
        } else{
            encontraConta.usuarios.email = email;
        }};
    if(senha){
        encontraConta.usuarios.senha = senha;
    };
    return res.status(200).json({mensagem: "Os dados foram atualizados"});
}

const excluiUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const contaDeletada = dados.contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });
    if(contaDeletada.saldo === 0){
        dados.contas = dados.contas.filter((conta) => {
            return conta.numero !== Number(numeroConta);
        });
        return res.status(200).json({mensagem: "Conta excluida com sucesso"});
    } else{
        res.status(400).json({mensagem: "O saldo da conta precisa estar zerado"})
    }
}

module.exports = {
    listarContas,
    criarConta,
    atualizaUsuario,
    excluiUsuario
}