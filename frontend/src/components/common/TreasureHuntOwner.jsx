import { useContext } from "react";
import { Outlet, useParams, Navigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/AuthContext";
import { TreasureHuntContext } from "../../contexts/TreasureHuntContext";

const TreasureHuntOwner = ({ children }) => {
    const { selectTreasureHunt } = useContext(TreasureHuntContext);
    const { auth, isAuthenticated } = useAuthContext();
    const { treasureHuntId } = useParams();

    const currentTreasureHunt = selectTreasureHunt(treasureHuntId);


    if (isAuthenticated && auth.user.pk !== parseInt(currentTreasureHunt.user)) {
        return <Navigate to='/catalog' replace />
    }

    return children ? children : <Outlet />;
};

export default TreasureHuntOwner;