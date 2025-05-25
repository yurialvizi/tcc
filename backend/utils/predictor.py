import pandas as pd
mappings = {
    'sex': {
        'female': 0,
        'male': 1
    },
    'present_employee_since': {
        'unemployed': 0, '<1y': 1, '1-4y': 2, '4-7y': 3, '>=7y': 4
    },
    'checking_account': {
        'no checking account': 0, '< 0 DM': 1, '0 <= ... < 200 DM': 2, '>= 200 DM': 3
    },
    'savings': {
        '0 or unk.': 0, '<100 DM': 1, '100-500 DM': 2, '500-1000 DM': 3, '>1000 DM': 4
    },
    'job': {
        'unemployed/unskilled non-resident': 0,
        'unskilled resident': 1,
        'qualified': 2,
        'highly qualified': 3
    }
}

EXPECTED_FEATURES = [
    "sex",
    "marrital_status",
    "age",
    "n_of_liables",
    "job",
    "foreign_worker",
    "present_employee_since",
    "telephone",
    "housing",
    "present_residence_since",
    "property",
    "checking_account",
    "savings",
    "purpose",
    "credit_history",
    "duration",
    "credit_amount",
    "guarantors",
    "other_installment_plans",
    "credits_at_bank"
]

TRAINED_FEATURES = [
    'sex', 'age', 'n_of_liables', 'job', 'foreign_worker',
    'present_employee_since', 'telephone', 'present_residence_since',
    'checking_account', 'savings', 'credit_history', 'duration',
    'credit_amount', 'credits_at_bank',
    'marrital_status_married/widowed', 'marrital_status_single',
    'housing_own', 'housing_rent', 'property_car or other',
    'property_real estate', 'property_unk. / no property',
    'purpose_domestic appliances', 'purpose_education',
    'purpose_furniture/equipment', 'purpose_new car', 'purpose_others',
    'purpose_radio/television', 'purpose_repairs', 'purpose_retraining',
    'purpose_used car', 'guarantors_guarantor', 'guarantors_none',
    'other_installment_plans_none', 'other_installment_plans_stores'
]

def preprocessing(input_data):
    data_df = pd.DataFrame([input_data])[EXPECTED_FEATURES]

    for feature, mapping in mappings.items():
        data_df[feature] = data_df[feature].map(mapping).astype(int)

    # TODO: Refactor dummies to use OneHotEncoder
    data_dummies_df = pd.get_dummies(data_df, dtype=int)
    for col in TRAINED_FEATURES:
        if col not in data_dummies_df:
            data_dummies_df[col] = 0
    data_dummies_df = data_dummies_df[TRAINED_FEATURES]
    
    return data_dummies_df

def predict_with_models(models, input_data):
    results = {}
    for name, model in models.items():
        pred = model.predict(input_data)[0]
        # TODO: Check if this is right
        results[name] = "Bom Pagador" if pred == 1 else "Mau Pagador"
    return results