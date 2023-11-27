import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import styles from './TreasureHuntEdit.module.css'

import * as treasureHuntService from '../../services/treasureHuntService';
import { TreasureHuntContext } from "../../contexts/TreasureHuntContext";

const EditTreasureHunt = () => {
    const [currentTreasureHunt, setCurrentTreasureHunt] = useState({});
    const { treasureHuntEdit } = useContext(TreasureHuntContext);
    const { treasureHuntId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        treasureHuntService.getOne(treasureHuntId)
            .then(treasureHuntData => {
                setCurrentTreasureHunt(treasureHuntData);
            })
    }, [])

    const onSubmit = (e) => {
        e.preventDefault();

        const treasureHuntData = Object.fromEntries(new FormData(e.target));

        treasureHuntService.edit(treasureHuntId, treasureHuntData)
            .then(result => {
                treasureHuntEdit(treasureHuntId, result);
                navigate(`/catalog/${treasureHuntId}`)
            });
    };

    return (
        <section className={styles["edit-page"]}>
            <form id="edit" onSubmit={onSubmit}>
                <div className="container">
                    <h1>Edit Treasure Hunt</h1>
                    <label htmlFor="leg-title">Legendary title:</label>
                    <input type="text" id="title" name="title" defaultValue={currentTreasureHunt.name} className={styles["input"]} />
                    <label htmlFor="category">Start Location:</label>
                    <input type="text" id="category" name="category" defaultValue={currentTreasureHunt.start_location} className={styles["input"]} />
                    <label htmlFor="summary">Summary:</label>
                    <textarea name="summary" id="summary" defaultValue={currentTreasureHunt.description} className={styles["description"]} />
                    <label htmlFor="picture">Image:</label>
                    <input type="file" id="picture" name="picture" />
                    {currentTreasureHunt.picture && <img id="selectedImage" className={styles["current-img"]} src={currentTreasureHunt.picture} alt={currentTreasureHunt.name} />}
                    <input className={`${styles["btn"]} ${styles["submit"]}`} type="submit" defaultValue="Edit Treasure Hunt" />
                </div>
            </form>
        </section>
    );
}

export default EditTreasureHunt;