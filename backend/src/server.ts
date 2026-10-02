import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { z } from 'zod';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const __dirname = dirname(fileURLToPath(import.meta.url));
const leadsFile = resolve(__dirname, '../data/registration-leads.json');

app.use(helmet());
app.use(cors({ origin: ['http://localhost:4200'], credentials: false }));
app.use(express.json({ limit: '100kb' }));

const programs = [
  {
    id: 'foundations',
    ageRange: 'AGES 6–8',
    title: 'Foundations',
    description: 'Fun, structured training to build confidence and fundamental skills.',
    image: 'assets/images/program-foundations.jpg'
  },
  {
    id: 'development',
    ageRange: 'AGES 9–12',
    title: 'Development',
    description: 'Technical skills, teamwork, and game understanding.',
    image: 'assets/images/program-development.jpg'
  },
  {
    id: 'competitive',
    ageRange: 'AGES 13–16',
    title: 'Competitive',
    description: 'Advanced training for dedicated players ready for the next level.',
    image: 'assets/images/program-competitive.jpg'
  }
];

const registrationSchema = z.object({
  fullName: z.string().trim().min(3).max(100),
  email: z.string().email().max(160),
  phone: z.string().trim().regex(/^[0-9+()\-\s.]{7,20}$/),
  programId: z.enum(['foundations', 'development', 'competitive']).optional()
});

async function readLeads(): Promise<unknown[]> {
  try {
    return JSON.parse(await readFile(leadsFile, 'utf8')) as unknown[];
  } catch {
    return [];
  }
}

async function saveLead(lead: unknown): Promise<void> {
  await mkdir(dirname(leadsFile), { recursive: true });
  const leads = await readLeads();
  leads.push(lead);
  await writeFile(leadsFile, JSON.stringify(leads, null, 2), 'utf8');
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'la-cantera-api' });
});

app.get('/api/programs', (_req, res) => {
  res.json(programs);
});

app.post('/api/registration-leads', async (req, res, next) => {
  try {
    const parsed = registrationSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: 'Please review the submitted information.',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const lead = {
      id: randomUUID(),
      ...parsed.data,
      createdAt: new Date().toISOString()
    };

    await saveLead(lead);
    res.status(201).json({ message: 'Registration information received.', id: lead.id });
  } catch (error) {
    next(error);
  }
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Unexpected server error.' });
});

app.listen(port, () => {
  console.log(`La Cantera API running at http://localhost:${port}`);
});
