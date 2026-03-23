import AlunoModel from '../models/AlunoModel.js';
import fs from 'fs/promises';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'O campo "id" não é valido' });

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            removerFoto(req.file.path);
            return res.status(400).json({ error: 'O aluno nao possui registro.' });
        }

        if (aluno.foto) {
            await fs.unlink(aluno.foto).catch(() => {});
        }
        aluno.foto = await processarFoto(req.file.path);

        await aluno.atualizar();

        res.status(200).json({ message: 'Foto enviada e processada com sucesso!', data: aluno });
    } catch (error) {
        console.error('Erro ao enviar foto:', error);
        res.status(500).json({ error: 'Erro ao enviar e processar foto do aluno.' });
    }
};

export const verFoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Foto não encontrada de aluno.' });
        }

        if (!aluno.foto) {
            return res.status(400).json({ error: 'Este aluno nao apresenta foto cadastrada.' });
        }

        res.sendFile(aluno.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar foto' });
    }
};
