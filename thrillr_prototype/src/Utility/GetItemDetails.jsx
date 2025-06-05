const API_KEY  = '680c759ca5b3d7e7b323f7c6c646367b';
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Fetch details for a single movie or TV series.
 * @param {'movie'|'series'} type 
 * @param {string|number} id 
 * @returns {Promise<object|null>} movie/series object or null on error
 */
export async function fetchItemDetails(type, id) {
  try {
    const path = type === 'movie' ? `movie/${id}` : `tv/${id}`;
    const url = `${BASE_URL}/${path}?api_key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}
