const express=require('express');
const {criarConta,atualizarUsuarioConta,excluirConta}=require('./controladores/funções');
const {depositar,sacar, transferir,saldo,extrato}=require('./controladores/transacoes');
const dadosBancarios=require("./bancodedados");

const rota=express();

rota.get("/contas",(req,res)=>{
    if(!req.query.senha_banco){
        res.status(400).json({
            mensagem:" ERRO: Informe a senha de acessa para visualizar as informações. "
        });
        return
    }
    if(req.query.senha_banco!=="Cubos123Bank"){
        res.status(400).json({
            mensagem:" ERRO: A senha está incorreta. "
        });
        return
    };
    res.status(200).json(dadosBancarios.contas)
});

rota.post("/contas",criarConta);
rota.put('/contas/:numeroConta/usuario',atualizarUsuarioConta);
rota.delete('/contas/:numeroConta',excluirConta);
rota.post('/transacoes/depositar', depositar);
rota.post('/transacoes/sacar',sacar);
rota.post('/transacoes/transferir',transferir);
rota.get("/contas/saldo",saldo);
rota.get("/contas/extrato",extrato)

module.exports=rota