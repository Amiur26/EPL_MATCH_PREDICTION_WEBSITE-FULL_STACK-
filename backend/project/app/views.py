from django.contrib.auth.models import User
from django.shortcuts import  get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .models import *
from rest_framework import serializers
from rest_framework import status
from .serializer import *
import joblib # type: ignore
import pandas as pd # type: ignore




class UserProfileView(APIView):

    def post(self, request):
        # Extract `sub`, `nickname`, and `email` from the request data
    
        username = request.data.get('nickname')
        email = request.data.get('email')

        if not username or not email:
            return Response({"error": "Incomplete user data provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if a user with the unique `email` exists; if not, create one
        user, created = User.objects.get_or_create(
            email=email,  # Using `email` as a unique identifier
            defaults={
              # Storing `sub` in the `username` field
                "username": username, # Storing `nickname` in the `first_name` field
            },
        )

        # Return response indicating whether the user was created or already existed
        return Response({"user_id": user.id, "created": created}, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)



class JerseyViewSet(viewsets.ModelViewSet):
    queryset = Jersey.objects.all()
    serializer_class = JerseySerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    
    
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, '/home/asus/Desktop/Website/MachineLearningModel/refined_voting_ensemble.pkl')
home_metrics_path = os.path.join(BASE_DIR, '/home/asus/Desktop/Website/MachineLearningModel/home_metrics.pkl')
away_metrics_path = os.path.join(BASE_DIR, '/home/asus/Desktop/Website/MachineLearningModel/away_metrics.pkl')
encoder_path = os.path.join(BASE_DIR, '/home/asus/Desktop/Website/MachineLearningModel/team_encoder.pkl')
refined_voting_ensemble = joblib.load("/home/asus/Desktop/Website/MachineLearningModel/refined_voting_ensemble.pkl")

model = joblib.load(model_path)
home_metrics = joblib.load(home_metrics_path)
away_metrics = joblib.load(away_metrics_path)
team_encoder = joblib.load(encoder_path)

class PredictWinnerAPIView(APIView):
    """
    API endpoint to predict the winner of a football match
    between two teams.
    """

    def get(self, request):
        # Parse request parameters
        home_team = request.query_params.get('home_team')
        away_team = request.query_params.get('away_team')

        # Validate input
        if not home_team or not away_team:
            return Response({"error": "Missing team names"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Call the predict_winner function
            result = self.predict_winner(
                home_team=home_team,
                away_team=away_team,
                team_encoder=team_encoder,
                home_metrics=home_metrics,
                away_metrics=away_metrics,
                model=refined_voting_ensemble
            )
            # If result is an error message, return 400 response
            if "Error" in result:
                return Response({"error": result}, status=status.HTTP_400_BAD_REQUEST)

            # Return prediction
            return Response({"prediction": result}, status=status.HTTP_200_OK)

        except Exception as e:
            # Handle unexpected errors
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @staticmethod
    def predict_winner(home_team, away_team, team_encoder, home_metrics, away_metrics, model):
        

        # Validate team names
        if home_team not in team_encoder.classes_:
            return f"Error: Home team '{home_team}' is not a valid team."
        if away_team not in team_encoder.classes_:
            return f"Error: Away team '{away_team}' is not a valid team."

        # Encode team names
        home_team_encoded = team_encoder.transform([home_team])[0]
        away_team_encoded = team_encoder.transform([away_team])[0]

        # Validate metrics existence
        if home_team_encoded not in home_metrics.index:
            return f"Error: Metrics not found for home team '{home_team}'."
        if away_team_encoded not in away_metrics.index:
            return f"Error: Metrics not found for away team '{away_team}'."

        # Retrieve metrics for the teams
        home_team_features = home_metrics.loc[home_team_encoded].values
        away_team_features = away_metrics.loc[away_team_encoded].values

        # Construct input feature array
        match_features = [
            home_team_encoded,  # HomeTeam
            away_team_encoded,  # AwayTeam
            home_team_features[0],  # HS
            away_team_features[0],  # AS
            home_team_features[1],  # HST
            away_team_features[1],  # AST
            home_team_features[2],  # HC
            away_team_features[2],  # AC
        ]

        # Convert input to a DataFrame with feature names
        feature_names = ['HomeTeam', 'AwayTeam', 'HS', 'AS', 'HST', 'AST', 'HC', 'AC']
        input_df = pd.DataFrame([match_features], columns=feature_names)

        # Use the model's predict method
        prediction = model.predict(input_df)[0]

        result = "Home Win" if prediction == 0 else "Away Win"
        winning_team = home_team if prediction == 0 else away_team

        return result, winning_team