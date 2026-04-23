import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from './lib/firebase';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { PortfolioData, Topic, SocialLink } from './types';

interface PortfolioContextType {
  portfolio: PortfolioData | null;
  topics: Topic[];
  socialLinks: SocialLink[];
  loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Portfolio settings
    const unsubPortfolio = onSnapshot(doc(db, 'settings', 'portfolio'), (doc) => {
      if (doc.exists()) {
        setPortfolio(doc.data() as PortfolioData);
      }
      setLoading(false);
    });

    // Topics
    const unsubTopics = onSnapshot(collection(db, 'topics'), (snapshot) => {
      setTopics(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Topic)));
    });

    // Social Links
    const unsubSocial = onSnapshot(collection(db, 'socialLinks'), (snapshot) => {
      setSocialLinks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialLink)));
    });

    return () => {
      unsubPortfolio();
      unsubTopics();
      unsubSocial();
    };
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolio, topics, socialLinks, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
