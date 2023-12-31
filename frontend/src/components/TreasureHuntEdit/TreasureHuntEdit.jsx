import { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TreasureHuntEdit.module.css';
import * as treasureHuntService from '../../services/treasureHuntService';
import { TreasureHuntContext } from '../../contexts/TreasureHuntContext';
import useForm from '../../hooks/useForm';
import useDropboxUpload from '../../hooks/useDropboxUpload';

const EditTreasureHunt = () => {
    const { treasureHuntEdit } = useContext(TreasureHuntContext);
    const { treasureHuntId } = useParams();
    const navigate = useNavigate();

    const { formValues, errors, handleChange, setErrors, setFormValuesExternally } = useForm({
        name: 'Loading...',
        start_location: 'Loading...',
        description: 'Loading...',
        picture: 'Loading...',
    });

    const {
        uploading,
        uploadedURL,
        error,
        uploadImageToDropbox,
    } = useDropboxUpload();

    useEffect(() => {
        if (uploadedURL) {
            setFormValuesExternally({ picture: uploadedURL });
        }
    }, [uploadedURL]);


    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        uploadImageToDropbox(file);
    };

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

        for (const field in formValues) {
            if (!formValues[field]) {
                errors[field] = `This field is required`;
                valid = false;
            }
        }

        setErrors(errors);
        return valid;
    };

    useEffect(() => {
        treasureHuntService.getOne(treasureHuntId)
        .then((treasureHunt) => {
            setFormValuesExternally({
                name: treasureHunt.name,
                start_location: treasureHunt.start_location,
                description: treasureHunt.description,
                picture: treasureHunt.picture,
            });
        })
        .catch((error) => {
            console.error('Error fetching treasure hunt:', error);
        });
    }, [treasureHuntId]);
    
    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const result = await treasureHuntService.edit(treasureHuntId, formValues);
            treasureHuntEdit(treasureHuntId, result);
            navigate(`/catalog/`);
        } catch (error) {
            const errorString = error.toString().replace('Error: ', '');
            const errors = JSON.parse(errorString);
            setErrors(errors);
        }
    };


    return (
        <section className={styles['edit-page']}>
            <form id="create" onSubmit={onSubmit}>
                <div className="container">
                    <h1>Edut Treasure Hunt</h1>
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
                    {errors.description && <span className="field-error">{errors.description}</span>}
                    <label htmlFor="picture">Image:</label>
                    <input
                        type="file"
                        id="picture"
                        name="picture"
                        onChange={handleFileUpload}
                        className={`${styles['input']} ${errors.picture ? 'error' : ''}`}
                    />
                    {uploading && <p>Uploading...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {errors.picture && <span className="field-error">{errors.picture}</span>}
                    {formValues.picture && (
                        <img
                            id="selectedImage"
                            className={styles['current-img']}
                            src={formValues.picture}
                            alt={formValues.name}
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
