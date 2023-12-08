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

    const validateForm = () => {
        let valid = true;
        const errors = {};

        if (!formValues.name || formValues.name.length > 50) {
            errors.name = 'Name should be less than 50 characters';
            valid = false;
        }

        if (!formValues.start_location || formValues.start_location.length > 40) {
            errors.start_location = 'Start location should be less than 40 characters';
            valid = false;
        }

        if (!formValues.name || !formValues.start_location || !formValues.description || !formValues.picture) {
            errors.detail = 'All fields are required';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

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
                        className={`${styles['input']} ${errors.name ? 'error' : ''}`}
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                    <label htmlFor="start_location">Start Location:</label>
                    <input
                        type="text"
                        id="start_location"
                        name="start_location"
                        value={formValues.start_location}
                        onChange={handleChange}
                        className={`${styles['input']} ${errors.start_location ? 'error' : ''}`}
                    />
                    {errors.start_location && <span className="field-error">{errors.start_location}</span>}
                    <label htmlFor="description">Summary:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formValues.description}
                        onChange={handleChange}
                        className={`${styles['description']} ${errors.description ? 'error' : ''}`}
                    />
                    <label htmlFor="picture">Image url:</label>
                    <input
                        type="text"
                        id="picture"
                        name="picture"
                        value={formValues.picture}
                        onChange={handleChange}
                        className={`${styles['input']} ${errors.picture ? 'error' : ''}`}
                    />
                    {errors.picture && <span className="field-error">{errors.picture}</span>}
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
                    {errors.detail && <span className="field-error">{errors.detail}</span>}
                </div>
            </form>
        </section>
    );
};

export default CreateTreasureHunt;
