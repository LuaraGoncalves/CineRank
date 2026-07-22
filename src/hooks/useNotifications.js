import { useEffect, useState } from 'react';
import { StorageService } from '../core/storage.js';

export const NEWS_TIME_ZONE = 'America/Sao_Paulo';

const INITIAL_VISIBLE_NEWS = 8;
const NEWS_PER_LOAD = 8;

function getNewsDay(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: NEWS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function sortNewsByCurrentDay(articles) {
  const today = getNewsDay(new Date());

  return [...articles].sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    const isTodayA = getNewsDay(dateA) === today;
    const isTodayB = getNewsDay(dateB) === today;

    if (isTodayA !== isTodayB) return isTodayA ? -1 : 1;
    return dateB.getTime() - dateA.getTime();
  });
}

async function translateText(text) {
  if (!text) return text;

  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(text)}`
  );
  if (!res.ok) {
    throw new Error('Falha ao traduzir notícia');
  }

  const data = await res.json();
  return data[0].map((item) => item[0]).join('');
}

async function translateWithRetry(text) {
  try {
    return await translateText(text);
  } catch (firstError) {
    console.warn('Tentando traduzir novamente...', firstError);
    return await translateText(text);
  }
}

export function useNotifications(fetchNewsFn) {
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_NEWS);
  const [hasUnread, setHasUnread] = useState(false);
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const articles = await fetchNewsFn();
      const sortedArticles = sortNewsByCurrentDay(articles);
      setNews(sortedArticles);

      const lastSeen = StorageService.getLastSeenNewsDate();
      if (
        sortedArticles.length > 0 &&
        (!lastSeen ||
          new Date(sortedArticles[0].publishedAt) > new Date(lastSeen))
      ) {
        setHasUnread(true);
      }
      setLoading(false);
    }

    loadNews();
  }, [fetchNewsFn]);

  const handleOpen = () => {
    setIsOpen((prev) => {
      if (!prev) {
        setHasUnread(false);
        StorageService.setLastSeenNewsDate(new Date().toISOString());
      }
      return !prev;
    });
  };

  const handleTranslate = async (index, title, description) => {
    if (translations[index]?.loading || translations[index]?.title) return;

    setTranslations((prev) => ({ ...prev, [index]: { loading: true } }));

    try {
      const [translatedTitle, translatedDescription] = await Promise.all([
        translateWithRetry(title),
        translateWithRetry(description)
      ]);

      setTranslations((prev) => ({
        ...prev,
        [index]: {
          title: translatedTitle,
          description: translatedDescription,
          loading: false
        }
      }));
    } catch (error) {
      console.error('Erro ao traduzir:', error);
      setTranslations((prev) => ({
        ...prev,
        [index]: { loading: false, error: true }
      }));
    }
  };

  const showMore = () => {
    setVisibleCount((prev) => prev + NEWS_PER_LOAD);
  };

  return {
    isOpen,
    setIsOpen,
    news,
    loading,
    visibleCount,
    hasUnread,
    translations,
    handleOpen,
    handleTranslate,
    showMore
  };
}
