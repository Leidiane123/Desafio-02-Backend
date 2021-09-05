const { json } = require('express');
const dadosBancarios=require('../bancodedados');


let id=0;


function criarConta(req,res){
  let nome=req.body.nome;
  let cpf=req.body.cpf;
  let data=req.body.data_nascimento;
  let telefone=req.body.telefone;
  let email=req.body.email;
  let senha=req.body.senha;

 
  if(dadosBancarios.contas.length>0){
    for(let item of dadosBancarios.contas){
      if(item.usuario.cpf===cpf){
        res.status(400).json({
          mensagem: "Não foi possível criar a nova conta, CPF já cadastrado"
        });
        return
      }if(item.usuario.email===email){
        res.status(400).json({
          mensagem: "Não foi possível criar a nova conta, E-MAIL já cadastrado"
        });
        return
      };
    }
    
  }

  if(!nome||!cpf||!data||!telefone||!email||!senha){
    res.status(400).json({
      Erro:"Alguma informação não foi repassada, todos os campos são obrigatórios "
    });
    
    return
  };

  let dados={
    numero:  id+=1,
    saldo: 0,
    usuario: {
      nome: req.body.nome,
      cpf: req.body.cpf,
      data_nascimento:req.body.data_nascimento,
      telefone:req.body.telefone,
      email:req.body.email,
      senha:req.body.senha 
    }    
  };
  
  dadosBancarios.contas.push(dados);
  res.status(201);
  res.json(dados);

  
}


function atualizarUsuarioConta(req, res){
  
  if(dadosBancarios.contas.length===0){
    res.status(400).json({
      Erro:"Nenhuma conta cadastrada!"
    });
    return
  };


  if(!req.body.nome && !req.body.cpf && !req.body.data_nascimento && !req.body.email && !req.body.telefone && !req.body.senha){
    res.status(400).json({
      Erro:"Passe pelo menos uma informação para atualização dos dados!"
    });
    return
  };
  
  const conta=dadosBancarios.contas.find((conta)=>conta.numero=== Number(req.params.numeroConta));
  
  
  if(!conta){
    res.status(400).json({
      Erro:"Conta não encontrada!"
    });
    return
  };
  if(req.body.cpf||req.body.email){
    for(let item of dadosBancarios.contas){
      if(item.usuario.cpf===req.body.cpf){
        res.status(400).json({
          mensagem: "Não foi possível criar a nova conta, CPF já cadastrado"
        });
        return
      }if(item.usuario.email===req.body.email){
        res.status(400).json({
          mensagem: "Não foi possível criar a nova conta, E-MAIL já cadastrado"
        });
        return
      };
    }

  }
  if(req.body.nome!==undefined){
    conta.usuario.nome=req.body.nome
  }
  if(req.body.cpf!==undefined){
    conta.usuario.cpf=req.body.cpf
  }
  if(req.body.telefone!==undefined){
    conta.usuario.telefone=req.body.telefone
  }
  if(req.body.data_nascimento!==undefined){
    conta.usuario.data_nascimento=req.body.data_nascimento
  }
  if(req.body.email!==undefined){
    conta.usuario.email=req.body.email
  }
  if(req.body.senha!==undefined){
    conta.usuario.senha=req.body.senha
  }
  res.status(200).json({
    mensagem: "Conta atualizada com sucesso!"
});
};

function excluirConta(req,res){

  const conta=dadosBancarios.contas.find((conta)=>conta.numero=== Number(req.params.numeroConta));
  
  if(!conta){
    res.status(400).json({
      Erro:"Conta não encontrada!"
    });
    return
  };
  if(conta.saldo>0){
    res.status(400).json({
      Erro:"Não foi possível excluir a conta, pois possui saldo positivo"
    });
    return
  };
  const indice=dadosBancarios.contas.indexOf(conta);
  dadosBancarios.contas.splice(indice,1);

  res.status(200).json({
    mensagem: "Conta excluída com sucesso!"
});
};


module.exports={criarConta,atualizarUsuarioConta,excluirConta}