import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider }         from './Authorization/AuthContext';
import { ReviewProvider }       from './Authorization/ReviewContext';
import { AchievementsProvider } from './Authorization/AchievementsContext';

import Layout                    from './Components/Layout';
import AchievementModal          from './Components/AchievementsModal';

import MoviesPage                from './Pages/Movies';
import AllMoviesPage             from './Pages/AllMoviesPage';
import MovieDescriptionPage      from './Pages/MovieDescription';
import SeriesPage                from './Pages/Series';
import AllSeriesPage             from './Pages/AllSeriesPage';
import SeriesDescriptionPage     from './Pages/SeriesDescription';
import SocialPage                from './Pages/Social';
import ProfilePage               from './Pages/Profile';
import ListsPage                 from './Pages/Lists';
import WatchlistPage             from './Pages/Watchlist';
import CompletedListPage         from './Pages/CompletedList';
import ReviewsAndCommentsPage    from './Pages/ReviewsAndComments';
import Login                     from './Pages/LoginPage';
import SignUp                    from './Pages/SignUpPage';
import SettingsPage              from './Pages/Settings';
import ErrorPage                 from './Pages/ErrorPage';

export default function App() {
  return (
    <AuthProvider>
      <ReviewProvider>
        <AchievementsProvider>
          <Router>
            {/* AchievementModal must be outside of Routes so it can open from anywhere */}
            <AchievementModal />

            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Movies */}
                <Route index element={<MoviesPage />} />
                <Route path="all-movies" element={<AllMoviesPage />} />
                <Route path="movies/:id" element={<MovieDescriptionPage />} />

                {/* Series */}
                <Route path="series" element={<SeriesPage />} />
                <Route path="all-series" element={<AllSeriesPage />} />
                <Route path="series/:id" element={<SeriesDescriptionPage />} />

                {/* Community */}
                <Route path="social" element={<SocialPage />} />

                {/* Lists */}
                <Route path="lists" element={<ListsPage />} />
                <Route path="watchlist" element={<WatchlistPage />} />
                <Route path="completed" element={<CompletedListPage />} />
                <Route path="my-reviews" element={<ReviewsAndCommentsPage />} />

                {/* Auth */}
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="settings" element={<SettingsPage />} />

                {/* Profile */}
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* 404 fallback */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Router>
        </AchievementsProvider>
      </ReviewProvider>
    </AuthProvider>
  );
}
