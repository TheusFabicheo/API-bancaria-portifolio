const { listarContas, criarConta, atualizaUsuario, excluiUsuario } = require('./Controladores/contas');
const { depositar, sacar, transferir, saldoDaConta, extrato } = require('./Controladores/transacoes');
const { validaLogin } = require('./Middleware/validacao');
const app = require ('./servidor');

app.get('/contas', validaLogin, listarContas);
app.get('/contas/saldo', saldoDaConta);
app.get('/contas/extrato', extrato)
app.post('/contas', criarConta );
app.put('/contas/:numeroConta/usuario', atualizaUsuario);
app.delete('/contas/:numeroConta', excluiUsuario)

app.post('/transacoes/depositar', depositar);
app.post('/transacoes/sacar', sacar);
app.post('/transacoes/transferir', transferir);


module.exports = app;