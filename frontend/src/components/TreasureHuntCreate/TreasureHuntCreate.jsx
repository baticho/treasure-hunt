import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TreasureHuntCreate.module.css';
import * as treasureHuntService from '../../services/treasureHuntService';
import { TreasureHuntContext } from '../../contexts/TreasureHuntContext';

const CreateTreasureHunt = () => {
    const { treasureHuntCreate } = useContext(TreasureHuntContext);
    const navigate = useNavigate();

    const [treasureHunt, setTreasureHunt] = useState({
        name: '',
        start_location: '',
        description: '',
        picture: '',
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        
        const values = Object.fromEntries(new FormData(e.currentTarget));

        try {
            const result = await treasureHuntService.create(values);
            treasureHuntCreate(result);
            navigate(`/catalog/`);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const onChange = (e) => {
        setTreasureHunt(state => ({
            ...state,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <section className={styles['create-page']}>
            <form id="create" onSubmit={onSubmit}>
                <div className="container">
                    <h1>Create Treasure Hunt</h1>
                    <label htmlFor="name">Title:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={treasureHunt.name}
                        onChange={onChange}
                        className={styles.input}
                    />
                    <label htmlFor="start_location">Start Location:</label>
                    <input
                        type="text"
                        id="start_location"
                        name="start_location"
                        value={treasureHunt.start_location}
                        onChange={onChange}
                        className={styles.input}
                    />
                    <label htmlFor="description">Summary:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={treasureHunt.description}
                        onChange={onChange}
                        className={styles.description}
                    />
                    <label htmlFor="picture">Image:</label>
                    <input
                        type="text"
                        id="picture"
                        name="picture"
                        value={treasureHunt.picture}
                        onChange={onChange}
                        className={styles.input}
                    />
                    {treasureHunt.picture && (
                        <img
                            id="selectedImage"
                            className={styles['current-img']}
                        value={treasureHunt.picture}
                        src={treasureHunt.picture}
                            alt={treasureHunt.name}
                        />
                    )}
                    <input
                        className={`${styles.btn} ${styles.submit}`}
                        type="submit"
                        value="Create Treasure Hunt"
                    />
                </div>
            </form>
        </section>
    );
};

export default CreateTreasureHunt;
