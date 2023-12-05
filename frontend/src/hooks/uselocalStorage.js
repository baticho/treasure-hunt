import { useEffect, useState } from 'react';

export const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        const storedData = localStorage.getItem(key);


        return storedData ? JSON.parse(storedData) : defaultValue;
    });

    const setLocalStorageValue = (newValue) => {
        localStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
    };

    useEffect(() => {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const storedTimestamp = parsedData.timestamp;
            const currentTimestamp = Date.now();
            const timeDifference = (currentTimestamp - storedTimestamp) / (1000 * 60);

            if (timeDifference >= 60) {
                setValue({});
                localStorage.removeItem(key);
            }
        }
    }, [key]);

    return [
        value,
        setLocalStorageValue,
    ];
}