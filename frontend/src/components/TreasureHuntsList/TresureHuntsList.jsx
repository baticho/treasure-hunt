import { useContext } from "react";

import styles from './TresureHuntsList.module.css'

import { TreasureHuntContext } from "../../contexts/TreasureHuntContext";
import TreasureHunt from "./TreasureHunt";

const TresureHuntsList = () => {
    const { treasureHunts } = useContext(TreasureHuntContext);
    
    return (
        <section className={styles["catalog-page"]}>
            <h1>All Treasure Hunts</h1>
            <div className={styles["treasure-hunts"]}>
                {treasureHunts.length > 0
                    ? treasureHunts.map(treasureHunt => <TreasureHunt key={treasureHunt.id} treasureHunt={treasureHunt} />)
                    : <p className={styles["no-articles"]}>No treasure hunts yet</p>
                }
            </div>
        </section>
    );
};

export default TresureHuntsList;