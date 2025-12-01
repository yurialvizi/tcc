// Local metrics data for models - extracted from backend metadata
export const logisticRegressionMetrics = {
  confusion_matrix: [
    [0.28, 0.72],
    [0.08, 0.92]
  ],
  classification_report: {
    accuracy: 0.7256,
    recall: 0.2779,
    specificity: 0.9175,
    precision: 0.7477,
    f1score: 0.8240,
    training_time: 20.58
  }
};

export const randomForestMetrics = {
  confusion_matrix: [[0.84, 0.16], [0.06, 0.94]],
  classification_report: {
    accuracy: 0.9068,
    recall: 0.8366,
    specificity: 0.9369,
    precision: 0.9304,
    f1score: 0.9336,
    training_time: 73.88
  }
};

export const xgBoostMetrics = {
  confusion_matrix: [[0.85, 0.15], [0.06, 0.94]],
  classification_report: {
    accuracy: 0.9127,
    recall: 0.8457,
    specificity: 0.9414,
    precision: 0.9344,
    f1score: 0.9378,
    training_time: 37.35
  }
};

export const mlpMetrics = {
  confusion_matrix: [[0.82, 0.18], [0.06, 0.94]],
  classification_report: {
    accuracy: 0.9002,
    recall: 0.8170,
    specificity: 0.9359,
    precision: 0.9227,
    f1score: 0.9292,
    training_time: 783.83
  }
};

