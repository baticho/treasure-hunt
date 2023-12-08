import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TreasureHuntCreate.module.css';
import * as treasureHuntService from '../../services/treasureHuntService';
import { TreasureHuntContext } from '../../contexts/TreasureHuntContext';
import useForm from '../../hooks/useForm';

const CreateTreasureHunt = () => {
    const { treasureHuntCreate } = useContext(TreasureHuntContext);
    const navigate = useNavigate();


    const { formValues, errors, handleChange, setErrors } = useForm({
        name: '',
        start_location: '',
        description: '',
        picture: '',
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const result = await treasureHuntService.create(formValues);
            treasureHuntCreate(result);
            navigate(`/catalog/`);
        } catch (error) {
            const errorString = error.toString().replace('Error: ', '');
            const errors = JSON.parse(errorString);
            setErrors(errors);
        }
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
                        value={formValues.name}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <label htmlFor="start_location">Start Location:</label>
                    <input
                        type="text"
                        id="start_location"
                        name="start_location"
                        value={formValues.start_location}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <label htmlFor="description">Summary:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formValues.description}
                        onChange={handleChange}
                        className={styles.description}
                    />
                    <label htmlFor="picture">Image url:</label>
                    <input
                        type="text"
                        id="picture"
                        name="picture"
                        value={formValues.picture}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    {errors.picture && <span className={styles["field-error"]}>{errors.picture}</span>}
                    {formValues.picture && (
                        <img
                            id="selectedImage"
                            className={styles['current-img']}
                        value={formValues.picture}
                        src={formValues.picture}
                            alt={formValues.name}
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
