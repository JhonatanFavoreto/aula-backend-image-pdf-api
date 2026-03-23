import AlunoModel from '../models/AlunoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, escola, turma, foto } = req.body;

        if (!nome) return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });

        const aluno = new AlunoModel({ nome, escola, turma, foto });
        const data = await aluno.criar();

        res.status(201).json({ message: 'Aluno criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar aluno:', error);
        res.status(500).json({ error: 'Erro interno ao salvar o aluno.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await AlunoModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(200).json({ message: 'Nenhum aluno encontrado.' });
        }

        res.json(registros);
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        res.status(500).json({ error: 'Erro ao buscar alunos.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const parsedId = Number.parseInt(id);
        if (Number.isNaN(parsedId)) {
            return res.status(400).json({ error: 'O ID do aluno enviado não é um número válido.' });
        }

        const aluno = await AlunoModel.buscarPorId(parsedId);

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }

        res.json({ data: aluno });
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        res.status(500).json({ error: 'Erro ao buscar aluno.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        const parsedId = Number.parseInt(id);
        if (Number.isNaN(parsedId)) return res.status(400).json({ error: 'ID inválido.' });

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const aluno = await AlunoModel.buscarPorId(parsedId);

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) aluno.nome = req.body.nome;
        if (req.body.escola !== undefined) aluno.escola = req.body.escola;
        if (req.body.turma !== undefined) aluno.turma = req.body.turma;
        if (req.body.foto !== undefined) aluno.foto = req.body.foto;

        const data = await aluno.atualizar();

        res.json({ message: `O aluno "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        res.status(500).json({ error: 'Erro ao atualizar aluno.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        const parsedId = Number.parseInt(id);
        if (Number.isNaN(parsedId)) return res.status(400).json({ error: 'ID inválido.' });

        const aluno = await AlunoModel.buscarPorId(parsedId);

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado para deletar.' });
        }

        await aluno.deletar();

        res.json({ message: `O aluno "${aluno.nome}" foi deletado com sucesso!`, deletado: aluno });
    } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        res.status(500).json({ error: 'Erro ao deletar aluno.' });
    }
};
