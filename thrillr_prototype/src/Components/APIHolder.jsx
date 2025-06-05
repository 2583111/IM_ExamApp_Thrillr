
const API_KEY           = '680c759ca5b3d7e7b323f7c6c646367b';
const BASE_URL          = 'https://api.themoviedb.org/3';
// TMDB’s “Horror” keyword for TV shows = 315058
const HORROR_KEYWORD_ID = 315058;


async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status}`);
  return res.json();
}

function filterAndSortByDate(results) {
  const now = Date.now();
  return results
    .filter(item => {
      const dateMillis = Date.parse(item.release_date || '');
      return dateMillis && dateMillis <= now;
    })
    .sort((a, b) => {
      const da = Date.parse(a.release_date || '0');
      const db = Date.parse(b.release_date || '0');
      if (db !== da) return db - da;
      // same date? compare by vote_average
      return (b.vote_average || 0) - (a.vote_average || 0);
    });
}

/**
 * Core helper: fetch movie endpoints, forcing with_genres=27 (Horror movies),
 * filter out future releases, then sort by release_date & vote_average.
 *
 * @param {string} path    
 * @param {object} params  
 * @returns {Promise<{ movies: Array, totalPages?: number }>}
 */
async function getHorrorMovieItems(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  const query = new URLSearchParams({
    api_key:      API_KEY,
    with_genres:  '27',    // TMDB Movie “Horror” genre ID
    ...params,
  });
  url.search = query.toString();

  const json = await fetchJSON(url);
  const rawResults = Array.isArray(json.results) ? json.results : [];
  const normalized = rawResults.map(item => ({
    ...item,
    release_date: item.release_date || '',
  }));
  const filtered = filterAndSortByDate(normalized);

  if (json.total_pages != null) {
    return { movies: filtered, totalPages: json.total_pages };
  }
  return { movies: filtered };
}

/**
 * Core helper: fetch TV endpoints, forcing with_keywords=315058 (Horror keyword),
 * copy first_air_date → release_date, filter out future dates, then sort.
 *
 * @param {string} path   
 * @param {object} params 
 * @returns {Promise<{ movies: Array, totalPages?: number }>}
 */
async function getHorrorTVItems(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  const query = new URLSearchParams({
    api_key:       API_KEY,
    with_keywords: HORROR_KEYWORD_ID.toString(),
    ...params,
  });
  url.search = query.toString();

  const json = await fetchJSON(url);
  const rawResults = Array.isArray(json.results) ? json.results : [];

  const normalized = rawResults.map(item => ({
    ...item,
    release_date: item.first_air_date || '',
  }));
  const filtered = filterAndSortByDate(normalized);

  if (json.total_pages != null) {
    return { movies: filtered, totalPages: json.total_pages };
  }
  return { movies: filtered };
}


export function fetchPopularHorror() {
  return getHorrorMovieItems('/discover/movie', { sort_by: 'popularity.desc' })
    .then(r => r.movies);
}

export function fetchTopRatedHorror() {
  return getHorrorMovieItems('/discover/movie', { sort_by: 'vote_count.desc' })
    .then(r => r.movies);
}

export async function fetchNewReleases() {
  const year = new Date().getFullYear().toString();
  const { movies } = await getHorrorMovieItems('/discover/movie', {
    primary_release_year: year,
    sort_by:              'release_date.desc',
  });
  // only show those with at least one vote
  return movies.filter(m => (m.vote_average || 0) > 0);
}

export function fetchHorrorByGenre(genreId) {
  // Combine “27” (Horror‐movie) + subgenre
  return getHorrorMovieItems('/discover/movie', {
    with_genres: `27,${genreId}`,
  }).then(r => r.movies);
}

export function fetchHorrorByKeyword(keywordId) {
  return getHorrorMovieItems('/discover/movie', {
    with_keywords: keywordId,
  }).then(r => r.movies);
}

export function fetchAllHorrorMovies(page = 1) {
  return getHorrorMovieItems('/discover/movie', {
    sort_by: 'release_date.desc',
    page:    page.toString(),
  });
}

export async function searchHorrorMovies(query) {
  if (!query) return [];
  const { movies } = await getHorrorMovieItems('/search/movie', {
    query,
    include_adult: 'false',
  });
  return movies;
}


const TV_DISCOVER_PATH = '/discover/tv';
const TV_SEARCH_PATH   = '/search/tv';

export function fetchPopularHorrorSeries() {
  return getHorrorTVItems(
    TV_DISCOVER_PATH,
    { sort_by: 'popularity.desc' }
  ).then(r => r.movies);
}

export function fetchTopRatedHorrorSeries() {
  return getHorrorTVItems(
    TV_DISCOVER_PATH,
    { sort_by: 'vote_count.desc' }
  ).then(r => r.movies);
}

export async function fetchNewHorrorSeries() {
  const year = new Date().getFullYear().toString();
  const { movies } = await getHorrorTVItems(
    TV_DISCOVER_PATH,
    {
      first_air_date_year: year,
      sort_by:             'first_air_date.desc',
    }
  );
  return movies.filter(m => (m.vote_average || 0) > 0);
}

export function fetchHorrorSeriesByGenre(genreId) {
  return getHorrorTVItems(
    TV_DISCOVER_PATH,
    {
      with_genres:   `${genreId}`,          
    }
  ).then(r => r.movies);
}

export function fetchHorrorSeriesByKeyword(subKeywordId) {
  return getHorrorTVItems(
    TV_DISCOVER_PATH,
    { with_keywords: `${HORROR_KEYWORD_ID},${subKeywordId}` }
  ).then(r => r.movies);
}

export function fetchAllHorrorSeries(page = 1) {
  return getHorrorTVItems(
    TV_DISCOVER_PATH,
    {
      sort_by: 'first_air_date.desc',
      page:    page.toString(),
    }
  );
}

export async function searchHorrorSeries(query) {
  if (!query) return [];
  const { movies } = await getHorrorTVItems(
    TV_SEARCH_PATH,
    {
      query,
      include_adult: 'false',
    }
  );
  return movies;
}


export async function fetchMovieKeywords() {
  const url = new URL(`${BASE_URL}/genre/movie/list`);
  url.search = new URLSearchParams({
    api_key:  API_KEY,
    language: 'en-US',
  }).toString();
  const { genres = [] } = await fetchJSON(url);
  return genres;  
}
