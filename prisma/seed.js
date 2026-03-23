import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando tabela aluno...');

    // Remove todos os registros
    // await prisma.aluno.deleteMany();

    console.log('📦 Inserindo novos registros...');

    await prisma.aluno.createMany({
        data: [
            {
                nome: 'João Silva',
                escola: 'Escola A',
                turma: 'Turma 1',
                foto: 'https://example.com/foto1.jpg',
            },
            {
                nome: 'Maria Oliveira',
                escola: 'Escola B',
                turma: 'Turma 2',
                foto: 'https://example.com/foto2.jpg',
            },
            {
                nome: 'Carlos Pereira',
                escola: 'Escola A',
                turma: 'Turma 1',
                foto: 'https://example.com/foto3.jpg',
            },
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
