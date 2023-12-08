import { createContext, useReducer, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';

import * as treasureHuntService from '../services/treasureHuntService';
import { AuthContext, useAuthContext } from "./AuthContext";

export const TreasureHuntContext = createContext();

const treasureHuntReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_TREASURE_HUNTS':
            return action.payload;
        case 'ADD_TREASURE_HUNT':
            return [...state, action.payload];
        case 'FETCH_TREASURE_HUNT_DETAILS':
        case 'EDIT_TREASURE_HUNT':
            return state.map(x => x.id == action.treasureHuntId ? action.payload : x);
        case 'EDIT_SCORE':
            return state.map(x => x.id == action.treasureHuntId ? { ...x, user_score: action.payload.score } : x );
        case 'REMOVE_TREASURE_HUNT':
            return state.filter(x => x.id != action.treasureHuntId);
        default:
            return state;
    }
};

export const TreasureHuntProvider = ({
    children,
}) => {
    const navigate = useNavigate();
    const [treasureHunts, dispatch] = useReducer(treasureHuntReducer, []);
    const { auth } = useAuthContext();

    useEffect(() => {
        treasureHuntService.getAll()
            .then(result => {
                const action = {
                    type: 'FETCH_TREASURE_HUNTS',
                    payload: result.results
                };

                dispatch(action);
            })
            .catch;
    }, [auth]);

    const selectTreasureHunt = (treasureHuntId) => {
        return treasureHunts.find(x => x.id === parseInt(treasureHuntId)) || {};
    };

    const fetchTreasureHuntDetails = (treasureHuntId, treasureHuntDetails) => {
        dispatch({
            type: 'FETCH_TREASURE_HUNT_DETAILS',
            payload: treasureHuntDetails,
            treasureHuntId,
        })
    }


    const treasureHuntCreate = (treasureHuntData) => {
        dispatch({
            type: 'ADD_TREASURE_HUNT',
            payload: treasureHuntData,
        })

        navigate('/catalog');
    };

    const treasureHuntEdit = (treasureHuntId, treasureHuntData) => {
        dispatch({
            type: 'EDIT_TREASURE_HUNT',
            payload: treasureHuntData,
            treasureHuntId,
        });
    };

    const treasureHuntScore = (treasureHuntId, treasureHuntData) => {
        dispatch({
            type: 'EDIT_SCORE',
            payload: treasureHuntData,
            treasureHuntId,
        });
    };

    const treasureHuntRemove = (treasureHuntId) => {
        dispatch({
            type: 'REMOVE_TREASURE_HUNT',
            treasureHuntId
        })
    }
    return (
        <TreasureHuntContext.Provider value={{
            treasureHunts,
            treasureHuntCreate,
            treasureHuntEdit,
            treasureHuntScore,
            fetchTreasureHuntDetails,
            selectTreasureHunt,
            treasureHuntRemove
        }}>
            {children}
        </TreasureHuntContext.Provider>
    );
}