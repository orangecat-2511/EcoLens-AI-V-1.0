import pandas as pd
import ml_models


# ==========================================
# TEST 1: EPI PREDICTION
# ==========================================

print("\n--- TEST 1: EPI Prediction ---")

# Load the engineered country data
model_features = pd.read_csv(
    "outputs/model_features.csv"
)

india = model_features[
    model_features["country"].str.lower() == "india"
].iloc[0]

india_features = india.drop(
    labels=["country", "iso", "EPI_score", "EPI_rank"]
).to_dict()

prediction = ml_models.predict_epi(india_features)

print("India predicted EPI:", prediction)


# ==========================================
# TEST 2: ENVIRONMENTAL TWINS
# ==========================================

print("\n--- TEST 2: Environmental Twins ---")

twin_data = pd.read_csv(
    "outputs/twin_data.csv"
)

twins = ml_models.find_environmental_twins(
    "India",
    twin_data,
    n=5
)

print(twins)


# ==========================================
# TEST 3: SCENARIO ANALYSIS
# ==========================================

print("\n--- TEST 3: Scenario Analysis ---")

scenario = ml_models.run_scenario(
    "India",
    model_features,
    {"CDA_latest": -10}
)

print(scenario)


print("\nAll ML tests completed.")