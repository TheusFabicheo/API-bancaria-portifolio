const dados = require('../bancodedados')

const validaLogin = (req, res, next) => {
    const senha = req.query.senha_banco;
    if(!senha){
        return res.status(401).json({mensagem: "A senha do banco é obrigatória!"});
    }
    if(senha === dados.banco.senha){
        next();
    } else{
        return res.status(401).json({mensagem: "Senha incorreta"});
    }
}

module.exports = {
    validaLogin
};