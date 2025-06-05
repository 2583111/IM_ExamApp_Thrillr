import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import SeriesCard from '../Components/SeriesCard';
import { fetchAllHorrorSeries, searchHorrorSeries } from '../Components/APIHolder';

export default function AllSeriesPage() {
  const [items, setItems]     = useState([]);
  const [page, setPage]       = useState(1);
  const [totalPages, setTP]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams]        = useSearchParams();
  const loadMoreRef           = useRef();
  const navigate              = useNavigate();

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    if (!searchQuery) return;

    setLoading(true);
    searchHorrorSeries(searchQuery)
      .then(results => {
        setItems(results);
        setTP(null);      // reset totalPages
        setPage(1);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [searchQuery]);

  const loadPage = useCallback(async () => {
    if (loading || searchQuery || (totalPages != null && page > totalPages)) return;
    setLoading(true);
    try {
      const { movies: fetched, totalPages: tp } = await fetchAllHorrorSeries(page);
      setItems(prev => [...prev, ...fetched]);
      setTP(tp);           
      setPage(p => p + 1);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [page, totalPages, loading, searchQuery]);

  useEffect(() => {
    if (!searchQuery) {
      loadPage();
    }
  }, [loadPage, searchQuery]);

  useEffect(() => {
    if (searchQuery) return;
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300
      ) {
        loadPage();
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loadPage, searchQuery]);

  const handleSearchSubmit = (query) => {
    navigate(`/all-series?search=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <NavBar onSearchSubmit={handleSearchSubmit} />

      <h1>
        {searchQuery
          ? `Search Results for “${searchQuery}”`
          : 'All Released Horror Series'}
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1rem',
        }}
      >
        {items.map(s => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>

      {loading && (
        <p style={{ textAlign: 'center', margin: '1rem 0' }}>Loading…</p>
      )}
      {!searchQuery && totalPages != null && page > totalPages && !loading && (
        <p style={{ textAlign: 'center', margin: '1rem 0' }}>
          All horror series loaded.
        </p>
      )}

      {/* Sentinel for infinite scroll */}
      {!searchQuery && <div ref={loadMoreRef} style={{ height: 1 }} />}
    </div>
  );
}
