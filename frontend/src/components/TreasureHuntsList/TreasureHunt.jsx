import { Link } from 'react-router-dom';

import styles from './TreasureHunt.module.css'
import { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

const TreasureHunt = ({ treasureHunt }) => {
    const [selectedStars, setSelectedStars] = useState(treasureHunt.score);
    const { auth } = useAuthContext();
    const [showPopup, setShowPopup] = useState(false); // State to control the popup visibility


    const updateRating = (newRating) => {
        const data = {
            score: newRating,
            treasure_hunt: treasureHunt.id,
        };
        scoreService.newScore(data);
    };

    const handleStarClick = (starIndex) => {
        if (auth?.user) {
            const newRating = starIndex + 1;
            setSelectedStars(newRating);
            updateRating(newRating);
        } else {
            // Show the popup message if the user is not logged in
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 3000); // Hide the popup after 3 seconds (adjust as needed)
        }
    };
    return (
        <div className={styles["treasure-hunt"]}>
            <div className={styles["image-wrap"]}>
                <img src={treasureHunt.picture} />
            </div>
            <h3>{treasureHunt.name}</h3>
            <div className={styles["rating"]}>
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
            <div className={styles["data-buttons"]}>
                <Link to={`/catalog/${treasureHunt.id}`} className={styles["details-btn"]}>
                    Details
                </Link>
            </div>
        </div>
    );
};

export default TreasureHunt;