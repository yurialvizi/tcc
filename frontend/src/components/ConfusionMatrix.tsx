"use client";

import React, { JSX, useEffect, useState } from "react";
import API_CONFIG from "@/lib/api-config";

interface ConfusionMatrixProps {
  labels?: string[];
  matrix?: number[][];
  // optional model name to fetch metrics for (defaults to random-forest)
  modelName?: string;
}

function normalizeMatrix(matrix: number[][]): number[][] {
  return matrix.map((row) => {
    const rowSum = row.reduce((sum, val) => sum + val, 0);
    return row.map((val) => (rowSum > 0 ? val / rowSum : 0));
  });
}

function getColor(value: number): string {
  // kept for backwards compatibility; use getRgbFromValue internally
  const [r, g, b] = getRgbFromValue(value);
  return `rgb(${r}, ${g}, ${b})`;
}

function getRgbFromValue(value: number): [number, number, number] {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const v = clamp(value);
  const r = Math.round(69 + (255 - 69) * v);
  const g = Math.round(56 + (43 - 56) * v);
  const b = Math.round(255 + (128 - 255) * v);
  return [r, g, b];
}

function getContrastColor(value: number): string {
  const [r, g, b] = getRgbFromValue(value);
  const srgb = [r, g, b].map((c) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  });
  const lum = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  return lum > 0.5 ? 'black' : 'white';
}

function getColorLegend(): JSX.Element {
  const start = 'rgba(69, 56, 255, 1)';
  const end = 'rgba(255, 43, 128, 1)';
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-gray-700 mb-1">1.0</div>
      <div className="h-48 w-6 rounded border border-gray-300" style={{
        background: `linear-gradient(180deg, ${end} 0%, ${start} 100%)`
      }}></div>
      <div className="text-xs text-gray-700 mt-1">0.0</div>
    </div>
  );
}

export default function ConfusionMatrix({ labels: initialLabels = ["Good", "Bad"], matrix: initialMatrix, modelName = 'random-forest' }: ConfusionMatrixProps) {
  const [matrix, setMatrix] = useState<number[][]>(
    initialMatrix ?? [[50, 10, 5, 2], [8, 45, 3, 1], [3, 2, 40, 7], [1, 4, 6, 35]]
  );
  const [labels, setLabels] = useState<string[]>(initialLabels);
  const [loading, setLoading] = useState<boolean>(!initialMatrix);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialMatrix) return; 

    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_CONFIG.SHAP_BASE_URL}/metrics/${modelName}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();

        if (data && data.confusion_matrix && Array.isArray(data.confusion_matrix)) {
          if (mounted) setMatrix(data.confusion_matrix as number[][]);
        }

        if (data && data.classification_report) {
          const cr = data.classification_report;
          const classKeys = Object.keys(cr).filter(
            (k) => k !== 'accuracy' && k !== 'macro avg' && k !== 'weighted avg'
          );
          if (classKeys.length > 0 && mounted) {
            const newLabels = classKeys.map((k) => (k === '0' ? 'Good' : k === '1' ? 'Bad' : k));
            setLabels(newLabels);
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch confusion matrix:', err);
        if (mounted) setError(err?.message ?? String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [initialMatrix, modelName]);

  const normMatrix = normalizeMatrix(matrix);
  const size = labels.length;

  return (
    <div className="w-full bg-muted/40 flex items-start justify-center">
      <div className="flex items-start justify-center w-full">
        {loading && (
          <div className="absolute z-10 p-4 text-sm text-gray-700">Carregando matriz...</div>
        )}
        <div className="flex items-center" style={{ height: `${size * 80 + 70}px` }}>
          <div 
            className="text-sm text-gray-600 font-medium"
            style={{
              writingMode: 'vertical-lr',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)'
            }}
          >
            True label
          </div>
        </div>
        
        <div className="flex flex-col flex-1">
          <div className="grid gap-0" style={{
            gridTemplateColumns: `80px repeat(${size}, 1fr)`
          }}>
            <div className="row-span-1 col-span-1"></div>
            {labels.map((label, i) => (
              <div key={i} className="text-center text-gray-600 font-medium text-sm p-2 flex items-end justify-center h-10">
                <span style={{ transformOrigin: 'center' }}>
                  {label}
                </span>
              </div>
            ))}
            {normMatrix.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div className="text-sm text-gray-600 flex items-center justify-end font-medium pr-2 h-20">
                  {labels[rowIndex]}
                </div>
                {row.map((value, colIndex) => (
                  <div
                    key={colIndex}
                    className="flex items-center justify-center h-20 text-sm font-medium border border-gray-300"
                    style={{ backgroundColor: getColor(value), color: getContrastColor(value) }}
                  >
                    {value.toFixed(2)}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="text-sm text-gray-600 font-medium text-center mt-1">
            Predicted label
          </div>
        </div>
        
        <div className="flex items-center pl-16">
          {getColorLegend()}
        </div>
      </div>
    </div>
  );
}