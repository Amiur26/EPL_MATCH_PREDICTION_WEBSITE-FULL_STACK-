import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./PredictWinnerForm.css";


const teams = [
    { label: "Aston Villa", value: "Aston Villa" },
    { label: "Blackburn", value: "Blackburn" },
    { label: "Bolton", value: "Bolton" },
    { label: "Chelsea", value: "Chelsea" },
    { label: "Everton", value: "Everton" },
    { label: "Portsmouth", value: "Portsmouth" },
    { label: "Stoke", value: "Stoke" },
    { label: "Wolves", value: "Wolves" },
    { label: "Man United", value: "Man United" },
    { label: "Tottenham", value: "Tottenham" },
    { label: "Sunderland", value: "Sunderland" },
    { label: "Wigan", value: "Wigan" },
    { label: "Birmingham", value: "Birmingham" },
    { label: "Burnley", value: "Burnley" },
    { label: "Hull", value: "Hull" },
    { label: "Liverpool", value: "Liverpool" },
    { label: "Arsenal", value: "Arsenal" },
    { label: "Man City", value: "Man City" },
    { label: "Fulham", value: "Fulham" },
    { label: "West Ham", value: "West Ham" },
    { label: "West Brom", value: "West Brom" },
    { label: "Newcastle", value: "Newcastle" },
    { label: "Blackpool", value: "Blackpool" },
    { label: "QPR", value: "QPR" },
    { label: "Swansea", value: "Swansea" },
    { label: "Norwich", value: "Norwich" },
    { label: "Reading", value: "Reading" },
    { label: "Southampton", value: "Southampton" },
    { label: "Crystal Palace", value: "Crystal Palace" },
    { label: "Cardiff", value: "Cardiff" },
    { label: "Leicester", value: "Leicester" },
    { label: "Bournemouth", value: "Bournemouth" },
    { label: "Watford", value: "Watford" },
    { label: "Middlesbrough", value: "Middlesbrough" },
    { label: "Brighton", value: "Brighton" },
    { label: "Huddersfield", value: "Huddersfield" },
];

const PredictWinnerForm = () => {
    const [homeTeam, setHomeTeam] = useState("");
    const [awayTeam, setAwayTeam] = useState("");
    const [winningTeam, setWinningTeam] = useState("");
    const [error, setError] = useState("");
  

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setWinningTeam("");

        if (!homeTeam || !awayTeam) {
            setError("Both home team and away team must be provided.");
            return;
        }

        if (homeTeam.value === awayTeam.value) {
            setError("Home team and away team cannot be the same.");
            return;
        }
    

        try {
            const response = await axios.get("http://127.0.0.1:8000/app/predict/", {
                params: {
                    home_team: homeTeam.value,
                    away_team: awayTeam.value,
                },
            });
            const winningTeamName = response.data.prediction[1]; 
            setWinningTeam(winningTeamName);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong!");
        }
    };

    return (
        <div className="container">
            <h2 className="heading">Predict Match Winner</h2>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-group">
                <Select
                        options={teams}
                        value={homeTeam}
                        onChange={setHomeTeam}
                        placeholder="Select or type home team"
                        className="select"
                    />
                    <Select
                        options={teams}
                        value={awayTeam}
                        onChange={setAwayTeam}
                        placeholder="Select or type away team"
                        className="select"
                    />
                </div>
                <button type="submit" className="button" >
                    Predict Winner
                </button>
            </form>
            {winningTeam && (
                <p className="winning-team slide-up">
                    {winningTeam}
                </p>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default PredictWinnerForm;
