# MP/NIF weaning cohort — ML benchmark

Reproduces the "would machine learning help?" question for a 60-patient
weaning cohort (23 events, 46 pre-extubation features).

    pip install pandas numpy scipy scikit-learn openpyxl statsmodels
    python3 build_features.py          # leakage-free feature matrix
    python3 benchmark.py 10            # apparent vs nested-CV AUC + permutation control
    python3 importance.py              # LASSO stability selection + RF permutation importance

`data.xlsx` is NOT committed (patient data). Place it in this directory to run.

See RESULTS.md for the numbers and their interpretation. Headline: with 0.50 events
per variable, every ML model's cross-validated AUC (0.55-0.60) is indistinguishable
from its own permutation baseline (0.552), while a 2-predictor logistic model shows
zero optimism (0.821 -> 0.827).
