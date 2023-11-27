import { useContext } from "react";

import styles from './Home.module.css'

import { TreasureHuntContext } from "../../contexts/TreasureHuntContext";
import TreasureHunt from "../TreasureHuntsList/TreasureHunt";

const Home = () => {
    const { treasureHunts } = useContext(TreasureHuntContext);
    
    return (
        <>
            <section className={styles["welcome-section"]}>
                <div className={styles["welcome-message"]}>
                    <h2>Welcome to the Ultimate</h2>
                    <h3>Treasure Hunt Adventure!</h3>
                    <p>Are you ready to embark on an exciting journey filled with mysteries, puzzles, and hidden treasures? You've come to the right place! Our Treasure Hunt website is your gateway to thrilling quests that will test your wits and lead you to unimaginable riches.</p>
                    <p>Get ready to explore mysterious locations, decipher cryptic clues, and follow the trail of legendary treasures. Whether you're a seasoned treasure hunter or a newbie seeking thrills, our website offers a variety of treasure hunts suitable for all skill levels.</p>
                    <p>Join our treasure hunting community, team up with fellow adventurers, and start your quest for glory and fortune today. The thrill of discovery awaits!</p>
                    <p>Are you up for the challenge? Start your adventure now and let the hunt begin!"</p>
                </div>
                <div className={styles["home-page"]}>
                    <h1>Latest Treasure Hunts</h1>
                    <div className={styles["treasure-hunts"]}>
                        {treasureHunts.length > 0
                            ? treasureHunts.map(treasureHunt => <TreasureHunt key={treasureHunt.id} treasureHunt={treasureHunt} />)
                            : <p className={styles["no-articles"]}>No treasure hunts yet</p>
                        }
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;