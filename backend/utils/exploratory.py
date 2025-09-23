"""Utilities to generate exploratory analysis plots and return them as base64 PNGs.

This mirrors the approach used in `backend/utils/shap.py` for SHAP waterfall
plots: create matplotlib figures, serialize to PNG in-memory, return base64
strings. The module also provides a CLI-friendly `main()` to save all plots to
the frontend `public/exploratory` directory.
"""
import base64
import io
from pathlib import Path
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import textwrap


OUT_DIR = Path(__file__).resolve().parents[2] / 'frontend' / 'public' / 'exploratory'
OUT_DIR.mkdir(parents=True, exist_ok=True)


def _fig_to_base64(fig, dpi=300, transparent=True):
    buf = io.BytesIO()
    try:
        fig.patch.set_alpha(0)
    except Exception:
        pass
    fig.savefig(buf, format='png', bbox_inches='tight', dpi=dpi, pad_inches=0.08, transparent=transparent)
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    return img_b64


def generate_secondary_plot(df, group_by, custom_order=None):
    """Create the bar+line style plot used in exploratory analysis and return base64 PNG."""
    risk_counts = df.groupby([group_by], observed=True)['risk'].value_counts(normalize=True).unstack('risk')
    total_counts = df.groupby([group_by], observed=True)['risk'].count()

    if custom_order:
        risk_counts = risk_counts.reindex(custom_order)
        total_counts = total_counts.reindex(custom_order)

    fig, ax = plt.subplots(figsize=(8, 5))
    ax = total_counts.plot(kind='bar', color='#4538FF', ax=ax)
    ax.set_ylabel('# Customers')
    ax.set_xlabel(f'{group_by.capitalize()}')
    ax.set_title(f'Risk Distribution by {group_by.capitalize().replace("_", " ")}')
    ax.set_xticklabels([textwrap.fill(str(label), width=10) for label in total_counts.index], rotation=0, ha='center')

    ax2 = ax.twinx()
    ax2.set_yticks([])
    ax2.grid(False)
    ax2.set_ylim(0, 1)

    if 'bad' in risk_counts.columns:
        ax2.plot(risk_counts['bad'], marker='o', linestyle='-', color='#FF2B80', linewidth=2, label='Bad Risk %')
        ax2.legend()
        for i, value in enumerate(risk_counts['bad']):
            ax2.annotate(f'{value:.2f}%', xy=(i, value), xytext=(3, 10), textcoords='offset points', ha='center', va='bottom', fontweight='bold', color='#FF2B80', fontsize=9, bbox=dict(facecolor='white', alpha=0.8, edgecolor='none', boxstyle='round,pad=0.3'))

    return _fig_to_base64(fig)


def generate_credit_amount_plot(df):
    df_local = df.copy()
    total_bad_risk = df_local[df_local['risk'] == 'bad'].shape[0]
    df_local['credit_bin'] = pd.cut(df_local['credit_amount'], bins=range(0, int(df_local['credit_amount'].max()) + 750, 750))

    bad_risk_percentage = df_local.groupby('credit_bin', observed=True)['risk'].value_counts(normalize=True).unstack()['bad']
    bad_risk_in_credit_bin = (df_local[df_local['risk']=='bad'].groupby('credit_bin', observed=True)['risk'].count()/total_bad_risk).cumsum()

    credit_bin_plot = pd.merge(bad_risk_in_credit_bin.to_frame(name='bad_risk_in_credit_bin'), bad_risk_percentage.to_frame(name='bad_risk_percentage'), left_index=True, right_index=True, how='inner')
    credit_bin_plot.drop(credit_bin_plot[credit_bin_plot['bad_risk_percentage']==0].index, inplace=True)

    fig, ax1 = plt.subplots(figsize=(10, 6))
    credit_bin_plot.index = credit_bin_plot.index.astype(str)
    ax1.plot(credit_bin_plot.index, credit_bin_plot['bad_risk_in_credit_bin'], color='#4538FF', label='Bad Risk Cumulative')
    ax1.set_xlabel('Credit Amount Interval')
    ax1.set_ylabel('Bad Risk Cumulative', color='#4538FF')
    ax1.tick_params(axis='y', labelcolor='#4538FF')
    ax1.set_ylim(0, 1)
    ax1.yaxis.set_major_locator(ticker.MultipleLocator(0.1))

    ax2 = ax1.twinx()
    ax2.plot(credit_bin_plot.index, credit_bin_plot['bad_risk_percentage'], color='#FF2B80', label='Bad Risk Percentage')
    ax2.set_ylabel('Bad Risk Percentage', color='#FF2B80')
    ax2.tick_params(axis='y', labelcolor='#FF2B80')
    ax2.set_ylim(0, 1)
    ax2.yaxis.set_major_locator(ticker.MultipleLocator(0.1))

    try:
        threshold_x = credit_bin_plot[credit_bin_plot['bad_risk_in_credit_bin'] >= 0.8].index[0]
        ax1.axvline(x=threshold_x, color='#75e545', linestyle='--', label='~80% of total bad risk customers')
    except Exception:
        pass

    ax1.set_xticks(range(len(credit_bin_plot.index)))
    ax1.set_xticklabels([label.split(', ')[0][1:] for label in credit_bin_plot.index], rotation=45, ha='right')
    lines, labels = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax2.legend(lines + lines2, labels + labels2, loc='upper left')

    plt.title('Credit Amount vs. Bad Risk')
    plt.tight_layout()
    return _fig_to_base64(fig)


def generate_correlation_matrix(df):
    df_local = df.copy()
    mappings = {
        'sex': {'female': 0, 'male': 1},
        'present_employee_since': {'unemployed': 0, '<1y': 1, '1-4y': 2, '4-7y': 3, '>=7y': 4},
        'checking_account': {'no checking account': 0, '< 0 DM': 1, '0 <= ... < 200 DM': 2, '>= 200 DM': 3},
        'savings': {'0 or unk.': 0, '<100 DM': 1, '100-500 DM': 2, '500-1000 DM': 3, '>1000 DM': 4},
        'job': {'unemployed/unskilled non-resident': 0, 'unskilled resident': 1, 'qualified': 2, 'highly qualified': 3}
    }

    for col, mapping in mappings.items():
        if col in df_local.columns:
            df_local[col] = df_local[col].map(mapping).astype(int)

    df_dummies = pd.get_dummies(df_local, dtype=int)

    fig, ax = plt.subplots(figsize=(10, 8))
    corr = df_dummies.corr()
    im = ax.imshow(corr, cmap='coolwarm', vmin=-1, vmax=1)
    ax.set_xticks(range(len(corr.columns)))
    ax.set_xticklabels(corr.columns, rotation=90, fontsize=8)
    ax.set_yticks(range(len(corr.columns)))
    ax.set_yticklabels(corr.columns, fontsize=8)
    fig.colorbar(im, ax=ax, fraction=0.02, pad=0.04)
    plt.title('Correlation Matrix')
    plt.tight_layout()
    return _fig_to_base64(fig)


def generate_all(df):
    """Return dict of name -> base64 PNG for all exploratory plots."""
    plots = {
        'age_distribution': generate_secondary_plot(df, 'age_group'),
        'sex_vs_risk': generate_secondary_plot(df, 'sex'),
        'credit_amount_vs_risk': generate_credit_amount_plot(df),
        'jobs_vs_risk': generate_secondary_plot(df, 'job'),
        'employee_since_vs_risk': generate_secondary_plot(df, 'present_employee_since'),
        'savings_vs_risk': generate_secondary_plot(df, 'savings'),
        'checking_account_vs_risk': generate_secondary_plot(df, 'checking_account'),
        'correlation_matrix': generate_correlation_matrix(df),
    }
    return plots


def save_all_to_dir(df, out_dir=OUT_DIR):
    """Generate all plots and save them as PNG files into `out_dir`."""
    plots = generate_all(df)
    for name, b64 in plots.items():
        path = Path(out_dir) / f"{name}.png"
        with open(path, 'wb') as f:
            f.write(base64.b64decode(b64))
        print('Saved', path)


def main():
    csv_path = Path(__file__).resolve().parents[2] / 'data' / 'syntetic_sample.csv'
    df = pd.read_csv(csv_path)
    df['risk'] = df['risk'].map({0: 'bad', 1: 'good'})
    if 'age_group' not in df.columns:
        df['age_group'] = pd.cut(df['age'], bins=[18,25,32,45,55,60,100], labels=['18-25','26-32','33-45','46-54','55-60','60+'])
    save_all_to_dir(df, OUT_DIR)


if __name__ == '__main__':
    main()
