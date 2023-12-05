import { useState } from 'react';

const useForm = (initialState = {}) => {
    const [formValues, setFormValues] = useState(initialState);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const resetForm = () => {
        setFormValues(initialState);
    };

    return {
        formValues,
        errors,
        handleChange,
        resetForm,
        setErrors,
    };
};

export default useForm;
