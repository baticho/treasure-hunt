import React, { useEffect, useState } from "react";
import * as gameService from '../../services/gameService';
import { useAuthContext } from "../../contexts/AuthContext";

const GamePage = () => {
    const { auth } = useAuthContext();
    const [game, setGame] = useState(null);
    const [timeDifference, setTimeDifference] = useState(null);

    useEffect(() => {
        gameService.fetchGame(auth.user.pk).then((data) => {
            setGame(data);
            console.log(data);
            const startTime = new Date(data.results[0].start_time);
            const currentTime = new Date();
            const difference = currentTime - startTime;

            setTimeDifference(difference);
        }).catch((error) => {
            console.error('Error fetching game:', error);
            setGame(null);
        });
    }, [auth]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeDifference(prevDifference => prevDifference + 1000);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (milliseconds) => {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div>
            {game ? (
                <>
                    <h2>{formatTime(timeDifference)}</h2>
                    <p>{game.results.current_clue}</p>
                </>
            ) : (
                <h2>New Game</h2>
            )}
        </div>
    );
};

export default GamePage;
