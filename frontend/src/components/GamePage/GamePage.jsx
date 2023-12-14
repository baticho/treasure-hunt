import React, { useEffect, useState } from "react";
import * as gameService from '../../services/gameService';
import { useAuthContext } from "../../contexts/AuthContext";
import useForm from "../../hooks/useForm";
import styles from './GamePage.module.css'

const GamePage = () => {
    const { auth } = useAuthContext();
    const [game, setGame] = useState(null);
    const [timeDifference, setTimeDifference] = useState(null);

    const { formValues, errors, handleChange, setErrors } = useForm({
        answer: '',
        treasure_hunt: '',
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

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(formValues.answer);

        // authService.login(formValues.username, formValues.password)
        // .catch((error) => {
        //     const errorString = error.toString().replace('Error: ', '');
        //     const errors = JSON.parse(errorString);
        //     setErrors(errors);
        // });
    };

    return (
        <section id="game-page" className={styles["game-page"]}>
            {game ? (
                <>
                    <h2>Timer: {formatTime(timeDifference)}</h2>
                    <form id="login" onSubmit={onSubmit}>
                        <div className={styles["container"]}>
                            <h1 className={styles["form-header"]}>{game.current_clue.title}</h1>
                            <img className={styles["clue-img"]} src={game.current_clue.picture} alt={game.treasure_hunt}/>
                            <label htmlFor="username">Answer:</label>
                            <input
                                type="text"
                                id="answer"
                                name="answer"
                                placeholder="answer"
                                className={`${styles['input']} ${errors.detail ? 'error' : ''}`}
                                value={formValues.answer}
                                onChange={handleChange}
                            />
                            {errors.answer && <span className="field-error">{errors.answer}</span>}
                            <input type="submit" className={`${styles["btn"]} ${styles["submit"]}`} value="Answer" />
                            {errors.detail && <span className="field-error">{errors.detail}</span>}
                        </div>
                    </form>
                </>
            ) : (
                <h2>New Game</h2>
            )}
        </section>
    );
};

export default GamePage;
