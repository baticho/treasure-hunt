import { useState } from 'react';
import styles from './GameHints.module.css';

const GameHints = ({ hints }) => {
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [selectedHint, setSelectedHint] = useState(null);
  const [usedHints, setUsedHints] = useState([]);

  const handleHintClick = (hint) => {
    setSelectedHint(hint);
    setIsConfirmationVisible(true);
  };

  const handleConfirmClick = () => {
    setUsedHints((prevUsedHints) => [...prevUsedHints, selectedHint]);
    setIsConfirmationVisible(false);
  };

  return (
    <section id="game-hints" className={styles["game-hints"]}>
      {hints.map((hint) => (
        <div key={hint.id}>
          <span
            className={`show ${usedHints.includes(hint) ? 'used' : ''} ${selectedHint === hint ? 'selected' : ''}`}
            onClick={() => handleHintClick(hint)}
          >
            {selectedHint === hint ? hint.hint : hint.bonus_minutes}
          </span>
        </div>
      ))}

      {isConfirmationVisible && (
        <div className={styles['hint-confirmation']}>
            <div className={styles['confirmation-box']}>
                <p>Are you sure you want to use this hint?</p>
                <div className={styles['confirmation-buttons']}>
                    <button onClick={handleConfirmClick}>Yes</button>
                    <button onClick={() => setIsConfirmationVisible(false)}>No</button>
                </div>
            </div>
        </div>
      )}

      {usedHints.length > 0 && (
        <div className={styles['used-hints']}>
          <p>Used Hints:</p>
          {usedHints.map((usedHint, index) => (
            <span key={index}>{usedHint.hint}</span>
          ))}
        </div>
      )}
    </section>
  );
};

export default GameHints;
