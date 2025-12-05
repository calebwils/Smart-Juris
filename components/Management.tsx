import React, { useState } from 'react';
import { 
  Plus, Folder, Clock, Calendar, Search, 
  FileText, Trash2, ChevronRight, Download, Users,
  BarChart2, PieChart, TrendingUp, Filter
} from 'lucide-react';
import { 
  CaseFile, CaseStatus, LegalDocument, UserRole, 
  ActivityLog, User, SubscriptionPlan, InternalMessage 
} from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart as RePie, Pie, Cell } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

/* --- DASHBOARD --- */
export const Dashboard: React.FC<{ 
    user: User; 
    cases: CaseFile[]; 
    logs: ActivityLog[];
}> = ({ user, cases, logs }) => {
    const { t } = useLanguage();
    
    // Derived stats
    const activeCases = cases.filter(c => c.status !== CaseStatus.CLOSED).length;
    const closedCases = cases.filter(c => c.status === CaseStatus.CLOSED).length;
    const totalDocs = cases.reduce((acc, c) => acc + c.documents.length, 0);
    const aiQueries = logs.filter(l => l.action === 'Recherche Juridique' || l.action === 'Chat IA').length;

    const barData = [
        { name: 'Lun', docs: 4, queries: 10 },
        { name: 'Mar', docs: 3, queries: 15 },
        { name: 'Mer', docs: 7, queries: 8 },
        { name: 'Jeu', docs: 5, queries: 12 },
        { name: 'Ven', docs: 8, queries: 20 },
    ];

    const pieData = [
        { name: CaseStatus.OPEN, value: cases.filter(c => c.status === CaseStatus.OPEN).length },
        { name: CaseStatus.PENDING, value: cases.filter(c => c.status === CaseStatus.PENDING).length },
        { name: CaseStatus.CLOSED, value: closedCases },
    ];
    const COLORS = ['#0ea5e9', '#f59e0b', '#10b981'];

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('dashboard.welcome')} {user.name}</h2>
                <p className="text-gray-500">{t('dashboard.overview')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: t('dashboard.active_cases'), value: activeCases, icon: Folder, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: t('dashboard.ai_queries'), value: aiQueries, icon: Search, color: 'text-purple-600', bg: 'bg-purple-100' },
                    { label: t('dashboard.docs_generated'), value: totalDocs, icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
                    { label: t('dashboard.closed_cases'), value: closedCases, icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
                        <div className={`p-4 rounded-full ${stat.bg} mr-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center"><BarChart2 className="w-5 h-5 mr-2"/> {t('dashboard.weekly_activity')}</h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="queries" fill="#8884d8" name="Requêtes IA" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="docs" fill="#82ca9d" name="Docs créés" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center"><PieChart className="w-5 h-5 mr-2"/> {t('dashboard.case_status')}</h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <RePie>
                                <Pie 
                                    data={pieData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={80}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </RePie>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-2 text-sm">
                            {pieData.map((entry, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                                    <span>{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* --- CASE MANAGER --- */
export const CaseManager: React.FC<{ 
    cases: CaseFile[]; 
    setCases: React.Dispatch<React.SetStateAction<CaseFile[]>>;
    onLogActivity: (a: string, d: string) => void;
}> = ({ cases, setCases, onLogActivity }) => {
    const { t } = useLanguage();
    const [view, setView] = useState<'list' | 'detail' | 'new'>('list');
    const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);
    const [newCaseData, setNewCaseData] = useState({ clientName: '', title: '', description: '', type: 'Civil' });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const newCase: CaseFile = {
            id: Date.now().toString(),
            ...newCaseData,
            status: CaseStatus.OPEN,
            dateCreated: new Date().toLocaleDateString(),
            dateUpdated: new Date().toLocaleDateString(),
            notes: [],
            documents: [],
            aiResponses: []
        };
        setCases([...cases, newCase]);
        onLogActivity('Création Dossier', `Dossier: ${newCase.title}`);
        setView('list');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && selectedCase) {
             const file = e.target.files[0];
             const updatedCases = cases.map(c => {
                 if (c.id === selectedCase.id) {
                     return { 
                         ...c, 
                         documents: [...c.documents, { name: file.name, type: 'PDF', url: '#' }] 
                     };
                 }
                 return c;
             });
             setCases(updatedCases);
             // Update local selected case to reflect change immediately
             setSelectedCase(updatedCases.find(c => c.id === selectedCase.id) || null);
             onLogActivity('Ajout Document', `Fichier ${file.name} ajouté au dossier ${selectedCase.title}`);
        }
    };

    const filteredCases = cases.filter(c => {
        const matchesSearch = c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              c.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (view === 'new') {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
                <h2 className="text-xl font-bold mb-6">{t('cases.new_case')}</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('cases.client_name')}</label>
                        <input required type="text" className="w-full border rounded p-2" value={newCaseData.clientName} onChange={e => setNewCaseData({...newCaseData, clientName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('cases.case_title')}</label>
                        <input required type="text" className="w-full border rounded p-2" value={newCaseData.title} onChange={e => setNewCaseData({...newCaseData, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('cases.description')}</label>
                        <textarea className="w-full border rounded p-2" rows={4} value={newCaseData.description} onChange={e => setNewCaseData({...newCaseData, description: e.target.value})} />
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-gray-600">{t('common.cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">{t('cases.create_btn')}</button>
                    </div>
                </form>
            </div>
        );
    }

    if (view === 'detail' && selectedCase) {
        return (
            <div className="space-y-6">
                <button onClick={() => setView('list')} className="text-primary-600 font-medium hover:underline mb-4 flex items-center">← {t('cases.back')}</button>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{selectedCase.title}</h1>
                            <p className="text-gray-500">Client: {selectedCase.clientName} | Créé le: {selectedCase.dateCreated}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedCase.status === CaseStatus.OPEN ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {selectedCase.status}
                        </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                             <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">{t('cases.description')}</h3>
                                <p className="text-gray-700 text-sm">{selectedCase.description}</p>
                             </div>

                             <div>
                                <h3 className="font-semibold mb-3 flex justify-between items-center">
                                    Documents
                                    <label className="cursor-pointer text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-50">
                                        + {t('cases.add_doc')}
                                        <input type="file" className="hidden" onChange={handleFileUpload} />
                                    </label>
                                </h3>
                                <div className="space-y-2">
                                    {selectedCase.documents.length === 0 && <p className="text-sm text-gray-400 italic">Aucun document.</p>}
                                    {selectedCase.documents.map((doc, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-white border rounded hover:shadow-sm">
                                            <div className="flex items-center">
                                                <FileText className="w-4 h-4 text-red-500 mr-3" />
                                                <span className="text-sm font-medium">{doc.name}</span>
                                            </div>
                                            <button className="text-gray-400 hover:text-primary-600"><Download className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                </div>
                             </div>

                             <div>
                                 <h3 className="font-semibold mb-3">{t('cases.saved_ai')}</h3>
                                 <div className="space-y-3">
                                    {selectedCase.aiResponses.length === 0 && <p className="text-sm text-gray-400 italic">Aucune réponse IA.</p>}
                                     {selectedCase.aiResponses.map((res, i) => (
                                         <div key={i} className="bg-purple-50 p-3 rounded border border-purple-100">
                                             <p className="text-xs font-bold text-purple-800 mb-1">{res.query}</p>
                                             <p className="text-xs text-gray-600 line-clamp-3">{res.response}</p>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <h3 className="font-semibold text-yellow-800 mb-2">{t('cases.notes')}</h3>
                                <textarea className="w-full bg-white border border-yellow-200 rounded p-2 text-sm" rows={5} placeholder="Ajouter une note..."></textarea>
                                <button className="mt-2 w-full bg-yellow-600 text-white text-xs py-1 rounded">{t('cases.save_note')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-1 gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:max-w-xs">
                        <input 
                            type="text" 
                            placeholder={t('common.search_placeholder')} 
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                    
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as CaseStatus | 'ALL')}
                            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
                        >
                            <option value="ALL">Tous les statuts</option>
                            {Object.values(CaseStatus).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={() => setView('new')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-primary-700 whitespace-nowrap shadow-sm transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" /> {t('cases.new_case')}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cases.list_client')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cases.status')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cases.list_update')}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cases.list_action')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCases.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => { setSelectedCase(c); setView('detail'); }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                                                {c.clientName.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{c.title}</div>
                                                <div className="text-sm text-gray-500">{c.clientName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${c.status === CaseStatus.OPEN ? 'bg-green-100 text-green-800' : 
                                              c.status === CaseStatus.PENDING ? 'bg-orange-100 text-orange-800' :
                                              c.status === CaseStatus.CLOSED ? 'bg-gray-100 text-gray-800' :
                                              'bg-red-100 text-red-800'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.dateUpdated}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <ChevronRight className="w-5 h-5 text-gray-400 inline" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredCases.length === 0 && (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <Folder className="w-12 h-12 text-gray-300 mb-2" />
                        <p>{t('cases.empty')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* --- LIBRARY --- */
export const Library: React.FC = () => {
    const { t } = useLanguage();
    const docs: LegalDocument[] = [
        { id: '1', title: 'Code Civil', category: 'Code', content: '...', tags: ['civil', 'famille'] },
        { id: '2', title: 'Loi Travail 2016', category: 'Loi', content: '...', tags: ['travail', 'entreprise'] },
        { id: '3', title: 'Arrêt Cour Cassation 2023-12', category: 'Jurisprudence', content: '...', tags: ['licenciement'] },
    ];
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold">{t('sidebar.library')}</h2>
                 <button className="text-sm bg-gray-800 text-white px-3 py-2 rounded">Upload Document</button>
             </div>
             <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                 {docs.map(doc => (
                     <div key={doc.id} className="p-4 border-b last:border-0 hover:bg-gray-50 flex justify-between items-center">
                         <div>
                             <h4 className="font-bold text-slate-800">{doc.title}</h4>
                             <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{doc.category}</span>
                         </div>
                         <button className="text-primary-600 hover:underline text-sm">Voir</button>
                     </div>
                 ))}
             </div>
        </div>
    );
}

/* --- MESSAGING --- */
export const InternalMessaging: React.FC = () => {
    return (
        <div className="h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="p-4 border-b font-bold text-gray-700">Canal Cabinet - Général</div>
            <div className="flex-1 p-4 bg-gray-50 space-y-4 overflow-y-auto">
                <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-lg shadow-sm max-w-md">
                        <p className="text-xs font-bold text-blue-600 mb-1">Me. Martin</p>
                        <p className="text-sm">Bonjour à tous, le dossier Durand est-il prêt pour l'audience de demain ?</p>
                    </div>
                </div>
                 <div className="flex justify-end">
                    <div className="bg-primary-100 p-3 rounded-lg shadow-sm max-w-md">
                        <p className="text-xs font-bold text-primary-800 mb-1">Moi</p>
                        <p className="text-sm">Oui, les conclusions sont rédigées et validées.</p>
                    </div>
                </div>
            </div>
            <div className="p-3 border-t bg-white flex">
                <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Écrire un message..." />
                <button className="ml-2 bg-primary-600 text-white px-4 rounded">Envoyer</button>
            </div>
        </div>
    )
}

/* --- SUBSCRIPTION --- */
export const Subscription: React.FC = () => {
    const { t } = useLanguage();
    return (
    <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-center mb-8">{t('subscription.title')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">{t('subscription.free')}</h3>
                <p className="text-3xl font-bold mb-4">0€<span className="text-sm font-normal text-gray-500">{t('subscription.month')}</span></p>
                <ul className="text-sm space-y-2 mb-6 text-gray-600">
                    <li>✓ 5 recherches IA / jour</li>
                    <li>✓ Accès aux Codes</li>
                    <li>✓ 1 Dossier client</li>
                </ul>
                <button className="w-full py-2 border border-primary-600 text-primary-600 rounded-lg">{t('subscription.current')}</button>
            </div>
             <div className="bg-white p-6 rounded-xl border-2 border-primary-500 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-3 py-1 rounded-bl">Populaire</div>
                <h3 className="text-xl font-bold mb-2">{t('subscription.premium')}</h3>
                <p className="text-3xl font-bold mb-4">49€<span className="text-sm font-normal text-gray-500">{t('subscription.month')}</span></p>
                <ul className="text-sm space-y-2 mb-6 text-gray-600">
                    <li>✓ Recherches IA illimitées</li>
                    <li>✓ Génération de documents</li>
                    <li>✓ Dossiers illimités</li>
                    <li>✓ Support prioritaire</li>
                </ul>
                <button className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{t('subscription.upgrade')}</button>
            </div>
             <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">{t('subscription.enterprise')}</h3>
                <p className="text-3xl font-bold mb-4">{t('subscription.quote')}</p>
                <ul className="text-sm space-y-2 mb-6 text-gray-600">
                    <li>✓ Tout le Premium</li>
                    <li>✓ Comptes multiples</li>
                    <li>✓ API privée</li>
                    <li>✓ Formation dédiée</li>
                </ul>
                <button className="w-full py-2 border border-gray-800 text-gray-800 rounded-lg">{t('subscription.contact')}</button>
            </div>
        </div>
    </div>
)};

/* --- ACTIVITY LOGS --- */
export const ActivityLogs: React.FC<{ logs: ActivityLog[] }> = ({ logs }) => {
    const { t } = useLanguage();
    return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b">
            <h2 className="text-lg font-bold">{t('sidebar.logs')} (Admin)</h2>
        </div>
        <div className="overflow-x-auto">
             <table className="min-w-full text-sm">
                 <thead className="bg-gray-50">
                     <tr>
                         <th className="px-4 py-2 text-left">Date</th>
                         <th className="px-4 py-2 text-left">Utilisateur</th>
                         <th className="px-4 py-2 text-left">Action</th>
                         <th className="px-4 py-2 text-left">Détails</th>
                     </tr>
                 </thead>
                 <tbody>
                     {logs.map(log => (
                         <tr key={log.id} className="border-t">
                             <td className="px-4 py-2 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                             <td className="px-4 py-2 font-medium">{log.userName}</td>
                             <td className="px-4 py-2">
                                 <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">{log.action}</span>
                             </td>
                             <td className="px-4 py-2 text-gray-600 max-w-xs truncate" title={log.details}>{log.details}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
        </div>
    </div>
)};