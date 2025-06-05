import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styling/Main.css'; 
import NavBar from '../Components/NavBar';
import SeriesList from '../Components/SeriesList';
import {
  fetchPopularHorrorSeries,
  fetchTopRatedHorrorSeries,
  fetchNewHorrorSeries,
  fetchHorrorSeriesByGenre,
  fetchHorrorSeriesByKeyword,
} from '../Components/APIHolder';

const allSeriesConfig = [
  { title: 'Popular Horror Series',    fetch: fetchPopularHorrorSeries   },
  { title: 'Top Rated Horror Series',  fetch: fetchTopRatedHorrorSeries   },
  { title: 'New Horror Series',        fetch: fetchNewHorrorSeries        },
  { title: 'Action-Horror Series',     fetch: () => fetchHorrorSeriesByGenre(28)   },
  { title: 'Thriller-Horror Series',   fetch: () => fetchHorrorSeriesByGenre(53)   },
  { title: 'Mystery-Horror Series',    fetch: () => fetchHorrorSeriesByGenre(9648)},
  { title: 'Supernatural Series',      fetch: () => fetchHorrorSeriesByKeyword(990)},
  { title: 'Ghost-Horror Series',      fetch: () => fetchHorrorSeriesByKeyword(1791)},
];

export default function SeriesPage() {
  const [lists, setLists]     = useState([]);
  const [idx, setIdx]         = useState(0);
  const [loading, setLoading] = useState(false);
  const sentinelRef           = useRef();
  const seenTitlesRef         = useRef(new Set());
  const observerReadyRef      = useRef(false);
  const navigate              = useNavigate();

  const loadNext = useCallback(async () => {
    if (loading || idx >= allSeriesConfig.length) return;
    setLoading(true);

    const { title, fetch } = allSeriesConfig[idx];
    try {
      const items = await fetch();
      if (items.length > 0 && !seenTitlesRef.current.has(title)) {
        seenTitlesRef.current.add(title);
        setLists(prev => [...prev, { title, series: items }]);
      }
    } catch {
      // ignore errors
    } finally {
      setIdx(i => i + 1);
      setLoading(false);
      observerReadyRef.current = true; // allow IntersectionObserver after first load
    }
  }, [idx, loading]);

  // Seed load
  useEffect(() => {
    loadNext();
  }, [loadNext]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!observerReadyRef.current) return;
        if (entry.isIntersecting) {
          loadNext();
        }
      },
      { rootMargin: '300px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadNext]);


  const handleSearchSubmit = (query) => {
    if (query) {
      navigate(`/all-series?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="container">
      {/* Always show NavBar */}
      <NavBar onSearchSubmit={handleSearchSubmit} />


      {lists.map(({ title, series }) => (
        <SeriesList key={title} title={title} series={series} />
      ))}

      {loading && <p className="text-center">Loading more lists…</p>}

      {idx >= allSeriesConfig.length && !loading && (
        <div className="text-center my-1">
          <Link to="/all-series">
            <button className="btn btn-secondary">View All Horror Series</button>
          </Link>
        </div>
      )}

      {/* sentinel element for infinite scroll */}
      <div ref={sentinelRef} style={{ height: '1px' }} />
    </div>
  );
}
