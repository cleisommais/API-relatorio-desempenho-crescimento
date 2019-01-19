import express from 'express';
import progressModel from '../model/progressModel';
import jwt from 'jsonwebtoken';
const reportRouter = express.Router();

reportRouter
  .route('/:email/progress')
  .get((req, resp) => {
    try {
      let token = req.headers['token'];
      if (token) {
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
          if (err) {
            resp.statusMessage = 'Unauthorized';
            resp.status(401).json({
              codigo: '2',
              mensagem: 'Token invalido, inexistente ou expirado'
            });
          } else if (decoded) {
            progressModel.find({
              'account.email': req.params.email
            }, {
              height: 1,
              weight: 1,
              headCircumference: 1,
              dateProgress: 1
            }, (err, progress) => {
              if (err) {
                resp.statusMessage = 'Bad request';
                resp.status(400).json({
                  codigo: '3',
                  mensagem: 'Dados request enviados incorretos'
                });
              } else if (!progress) {
                resp.statusMessage = 'Not found';
                resp.status(404).json({
                  codigo: '4',
                  mensagem: `Recurso ${req.params.email} não encontrado`
                });
              } else {
                resp.statusMessage = 'OK';
                resp.status(200).json(progress);
              }
            });
          }
        });
      } else {
        resp.statusMessage = 'Unauthorized';
        resp.status(401).json({
          codigo: '2',
          mensagem: 'Token invalido, inexistente ou expirado'
        });
      }
    } catch (error) {
      console.error(error);
      resp.statusMessage = 'Internal error';
      resp.status(500).json({
        codigo: '1',
        mensagem: 'Erro no servidor'
      });
    }
  });
export default reportRouter;