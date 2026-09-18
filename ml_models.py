import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")

# ==========================================
# LOAD SAVED MODELS
# ==========================================

pipeline = joblib.load(
    os.path.join(ARTIFACTS_DIR, "xgb_epi_pipeline.pkl")
)

twin_scaler = joblib.load(
    os.path.join(ARTIFACTS_DIR, "twin_scaler.pkl")
)

twin_model = joblib.load(
    os.path.join(ARTIFACTS_DIR, "twin_kmeans.pkl")
)

model_feature_cols = joblib.load(
    os.path.join(ARTIFACTS_DIR, "model_feature_cols.pkl")
)

twin_feature_cols = joblib.load(
    os.path.join(ARTIFACTS_DIR, "twin_feature_cols.pkl")
)


# ==========================================
# EPI PREDICTION
# ==========================================


def predict_epi(features):
    """
    Predict EPI score from the 27 engineered features.
    """

    X = pd.DataFrame([features])

    # Ensure correct feature order
    X = X[model_feature_cols]

    prediction = pipeline.predict(X)[0]

    return float(prediction)

from sklearn.metrics import pairwise_distances


# ==========================================
# ENVIRONMENTAL TWIN FINDER
# ==========================================

def find_environmental_twins(country_name, country_data, n=10):
    """
    Find countries environmentally similar to the
    selected country using the trained K-Means model
    and standardized feature space.
    """

    data = country_data.copy()

    # Scale the twin features
    X = twin_scaler.transform(
        data[twin_feature_cols]
    )

    # Find selected country
    matches = data[
        data["country"].str.lower() == country_name.lower()
    ]

    if matches.empty:
        raise ValueError(
            f"{country_name} not found."
        )

    country_index = matches.index[0]

    # Position of selected country in scaled data
    position = data.index.get_loc(country_index)

    country_vector = X[position].reshape(1, -1)

    # Calculate distances
    distances = pairwise_distances(
        country_vector,
        X,
        metric="euclidean"
    )[0]

    data["distance"] = distances

    # Keep same cluster
    selected_cluster = twin_model.predict(
        country_vector
    )[0]

    twins = data[
        (data["cluster"] == selected_cluster) &
        (data.index != country_index)
    ].sort_values("distance")

    return twins[
        ["country", "iso", "cluster", "distance"]
    ].head(n)


# ==========================================
# SCENARIO ANALYSIS
# ==========================================

def run_scenario(country_name, country_data, changes):
    """
    Run a hypothetical sustainability intervention
    scenario for a country.

    changes:
        Dictionary containing percentage changes
        to engineered model features.

        Example:
        {"CDA_latest": -10}
    """

    country_row = country_data[
        country_data["country"].str.lower() == country_name.lower()
    ]

    if country_row.empty:
        raise ValueError(
            f"{country_name} not found."
        )

    scenario = country_row.drop(
        columns=["country", "iso", "EPI_score", "EPI_rank"],
        errors="ignore"
    ).copy()

    baseline_prediction = predict_epi(
        scenario.iloc[0].to_dict()
    )

    for feature, percentage in changes.items():

        if feature not in scenario.columns:
            raise ValueError(
                f"{feature} is not a valid model feature."
            )

        scenario[feature] = (
            scenario[feature] *
            (1 + percentage / 100)
        )

    scenario_prediction = predict_epi(
        scenario.iloc[0].to_dict()
    )

    epi_change = (
        scenario_prediction -
        baseline_prediction
    )

    return {
        "country": country_name,
        "baseline_prediction": float(baseline_prediction),
        "scenario_prediction": float(scenario_prediction),
        "epi_change": float(epi_change),
        "changes": changes
    }