function verificarAdmin(req, res, next){
   if(!req.session || !req.session.adminId){
       return res.status(401).json({
           mensagem:"Não autenticado. Faça login para continuar."
       });
   }
   next();
}

module.exports = verificarAdmin;