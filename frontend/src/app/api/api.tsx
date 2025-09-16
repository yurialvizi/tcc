export interface AnalyzeData {
  categoricalDistributions: Record<string, Record<string, number>>;
  numericalDistributions: Record<string, Record<string, number>>;
  error?: string;
}

export async function fetchAnalysisData(): Promise<AnalyzeData> {
  try {
    const res = await fetch("http://127.0.0.1:5000/analyze");
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    return {
      categoricalDistributions: data.categorical_distributions || {},
      numericalDistributions: data.numerical || {},
    };
  } catch (error: any) {
    console.error("Failed to fetch analysis data:", error);
    return {
      categoricalDistributions: {},
      numericalDistributions: {},
      error: error.message,
    };
  }
}

export function getCategoricalColumns(data: AnalyzeData): string[] {
  console.log(Object.keys(data?.categoricalDistributions || {}));
  return Object.keys(data?.categoricalDistributions || {});
}

export function getNumericalColumns(data: AnalyzeData): string[] {
  return Object.keys(data?.numericalDistributions || {});
}

export function getCheckingAccount(data: AnalyzeData) {
  return data?.categoricalDistributions?.checking_account || {};
}

export function getGuarantors(data: AnalyzeData) {
  return data?.categoricalDistributions?.guarantors || {};
}

export function getHousing(data: AnalyzeData) {
  return data?.categoricalDistributions?.housing || {};
}

export function getJob(data: AnalyzeData) {
  return data?.categoricalDistributions?.job || {};
}

export function getMarritalStatus(data: AnalyzeData) {
  return data?.categoricalDistributions?.marrital_status || {};
}

export function getOtherInstallmentPlans(data: AnalyzeData) {
  return data?.categoricalDistributions?.other_installment_plans || {};
}

export function getPresentEmployeeSince(data: AnalyzeData) {
  return data?.categoricalDistributions?.present_employee_since || {};
}

export function getProperty(data: AnalyzeData) {
  return data?.categoricalDistributions?.property || {};
}

export function getPurpose(data: AnalyzeData) {
  return data?.categoricalDistributions?.purpose || {};
}

export function getSavings(data: AnalyzeData) {
  return data?.categoricalDistributions?.savings || {};
}

export function getSex(data: AnalyzeData) {
    console.log(data?.categoricalDistributions?.sex || {})
  return data?.categoricalDistributions?.sex || {};
}

export function getAge(data: AnalyzeData) {
  return data?.numericalDistributions?.age || {};
}

export function getCreditAmount(data: AnalyzeData) {
  return data?.numericalDistributions?.credit_amount || {};
}

export function getCreditHistory(data: AnalyzeData) {
  return data?.numericalDistributions?.credit_history || {};
}

export function getCreditsAtBank(data: AnalyzeData) {
  return data?.numericalDistributions?.credits_at_bank || {};
}

export function getDuration(data: AnalyzeData) {
  return data?.numericalDistributions?.duration || {};
}

export function getForeignWorker(data: AnalyzeData) {
  return data?.numericalDistributions?.foreign_worker || {};
}

export function getNumberOfLiables(data: AnalyzeData) {
  return data?.numericalDistributions?.n_of_liables || {};
}

export function getPresentResidenceSince(data: AnalyzeData) {
  return data?.numericalDistributions?.present_residence_since || {};
}

export function getRisk(data: AnalyzeData) {
  return data?.numericalDistributions?.risk || {};
}

export function getTelephone(data: AnalyzeData) {
  return data?.numericalDistributions?.telephone || {};
}
