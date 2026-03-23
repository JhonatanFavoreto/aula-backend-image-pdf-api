import express from 'express';
import { relatorioPorId, relatorioTodos } from '../controllers/pdfController.js';

const router = express.Router();

// Gera PDF de todos os alunos (aceita filtros via query)
router.get('/pdf', relatorioTodos);

// Gera PDF de um aluno específico
router.get('/:id/pdf', relatorioPorId);

export default router;
