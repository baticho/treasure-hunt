import { Link } from 'react-router-dom';

import styles from './TreasureHunt.module.css'

const TreasureHunt = ({ treasureHunt }) => {
    
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
                        className={index < treasureHunt.score ? styles["filled-star"] : styles["empty-star"]}
                    >
                        ☆
                    </span>
                ))}
            </div>
            <div className={styles["data-buttons"]}>
                <Link to={`/catalog/${treasureHunt.id}`} className={styles["details-btn"]}>
                    Details
                </Link>
            </div>
        </div>
    );
};

export default TreasureHunt;