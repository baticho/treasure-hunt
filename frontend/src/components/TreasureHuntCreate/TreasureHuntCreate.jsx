import { useContext } from 'react';

import styles from './TreasureHuntCreate.module.css';

import { TreasureHuntContext } from '../../contexts/TreasureHuntContext';
import * as treasureHuntService from '../../services/treasureHuntService';

const TreasureHuntCreate = () => {
    const { treasureHuntAdd } = useContext(TreasureHuntContext);

    const onSubmit = (e) => {
        e.preventDefault();

        const treasureHuntData = Object.fromEntries(new FormData(e.target));

        treasureHuntService.create(treasureHuntData)
            .then(result => {
                treasureHuntAdd(result)
            });
    };

    return (
        <section id="create-page" className={styles["create-page"]}>
            <form id="create" onSubmit={onSubmit}>
                <div className={styles["container"]}>
                    <h1>Create Treasure Hunt</h1>
                    <label htmlFor="leg-title">Tresure hunt name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter tresure hunt name..."
                        className={styles["input"]}
                    />
                    <label htmlFor="start_location">Start location:</label>
                    <input
                        type="text"
                        id="start_location"
                        name="start_location"
                        placeholder="Enter start location..."
                        className={styles["input"]}
                    />
                    <label htmlFor="end_location">End location:</label>
                    <input
                        type="text"
                        id="end_location"
                        name="end_location"
                        placeholder="Enter end location..."
                        className={styles["input"]}
                    />

                    <label htmlFor="description">Summary:</label>

                    <textarea name="description" id="description" defaultValue={""} className={styles["description"]} />

                    <label htmlFor="picture">Image:</label>

                    <input
                        type="file"
                        id="picture"
                        name="picture"
                        placeholder="Upload a photo..."
                    />


                    <input
                        className={`${styles["btn"]} ${styles["submit"]}`}
                        type="submit"
                        value="Create Treasure Hunt"
                    />
                </div>
            </form>
        </section>
    );
};

export default TreasureHuntCreate;