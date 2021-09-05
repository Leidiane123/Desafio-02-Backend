const { json } = require('express');
const dadosBancarios=require('../bancodedados');


function validarContaDeposito(informacao){
    if(!informacao.numero_conta){
        return "Por favor, informe o número da conta!"
        
    }
    if(!informacao.valor){
        return "Por favor, informe o valor do deposito!"
    };
    if(informacao.valor<=0){
        
        return "Não é possivel fazer depositos com valores negativos ou nulo!"
        
    };

};

function validarContaSaque(informacao){
    if(!informacao.numero_conta){
        return "Por favor, informe o número da conta!"
        
    }
    if(!informacao.valor){
        return "Por favor, informe o valor do saque!"
    };
    if(!informacao.senha){
        
        return "Por favor, informe a senha!"
        
    };

}
function validarContaTransferencia(informacao){
    if(!informacao.numero_conta_destino){
        
        return "Por favor, informe o número da conta de destino!"
        
    };

    if(!informacao.numero_conta_origem){
        
        return "Por favor, informe o número da conta!"
        
    };

    if(!informacao.valor){
        
        return "Por favor, informe o valor da transferência!"
    };

    if(!informacao.senha){
        
        return"Por favor, informe a sua senha!"
    };
};

function validarContaSaldoEExtrato(informacao){
    if(!informacao.numero_conta||!informacao.senha){
        return "Número da conta ou senha não foram repassados!" 
    }
}

function depositar(req,res){
    const erro=validarContaDeposito(req.body);

    if(erro){
        res.status(400).json({erro});
        return
    }
    

    const conta=dadosBancarios.contas.find((conta)=>conta.numero===req.body.numero_conta);
    if(!conta){
        res.status(404).json({
            Erro:"Número da conta não encontrado!"
        })
        return
    };

    
    const data= new Date();
    conta.saldo+=req.body.valor;
    const registro={
        data:data,
        numero_conta:req.body.numero_conta,
        valor:req.body.valor
    }
    dadosBancarios.depositos.push(registro);
    
    res.status(200).json({
        mensagem:'Depósito realizado com sucesso'
    })
    

}

function sacar(req,res){
    const erro=validarContaSaque(req.body);

    if(erro){
        res.status(400).json({erro});
        return
    }
  
    
    const conta=dadosBancarios.contas.find((conta)=>conta.numero===req.body.numero_conta);
    if(!conta){
        res.status(404).json({
            Erro:"Número da conta não encontrado!"
        })
        return
    };
    if(conta.usuario.senha!==req.body.senha){
        res.status(400).json({
            Erro:"Senha incorreta!"
        })
        return
    }
    if(conta.saldo<req.body.valor){
        res.status(400).json({
            Erro:"Saldo insuficiente!"
        })
        return
    }
    const data= new Date();

    conta.saldo-=req.body.valor;
    const registro={
        data:data,
        numero_conta:req.body.numero_conta,
        valor:req.body.valor
    }
    dadosBancarios.saques.push(registro);
    
    res.status(200).json({
        mensagem:'Saque realizado com sucesso'
    })


};

function transferir(req,res){
    const erro=validarContaTransferencia(req.body);

    if(erro){
        res.status(400).json({erro});
        return
    };
    
    const contaOrigem=dadosBancarios.contas.find((conta)=>conta.numero===req.body.numero_conta_origem);
    if(!contaOrigem){
        res.status(404).json({
            Erro:"Número da conta não encontrado!"
        })
        return
    };

    const contaDestino=dadosBancarios.contas.find((conta)=>conta.numero===req.body.numero_conta_destino);
    if(!contaDestino){
        res.status(404).json({
            Erro:"Número da conta de destino não encontrado!"
        })
        return
    };
    if(contaOrigem.usuario.senha!==req.body.senha){
        res.status(400).json({
            Erro:"Senha incorreta!"
        })
        return
    }
    if(contaOrigem.saldo<req.body.valor){
        res.status(400).json({
            Erro:"Saldo insuficiente!"
        })
        return
    }
    contaOrigem.saldo-=req.body.valor;
    contaDestino.saldo+=req.body.valor;

    const data= new Date();
    
    const registro={
        data:data,
        numero_conta_origem: req.body.numero_conta_origem,
        numero_conta_destino: req.body.numero_conta_destino,
        valor:req.body.valor
    };
    dadosBancarios.transferencias.push(registro);
    
    res.status(200).json({
        mensagem:'Transferência realizado com sucesso'
    });

};

function saldo(req,res){
    const erro=validarContaSaldoEExtrato(req.query);

    if(erro){
        res.status(400).json({erro});
        return
    }
    
    const conta=dadosBancarios.contas.find((conta)=>conta.numero===Number(req.query.numero_conta));
    
    if(!conta){
        res.status(404).json({
            Erro:"Número da conta de destino não encontrado!"
        })
        return
    };
    if(conta.usuario.senha!==req.query.senha){
        res.status(404).json({
            Erro:"Senha incorreta!"
        })
        return
    }
    res.status(200).json({
        mensagem:conta.saldo
    })

};

function extrato(req,res){
    const erro=validarContaSaldoEExtrato(req.query);

    if(erro){
        res.status(400).json({erro});
        return
    };
    
    
    const conta=dadosBancarios.contas.find((conta)=>conta.numero===Number(req.query.numero_conta));
    
    if(!conta){
        res.status(404).json({
            Erro:"Número da conta de destino não encontrado!"
        });
        return
    };
    if(conta.usuario.senha!==req.query.senha){
        res.status(404).json({
            Erro:"Senha incorreta!"
        })
        return
    };
    const depositos=dadosBancarios.depositos.find((conta)=>conta.numero_conta===Number(req.query.numero_conta));
    const saques=dadosBancarios.saques.find((conta)=>conta.numero_conta===Number(req.query.numero_conta));
    const transferenciasRecebidas=dadosBancarios.transferencias.find((conta)=>conta.numero_conta_destino===Number(req.query.numero_conta));
    const transferenciasEnviadas=dadosBancarios.transferencias.find((conta)=>conta.numero_conta_origem===Number(req.query.numero_conta));

    const extrato={
        depositos:[depositos],
        saques:[saques],
        transferenciasEnviadas:[transferenciasEnviadas],
        transferenciasRecebidas:[transferenciasRecebidas]
    };
    res.status(200).json(extrato);

};

module.exports={depositar,sacar,transferir,saldo,extrato}