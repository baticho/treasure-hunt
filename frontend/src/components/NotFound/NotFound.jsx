import { useContext } from "react";
import styles from './NotFound.module.css'


const NotFound = () => {
    return (
      <div className={styles["not-found-container"]}>
        <h1 className={styles["not-found-title"]}>404 - Not Found</h1>
        <p className={styles["not-found-text"]}>The page you're looking for does not exist.</p>
      </div>
    );
  };

export default NotFound;