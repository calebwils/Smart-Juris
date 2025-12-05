import { CaseFile, CaseStatus, UserRole } from "../types";

export const MOCK_CASES: CaseFile[] = [
    {
        id: '101',
        clientName: 'Dupont SARL',
        title: 'Litige Fournisseur TechInfo',
        description: 'Non-respect des délais de livraison contractuels entraînant perte exploitation.',
        status: CaseStatus.OPEN,
        dateCreated: '12/05/2024',
        dateUpdated: '14/05/2024',
        notes: [],
        documents: [{ name: 'Contrat.pdf', type: 'PDF' }],
        aiResponses: []
    },
    {
        id: '102',
        clientName: 'Mme. Martin',
        title: 'Divorce Martin c/ Martin',
        description: 'Procédure de divorce par consentement mutuel.',
        status: CaseStatus.PENDING,
        dateCreated: '02/04/2024',
        dateUpdated: '10/05/2024',
        notes: [],
        documents: [],
        aiResponses: []
    }
];

export const MOCK_LOGS = [
    { id: '1', userId: '1', userName: 'Maître Valéry', action: 'Connexion', details: 'Connexion réussie', timestamp: new Date(Date.now() - 10000000).toISOString() },
    { id: '2', userId: '1', userName: 'Maître Valéry', action: 'Création Dossier', details: 'Dossier Dupont SARL', timestamp: new Date(Date.now() - 5000000).toISOString() },
];
