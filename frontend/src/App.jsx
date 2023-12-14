import { lazy, Suspense } from "react";
import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { TreasureHuntProvider } from './contexts/TreasureHuntContext';
import PrivateRoute from "./components/common/PrivateRoute";

import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import TreasureHuntCreate from './components/TreasureHuntCreate/TreasureHuntCreate';
import TreasureHuntEdit from './components/TreasureHuntEdit/TreasureHuntEdit';
import TresureHuntsList from './components/TreasureHuntsList/TresureHuntsList';
import TresureHuntDetails from "./components/TreasureHuntDetails/TreasureHuntDetails";
import GamePage from "./components/GamePage/GamePage";
import './App.css';
import TreasureHuntOwner from "./components/common/TreasureHuntOwner";
import NotFound from "./components/NotFound/NotFound";

const Register = lazy(() => import('./components/Register/Register'));

function App() {
    return (
        <AuthProvider>
            <div id="box">
                <Header />

                <TreasureHuntProvider>
                    <main id="main-content" className="main">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={
                                <Suspense fallback={<span>Loading....</span>}>
                                    <Register />
                                </Suspense>
                            } />
                            <Route path="/create" element={(
                                <PrivateRoute>
                                    <TreasureHuntCreate />
                                </PrivateRoute>
                            )} />
                            <Route element={<TreasureHuntOwner />}>
                                <Route path="/treasure-hunts/:treasureHuntId/edit" element={<TreasureHuntEdit />} />
                            </Route>
                            <Route element={<PrivateRoute />}>
                                <Route path="/logout" element={<Logout />} />
                            </Route>
                            <Route path="/catalog" element={<TresureHuntsList />} />
                            <Route path="/catalog/:treasureHuntId" element={<TresureHuntDetails />} />
                            <Route path="/game" element={<GamePage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </TreasureHuntProvider>
            </div>
        </AuthProvider>
    );
}

export default App;