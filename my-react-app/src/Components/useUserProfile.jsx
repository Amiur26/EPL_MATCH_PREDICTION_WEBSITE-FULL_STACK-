import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCart } from "../Components/CartContext";

const useUserProfile = () => {
    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
    const { setUser } = useCart();
    const [isApiCalled, setApiCalled] = useState(false); 

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = await getAccessTokenSilently({
                    audience: "https://epl-match-prediction-api/",
                });

                const response = await axios.get("https://dev-cdwmdumqm7ri7jgj.us.auth0.com/userinfo", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const { nickname, email } = response.data;

                await axios.post(
                    "http://127.0.0.1:8000/user-profile/",
                    { nickname, email },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setUser({ email, nickname });
                setApiCalled(true);

                console.log("User info successfully saved to backend");
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        if (isAuthenticated && user && !isApiCalled) {
            fetchUserProfile();
        }
    }, [isAuthenticated, user, isApiCalled, getAccessTokenSilently, setUser]);

    return { isApiCalled };
};

export default useUserProfile;
