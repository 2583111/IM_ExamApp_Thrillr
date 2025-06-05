import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import MovieCard from '../Components/MovieCards';
import { fetchAllHorrorMovies, searchHorrorMovies } from '../Components/APIHolder';

export default function AllMoviesPage() {
  const [movies, setMovies]             = useState([]);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(null);
  const [loading, setLoading]           = useState(false);
  const [searchParams]                  = useSearchParams();
  const loadMoreRef                     = useRef();
  const navigate                        = useNavigate();

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    if (!searchQuery) return;

    setLoading(true);
    searchHorrorMovies(searchQuery)
      .then(results => {
        setMovies(results);
        setTotalPages(null);
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
      const { movies: fetched, totalPages: tp } = await fetchAllHorrorMovies(page);
      setMovies(prev => {
        const merged = [...prev];
        fetched.forEach(x => {
          if (!merged.find(y => y.id === x.id)) merged.push(x);
        });
        return merged;
      });
      setTotalPages(tp);
      setPage(p => p + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, totalPages, loading, searchQuery]);

  useEffect(() => {
    if (!searchQuery) {
      loadPage();
    }
  }, [loadPage, searchQuery]);

  // IntersectionObserver for infinite scroll (when not searching)
  useEffect(() => {
    if (searchQuery) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadPage();
      },
      { rootMargin: '300px' }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadPage, searchQuery]);

  // When user presses “Enter” in NavBar, re‐navigate here with updated search
  const handleSearchSubmit = (query) => {
    navigate(`/all-movies?search=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <NavBar onSearchSubmit={handleSearchSubmit} />

      <h1>
        {searchQuery
          ? `Search Results for “${searchQuery}”`
          : 'All Released Horror Movies'}
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
        }}
      >
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Loading…</p>}
      {!searchQuery && totalPages != null && page > totalPages && !loading && (
        <p style={{ textAlign: 'center' }}>All movies loaded.</p>
      )}

      {/* Sentinel for infinite scroll */}
      {!searchQuery && <div ref={loadMoreRef} style={{ height: 1 }} />}
    </div>
  );
}
