import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TreasureHuntEdit.module.css';
import * as treasureHuntService from '../../services/treasureHuntService';
import { TreasureHuntContext } from '../../contexts/TreasureHuntContext';

const EditTreasureHunt = () => {
    const { treasureHuntEdit } = useContext(TreasureHuntContext);
    const { treasureHuntId } = useParams();
    const navigate = useNavigate();

    const [currentTreasureHunt, setCurrentTreasureHunt] = useState({
        name: '',
        start_location: '',
        description: '',
        picture: '',
    });

    useEffect(() => {
        treasureHuntService.getOne(treasureHuntId)
        .then((treasureHuntData) => {
            setCurrentTreasureHunt(treasureHuntData);
        })
        .catch((error) => {
            console.error('Error fetching treasure hunt:', error);
        });
    }, [treasureHuntId]);
    
    const onSubmit = async (e) => {
        e.preventDefault();
        
        const values = Object.fromEntries(new FormData(e.currentTarget));

        try {
            const result = await treasureHuntService.edit(treasureHuntId, values);
            treasureHuntEdit(treasureHuntId, result);
            navigate(`/catalog/${treasureHuntId}`);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const onChange = (e) => {
        setCurrentTreasureHunt(state => ({
            ...state,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <section className={styles['edit-page']}>
            <form id="edit" onSubmit={onSubmit}>
                <div className="container">
                    <h1>Edit Treasure Hunt</h1>
                    <label htmlFor="name">Title:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={currentTreasureHunt.name}
                        onChange={onChange}
                        className={styles.input}
                    />
                    <label htmlFor="start_location">Start Location:</label>
                    <input
                        type="text"
                        id="start_location"
                        name="start_location"
                        value={currentTreasureHunt.start_location}
                        onChange={onChange}
                        className={styles.input}
                    />
                    <label htmlFor="description">Summary:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={currentTreasureHunt.description}
                        onChange={onChange}
                        className={styles.description}
                    />
                    <label htmlFor="picture">Image url:</label>
                    <input
                        type="text"
                        id="picture"
                        name="picture"
                        value={currentTreasureHunt.picture}
                        onChange={onChange}
                        className={styles.input}
                    />
                    {currentTreasureHunt.picture && (
                        <img
                            id="selectedImage"
                            className={styles['current-img']}
                        value={currentTreasureHunt.picture}
                        src={currentTreasureHunt.picture}
                            alt={currentTreasureHunt.name}
                        />
                    )}
                    <input
                        className={`${styles.btn} ${styles.submit}`}
                        type="submit"
                        value="Edit Treasure Hunt"
                    />
                </div>
            </form>
        </section>
    );
};

export default EditTreasureHunt;
