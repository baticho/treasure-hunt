import { useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TreasureHuntContext } from '../../contexts/TreasureHuntContext';
import { useAuthContext } from '../../contexts/AuthContext';

import styles from './TreasureHuntDetails.module.css';

import * as treasureHuntService from '../../services/treasureHuntService';

const TreasureHuntDetails = () => {
    const navigate = useNavigate();
    const { selectTreasureHunt, treasureHuntRemove } = useContext(TreasureHuntContext);
    const { auth } = useAuthContext();
    const { treasureHuntId } = useParams();

    const currentTreasureHunt = selectTreasureHunt(treasureHuntId);

    const isOwner = currentTreasureHunt.user === auth.user?.pk;

    useEffect(() => {
        (async () => {
            const treasureHuntDetails = await treasureHuntService.getOne(treasureHuntId);
        })();
    }, [])

    const treasureHuntDeleteHandler = () => {
        const confirmation = window.confirm('Are you sure you want to delete this treasure hunt?');

        if (confirmation) {
            treasureHuntService.remove(treasureHuntId)
                .then(() => {
                    treasureHuntRemove(treasureHuntId);
                    navigate('/catalog');
                })
        }
    }

    return (
        <section className={styles["treasure-hunt-details"]}>
            <h1>Treasure Hunt Details</h1>
            <div className={styles["info-section"]}>
                <div className={styles["treasure-hunt-header"]}>
                    <img className={styles["treasure-hunt-img"]} src={currentTreasureHunt.picture} />
                    <h1>{currentTreasureHunt.name}</h1>
                    <span className={styles["location"]}>Start Location: {currentTreasureHunt.start_location}</span>
                    <p className={styles["type"]}>{currentTreasureHunt.name}</p>
                </div>
                <p className={styles["text"]}>
                    {currentTreasureHunt.description}
                </p>
                {isOwner &&
                    <div className={styles["buttons"]}>
                        <Link to={`/treasure-hunts/${treasureHuntId}/edit`} className={styles["button"]}>
                            Edit
                        </Link>
                        <button onClick={treasureHuntDeleteHandler} className={styles["button"]}>
                            Delete
                        </button>
                    </div>
                }
            </div>
        </section>
    );
};

export default TreasureHuntDetails;