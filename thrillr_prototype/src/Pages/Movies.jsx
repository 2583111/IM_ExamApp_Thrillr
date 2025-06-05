import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styling/Main.css';
import NavBar from '../Components/NavBar';
import MovieRow from '../Components/MovieList';
import {
  fetchPopularHorror,
  fetchTopRatedHorror,
  fetchNewReleases,
  fetchHorrorByGenre,
  fetchHorrorByKeyword,
} from '../Components/APIHolder';

const allListsConfig = [
  { title: 'Popular Horror',    fetch: fetchPopularHorror     },
  { title: 'Top Rated Horror',  fetch: fetchTopRatedHorror    },
  { title: 'New Releases',      fetch: fetchNewReleases       },
  { title: 'Action-Horror',     fetch: () => fetchHorrorByGenre(28)   },
  { title: 'Thriller-Horror',   fetch: () => fetchHorrorByGenre(53)   },
  { title: 'Mystery-Horror',    fetch: () => fetchHorrorByGenre(9648) },
  { title: 'Sci-Fi-Horror',     fetch: () => fetchHorrorByGenre(878)  },
  { title: 'Fantasy-Horror',    fetch: () => fetchHorrorByGenre(14)   },
  { title: 'War-Horror',        fetch: () => fetchHorrorByGenre(10752)},
  { title: 'Family-Horror',     fetch: () => fetchHorrorByGenre(10751)},
  { title: 'Music-Horror',      fetch: () => fetchHorrorByGenre(10402)},
  { title: 'Romance-Horror',    fetch: () => fetchHorrorByGenre(10749)},
  { title: 'Adventure-Horror',  fetch: () => fetchHorrorByGenre(12)   },
  { title: 'Zombie-Horror',     fetch: () => fetchHorrorByKeyword(754) },
  { title: 'Vampire-Horror',    fetch: () => fetchHorrorByKeyword(1721)},
  { title: 'Ghost-Horror',      fetch: () => fetchHorrorByKeyword(1791)},
  { title: 'Slasher-Horror',    fetch: () => fetchHorrorByKeyword(12377)},
  { title: 'Psych-Horror',      fetch: () => fetchHorrorByKeyword(4565)},
  { title: 'Supernatural',      fetch: () => fetchHorrorByKeyword(990)  },
  { title: 'Found-Footage',     fetch: () => fetchHorrorByKeyword(788)  },
];

export default function MoviesPage() {
  const [lists, setLists]     = useState([]);
  const [idx, setIdx]         = useState(0);
  const [loading, setLoading] = useState(false);
  const sentinelRef           = useRef();
  const seenTitlesRef         = useRef(new Set());
  const observerStartedRef    = useRef(false);
  const navigate              = useNavigate();

  const loadNext = useCallback(async () => {
    if (loading || idx >= allListsConfig.length) return;
    setLoading(true);

    const { title, fetch } = allListsConfig[idx];
    try {
      const movies = await fetch();
      if (movies.length > 0 && !seenTitlesRef.current.has(title)) {
        seenTitlesRef.current.add(title);
        setLists(prev => [...prev, { title, movies }]);
      }
    } catch {
    } finally {
      setIdx(i => i + 1);
      setLoading(false);
      observerStartedRef.current = true; 
    }
  }, [idx, loading]);

  useEffect(() => {
    loadNext();
  }, [loadNext]);


  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!observerStartedRef.current) return;
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
      navigate(`/all-movies?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="container">
      {/* Always show NavBar */}
      <NavBar onSearchSubmit={handleSearchSubmit} />


      {lists.map(({ title, movies }) => (
        <MovieRow key={title} title={title} movies={movies} />
      ))}

      {loading && <p className="text-center">Loading more lists…</p>}

      {idx >= allListsConfig.length && !loading && (
        <div className="text-center my-1">
          <Link to="/all-movies">
            <button className="btn btn-secondary">View All Horror Movies</button>
          </Link>
        </div>
      )}

      <div ref={sentinelRef} style={{ height: '1px' }} />
    </div>
  );
}
