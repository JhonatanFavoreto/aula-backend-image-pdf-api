import AlunoModel from '../models/AlunoModel.js';
import { gerarPdfTodos, gerarPdfAluno } from '../utils/pdfHelper.js';

export const relatorioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const parsedId = Number.parseInt(id);
        if (Number.isNaN(parsedId)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const aluno = await AlunoModel.buscarPorId(parsedId);

        if (!aluno) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        const pdf = await gerarPdfAluno(aluno);
        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="aluno_${parsedId}.pdf"`,
            })
            .send(pdf);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        return res.status(500).json({ error: 'Erro ao gerar relatório.' });
    }
};

export const relatorioTodos = async (req, res) => {
    try {
        // Aceita filtros via query string, por exemplo: /alunos/pdf?nome=ana
        const filtros = req.query || {};

        const alunos = await AlunoModel.buscarTodos(filtros);

        if (!alunos || alunos.length === 0) {
            return res.status(200).json({ message: 'Nenhum aluno encontrado.' });
        }

        const pdf = await gerarPdfTodos(alunos);

        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="alunos.pdf"`,
            })
            .send(pdf);
    } catch (error) {
        console.error('Erro ao gerar PDF de todos:', error);
        return res.status(500).json({ error: 'Erro ao gerar PDF.' });
    }
};
