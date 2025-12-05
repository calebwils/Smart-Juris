import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, BookOpen, FilePlus, Loader2, Download, Search as SearchIcon, FileText } from 'lucide-react';
import { searchLegalInfo, sendChatMessage, generateDocument } from '../services/geminiService';
import { CaseFile, ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

/* --- LEGAL SEARCH COMPONENT --- */

interface LegalSearchProps {
  onLogActivity: (action: string, details: string) => void;
  cases: CaseFile[];
  onAddToCase: (caseId: string, content: string) => void;
}

export const LegalSearch: React.FC<LegalSearchProps> = ({ onLogActivity, cases, onAddToCase }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [showAddToCase, setShowAddToCase] = useState(false);
  const { t, language } = useLanguage();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await searchLegalInfo(query, language);
      setResult(data);
      onLogActivity('Recherche Juridique', `Query: ${query}`);
    } catch (err) {
      alert(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCase = () => {
    if (!selectedCaseId || !result) return;
    const content = `Question: ${query}\n\nRéponse IA:\n${result.explanation}`;
    onAddToCase(selectedCaseId, content);
    setShowAddToCase(false);
    alert(t('common.save'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <SearchIcon className="w-5 h-5 mr-2 text-primary-600" />
          {t('search.title')}
        </h2>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 top-2 p-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{t('search.explanation')}</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{result.explanation}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" /> {t('search.articles')}
                </h4>
                <ul className="space-y-3">
                  {result.articles?.map((art: any, i: number) => (
                    <li key={i} className="text-sm">
                      <span className="font-bold text-blue-900 block">{art.title}</span>
                      <span className="text-blue-800">{art.summary}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                  <ScaleIcon className="w-4 h-4 mr-2" /> {t('search.jurisprudence')}
                </h4>
                <ul className="space-y-3">
                  {result.jurisprudence?.map((jur: any, i: number) => (
                    <li key={i} className="text-sm">
                      <span className="font-bold text-amber-900 block cursor-pointer hover:underline">{jur.name}</span>
                      <span className="text-amber-800">{jur.summary}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {result.sources && (
               <div className="text-xs text-gray-500 mt-4 border-t pt-2">
                 <strong>{t('search.sources')}:</strong> {result.sources.join(', ')}
               </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex space-x-4">
            <button 
              onClick={() => navigator.clipboard.writeText(result.explanation)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Copy className="w-4 h-4 mr-2" /> {t('common.copy')}
            </button>
            <div className="relative">
                <button 
                onClick={() => setShowAddToCase(!showAddToCase)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
                >
                <FilePlus className="w-4 h-4 mr-2" /> {t('common.add_to_case')}
                </button>
                {showAddToCase && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white shadow-lg border rounded-md p-2 z-10">
                        <select 
                            className="w-full p-2 border rounded mb-2 text-sm"
                            onChange={(e) => setSelectedCaseId(e.target.value)}
                            value={selectedCaseId}
                        >
                            <option value="">{t('common.confirm')}...</option>
                            {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                        <button 
                            onClick={handleAddToCase}
                            className="w-full bg-green-600 text-white text-xs py-1 rounded"
                        >
                            {t('common.confirm')}
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- AI CHAT COMPONENT --- */

interface AIChatProps {
  onLogActivity: (action: string, details: string) => void;
  cases: CaseFile[];
  onAddToCase: (caseId: string, content: string) => void;
}

export const AIChat: React.FC<AIChatProps> = ({ onLogActivity, cases, onAddToCase }) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: t('chat.initial'), timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial message when language changes if it's the only message
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
      setMessages([{ ...messages[0], text: t('chat.initial') }]);
    }
  }, [language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendChatMessage(history, userMsg.text, language);
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText || t('common.error'), timestamp: Date.now() };
      
      setMessages(prev => [...prev, botMsg]);
      onLogActivity('Chat IA', `User sent message. Length: ${userMsg.text.length}`);
    } catch (error) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: t('common.error'), timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
              {msg.role === 'model' && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex gap-2">
                       <button onClick={() => navigator.clipboard.writeText(msg.text)} title={t('common.copy')} className="text-gray-400 hover:text-primary-600"><Copy className="w-3 h-3"/></button>
                  </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex space-x-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat.placeholder')}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

/* --- DOC GENERATOR COMPONENT --- */

interface DocGenProps {
    onLogActivity: (action: string, details: string) => void;
    onAddToCase: (caseId: string, content: string, title: string) => void;
    cases: CaseFile[];
}

export const DocGenerator: React.FC<DocGenProps> = ({ onLogActivity, onAddToCase, cases }) => {
    const { t, language } = useLanguage();
    const [docType, setDocType] = useState('Contrat de travail');
    const [details, setDetails] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCase, setSelectedCase] = useState('');

    const handleGenerate = async () => {
        if(!details) return;
        setLoading(true);
        try {
            const content = await generateDocument(docType, details, language);
            setGeneratedContent(content || "Erreur de génération.");
            onLogActivity('Génération Document', `Type: ${docType}`);
        } catch(e) {
            alert(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const saveToCase = () => {
        if(!selectedCase || !generatedContent) return;
        onAddToCase(selectedCase, generatedContent, `Document: ${docType}`);
        alert(t('common.save'));
    }

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
                <h2 className="text-xl font-bold mb-6 flex items-center text-slate-800">
                    <FileText className="w-6 h-6 mr-2 text-primary-600" /> {t('generator.title')}
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('generator.doc_type')}</label>
                        <select 
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="w-full border rounded-md p-2"
                        >
                            <option>Contrat de travail (CDI/CDD)</option>
                            <option>Contrat de bail</option>
                            <option>Lettre de mise en demeure</option>
                            <option>Statuts de société (SARL/SAS)</option>
                            <option>Conclusions juridiques</option>
                            <option>Attestation sur l'honneur</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('generator.details')}</label>
                        <textarea 
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={10}
                            className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder={t('generator.details_placeholder')}
                        />
                        <p className="text-xs text-gray-500 mt-1">{t('generator.hint')}</p>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={loading || !details}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 flex justify-center items-center transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <FilePlus className="mr-2 w-5 h-5"/>}
                        {t('generator.generate_btn')}
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200 overflow-y-auto flex flex-col">
                <h3 className="font-semibold text-gray-700 mb-4">{t('generator.preview')}</h3>
                
                <div className="flex-1 bg-white border p-6 rounded-md shadow-sm font-serif text-sm leading-relaxed whitespace-pre-wrap">
                    {generatedContent ? generatedContent : <span className="text-gray-400 italic">{t('generator.preview_placeholder')}</span>}
                </div>

                {generatedContent && (
                    <div className="mt-4 flex gap-2">
                        <button className="flex-1 bg-white border border-gray-300 py-2 rounded text-gray-700 hover:bg-gray-50 flex justify-center items-center">
                            <Download className="w-4 h-4 mr-2" /> PDF
                        </button>
                         <button className="flex-1 bg-white border border-gray-300 py-2 rounded text-gray-700 hover:bg-gray-50 flex justify-center items-center">
                            <Download className="w-4 h-4 mr-2" /> Word
                        </button>
                        <div className="flex-1 flex gap-1">
                            <select 
                                className="w-full text-xs border rounded" 
                                value={selectedCase} 
                                onChange={(e) => setSelectedCase(e.target.value)}
                            >
                                <option value="">Dossier...</option>
                                {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                            <button onClick={saveToCase} className="bg-green-600 text-white px-3 rounded hover:bg-green-700">OK</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component for jurisprudence
const ScaleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
);