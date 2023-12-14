import React, { useEffect, useState } from "react";
import * as gameService from '../../services/gameService';
import { useAuthContext } from "../../contexts/AuthContext";
import useForm from "../../hooks/useForm";
import styles from './GamePage.module.css'

const GamePage = () => {
    const { auth } = useAuthContext();
    const [game, setGame] = useState(null);
    const [timeDifference, setTimeDifference] = useState(null);

    const { formValues, errors, handleChange, setErrors, resetForm } = useForm({
        answer: '',
    });

    useEffect(() => {
        gameService.fetchGame(auth.user.pk).then((data) => {
            setGame(data.results[0]);
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

    const validateForm = () => {
        let valid = true;
        const errors = {};

        if (formValues.answer.trim() !== game.current_clue.answer) {
            errors.answer = 'Wrong answer!';
            valid = false;
        }


        setErrors(errors);
        return valid;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            console.log(formValues, game.pk)
            const result = await gameService.nextClueGame(formValues, game.pk);
            console.log(result);
            setGame(result);
            resetForm();
        } catch (error) {
            const errorString = error.toString().replace('Error: ', '');
            const errors = JSON.parse(errorString);
            setErrors(errors);
        }
    };

    return (
        <section id="game-page" className={styles["game-page"]}>
            {game ? (
                <>
                    {game.is_completed ? (
                        <div className={styles["game-completed"]}>
                            <h2>Game Completed:</h2>
                            <p className={styles["treasure-hunt"]}>Treasure Hunt: {game.treasure_hunt_name}</p>
                            <p className={styles["completed-time"]}>Completed Time: {formatTime(new Date(game.end_time) - new Date(game.start_time))}</p>
                            <p className={styles["user"]}>User: {auth.user.user}</p>
                        </div>
                    
                    ) : (
                        <form id="login" onSubmit={onSubmit}>
                            <div className={styles["container"]}>
                                <h2>Timer: {formatTime(timeDifference)}</h2>
                                <h1 className={styles["form-header"]}>{game.current_clue.title}</h1>
                                <img className={styles["clue-img"]} src={game.current_clue.picture} alt={game.treasure_hunt}/>
                                <label htmlFor="username">Answer:</label>
                                <input
                                    type="text"
                                    id="answer"
                                    name="answer"
                                    placeholder="answer"
                                    className={`${styles['input']} ${errors.answer ? 'error' : ''}`}
                                    value={formValues.answer}
                                    onChange={handleChange}
                                />
                                {errors.answer && <span className="field-error">{errors.answer}</span>}
                                <input type="submit" className={`${styles["btn"]} ${styles["submit"]}`} value="Answer" />
                                {errors.detail && <span className="field-error">{errors.detail}</span>}
                            </div>
                        </form>
                    )}
                </>
            ) : (
                <h2>No Game</h2>
            )}
        </section>
    );
    
};

export default GamePage;
