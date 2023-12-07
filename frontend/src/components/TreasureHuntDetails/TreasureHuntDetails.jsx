import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TreasureHuntContext } from '../../contexts/TreasureHuntContext';
import { useAuthContext } from '../../contexts/AuthContext';

import styles from './TreasureHuntDetails.module.css';

import * as treasureHuntService from '../../services/treasureHuntService';
import * as scoreService from '../../services/scoreService';


const TreasureHuntDetails = () => {
    const navigate = useNavigate();
    const { selectTreasureHunt, treasureHuntScore, treasureHuntRemove } = useContext(TreasureHuntContext);
    const { auth } = useAuthContext();
    const { treasureHuntId } = useParams();

    const currentTreasureHunt = selectTreasureHunt(treasureHuntId);
    const [selectedStars, setSelectedStars] = useState(currentTreasureHunt.score);
    const [showPopup, setShowPopup] = useState(false);

    const isOwner = currentTreasureHunt.user === auth.user?.pk;

    useEffect(() => {
        (async () => {
            const treasureHuntDetails = await treasureHuntService.getOne(treasureHuntId);
        })();
        setSelectedStars(currentTreasureHunt.score);
    }, [currentTreasureHunt])

    const treasureHuntDeleteHandler = () => {
        const confirmation = window.confirm('Are you sure you want to delete this treasure hunt?');

        if (confirmation) {
            treasureHuntService.remove(treasureHuntId)
                .then(() => {
                    treasureHuntRemove(treasureHuntId);
                    navigate('/catalog');
                })
        }
    };

    const updateRating = async (newRating) => {
        const data = {
            score: newRating,
            treasure_hunt: currentTreasureHunt.id,
        };
        try {
            const result = await scoreService.newScore(data);
            treasureHuntScore(treasureHuntId, result);
        } catch (error) {
            console.error('Error:', error);
        }
        
    };

    const handleStarClick = (starIndex) => {
        if (auth?.user) {
            const newRating = starIndex + 1;
            setSelectedStars(newRating);
            updateRating(newRating);
        } else {
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 3000);
        }
    };

    return (
        <section className={styles["treasure-hunt-details"]} style={{ backgroundImage: `url(${currentTreasureHunt.picture})` }}>
            <div className={styles["treasure-hunt-info"]}>
                <h1 className={styles["treasure-hunt-title"]}>{currentTreasureHunt.name}</h1>
                <p className={styles["treasure-hunt-description"]}>
                {currentTreasureHunt.description}
                </p>
                <div className={styles["treasure-hunt-start"]}>
                <p>Start Location: <span className={styles["start-location"]}>{currentTreasureHunt.start_location}</span></p>
                </div>
                <div className={styles["treasure-hunt-creator"]}>
                    <p>Creator: <span className={styles["creator-name"]}>{currentTreasureHunt.user}</span></p>
                </div>
                <div className={styles["treasure-hunt-rating"]}>
                    <div className={styles["rating"]}>
                    Rating:
                        {[...Array(5)].map((_, index) => (
                            <span
                                key={index}
                                className={index < selectedStars ? styles["filled-star"] : styles["empty-star"]}
                                onClick={() => handleStarClick(index)}
                            >
                                ☆
                            </span>
                        ))}
                    </div>
                    {showPopup && <div className={styles["need-login"]}>Please log in to give a rating.</div>}
                    
                </div>
                <div className={styles["buttons"]}>
                {isOwner &&
                    <>
                        <Link to={`/treasure-hnuts/${treasureHuntId}/edit`} className={styles["button"]}>
                            Edit
                        </Link>
                        <a onClick={treasureHuntDeleteHandler} className={styles["button"]}>
                            Delete
                        </a>
                    </>
                }
                </div>
            </div>
            <div className={styles["start-button"]}>
                <button className={styles["button"]}>Start</button>
            </div>
        </section>
    );
};

export default TreasureHuntDetails;