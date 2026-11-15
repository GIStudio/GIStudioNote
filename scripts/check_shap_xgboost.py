#!/usr/bin/env python3
"""Reproduce the numbers used in content/AI/xgboost-and-shap.md.

Requires: xgboost, shap, scikit-learn, pandas, numpy.
Verified with xgboost 2.1.4, shap 0.49.1, scikit-learn 1.6.1.

Checks four things:
1. local accuracy (base value + sum of SHAP equals the model output);
2. gain-based feature importance versus mean absolute SHAP ranking;
3. what happens to SHAP when two features are duplicates or highly correlated;
4. that probability-space output needs the interventional perturbation.
"""

from __future__ import annotations

import numpy as np
import shap
import xgboost as xgb
from sklearn.datasets import fetch_california_housing, load_breast_cancer
from sklearn.model_selection import train_test_split

SEED = 42


def regression_checks() -> None:
    X, y = fetch_california_housing(return_X_y=True, as_frame=True)
    X_train, X_test, y_train, _ = train_test_split(
        X, y, test_size=0.2, random_state=SEED
    )
    model = xgb.XGBRegressor(
        n_estimators=200, max_depth=5, learning_rate=0.1, random_state=SEED
    ).fit(X_train, y_train)

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test)
    prediction = model.predict(X_test)
    error = np.abs(explainer.expected_value + shap_values.sum(axis=1) - prediction)

    print(f"base value           {explainer.expected_value:.4f}")
    print(f"shap shape           {shap_values.shape}")
    print(f"max additivity error {error.max():.2e}")

    gain = model.feature_importances_
    gain_order = list(X.columns[np.argsort(-gain)][:5])
    shap_order = list(X.columns[np.argsort(-np.abs(shap_values).mean(axis=0))][:5])
    print(f"gain top5            {gain_order}")
    print(f"mean|shap| top5      {shap_order}")


def duplicate_and_correlated() -> None:
    rng = np.random.default_rng(3)
    n = 4000
    z = rng.normal(size=n)
    y = 2 * z + rng.normal(scale=0.1, size=n)

    duplicates = np.column_stack([z, z.copy()])
    model = xgb.XGBRegressor(
        n_estimators=200, max_depth=4, learning_rate=0.1, random_state=0
    ).fit(duplicates, y)
    dup = np.abs(shap.TreeExplainer(model).shap_values(duplicates[:300])).mean(axis=0)
    print(f"exact duplicates     {dup.round(3)}")

    correlated = np.column_stack(
        [z + rng.normal(scale=0.7, size=n), z + rng.normal(scale=0.7, size=n)]
    )
    model = xgb.XGBRegressor(
        n_estimators=200, max_depth=4, learning_rate=0.1, random_state=0
    ).fit(correlated, y)
    corr = np.abs(shap.TreeExplainer(model).shap_values(correlated[:300])).mean(axis=0)
    print(f"correlated pair      {corr.round(3)}")


def classifier_checks() -> None:
    X, y = load_breast_cancer(return_X_y=True, as_frame=True)
    X_train, X_test, y_train, _ = train_test_split(
        X, y, test_size=0.25, random_state=0
    )
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1,
        random_state=0,
        eval_metric="logloss",
    ).fit(X_train, y_train)
    background = X_train.sample(100, random_state=0)
    probability = model.predict_proba(X_test)[:, 1]

    try:
        shap.TreeExplainer(model, model_output="probability").shap_values(X_test)
    except ValueError as exc:
        print(f"probability w/o data {exc}")

    prob_explainer = shap.TreeExplainer(
        model,
        data=background,
        feature_perturbation="interventional",
        model_output="probability",
    )
    prob_values = prob_explainer.shap_values(X_test)
    prob_error = np.abs(
        prob_explainer.expected_value + prob_values.sum(axis=1) - probability
    )

    raw_explainer = shap.TreeExplainer(
        model, data=background, feature_perturbation="interventional"
    )
    raw_values = raw_explainer.shap_values(X_test)
    log_odds = np.log(probability / (1 - probability))
    raw_error = np.abs(
        raw_explainer.expected_value + raw_values.sum(axis=1) - log_odds
    )

    print(f"prob additivity      {prob_error.max():.2e}")
    print(f"raw additivity       {raw_error.max():.2e}")


if __name__ == "__main__":
    regression_checks()
    duplicate_and_correlated()
    classifier_checks()
