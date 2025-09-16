import React, { JSX } from "react";

interface ConfusionMatrixProps {
  labels: string[];
  matrix: number[][];
}

function normalizeMatrix(matrix: number[][]): number[][] {
  return matrix.map((row) => {
    const rowSum = row.reduce((sum, val) => sum + val, 0);
    return row.map((val) => (rowSum > 0 ? val / rowSum : 0));
  });
}

function getColor(value: number): string {
  // Paleta expandida de 20 cores: do verde escuro ao verde claro
  const colors = [
    "#10451D", "#125020", "#155D27", "#176A2E", "#1A7431",
    "#1C8134", "#208B3A", "#239640", "#25A244", "#2DC653",
    "#35CA5A", "#3DD061", "#45D668", "#4AD66D", "#52DE72",
    "#6EDE8A", "#7AE294", "#86E69E", "#92E6A7", "#B7EFC5"
  ];
  const index = Math.min(colors.length - 1, Math.floor(value * colors.length));
  return colors[index];
}

function getColorLegend(): JSX.Element {
  const gradientColors = [
    "#10451D", "#125020", "#155D27", "#176A2E", "#1A7431",
    "#1C8134", "#208B3A", "#239640", "#25A244", "#2DC653",
    "#35CA5A", "#3DD061", "#45D668", "#4AD66D", "#52DE72",
    "#6EDE8A", "#7AE294", "#86E69E", "#92E6A7", "#B7EFC5"
  ];
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-gray-700 mb-1">1.0</div>
      <div className="h-48 w-6 rounded border border-gray-300" style={{
        background: `linear-gradient(to top, ${gradientColors.join(",")})`
      }}></div>
      <div className="text-xs text-gray-700 mt-1">0.0</div>
    </div>
  );
}

export default function ConfusionMatrix({ labels = ["A", "B", "C", "D"], matrix = [[50, 10, 5, 2], [8, 45, 3, 1], [3, 2, 40, 7], [1, 4, 6, 35]] }: ConfusionMatrixProps) {
  const normMatrix = normalizeMatrix(matrix);
  const size = labels.length;

  return (
    <div className="w-full bg-muted/40 flex items-start justify-center">
      <div className="flex items-start justify-center w-full">
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
                    style={{ backgroundColor: getColor(value), color: value > 0.5 ? "white" : "black" }}
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