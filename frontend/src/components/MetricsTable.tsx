import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ClassMetric {
  class: string;
  precision: number;
  specificity: number;
  f1score: number;
  recall: number;
  training_time: number;
}

interface AvgMetric {
  precision: number;
  recall: number;
  f1score: number;
  specificity: number;
  training_time: number;
}

interface MetricsData {
  classMetrics: ClassMetric[];
  accuracy: number;
  macroAvg: AvgMetric;
  weightedAvg: AvgMetric;
}

interface ClassificationMetricsTableProps {
  metrics: Partial<MetricsData>;
}

export default function ClassificationMetricsTable({ metrics }: ClassificationMetricsTableProps) {
  // Provide safe defaults if metrics data is missing
  const safeMetrics: MetricsData = {
    classMetrics: metrics.classMetrics || [],
    accuracy: metrics.accuracy ?? 0,
    macroAvg: metrics.macroAvg || { precision: 0, recall: 0, f1score: 0, specificity: 0, training_time: 0 },
    weightedAvg: metrics.weightedAvg || { precision: 0, recall: 0, f1score: 0, specificity: 0, training_time: 0 },
  };

  // Buscar métricas da classe '1'
  const classOne = safeMetrics.classMetrics.length > 0
    ? (safeMetrics.classMetrics.find((m) => m.class === '1') || safeMetrics.classMetrics[0])
    : null;

  // Se ainda não existir, montar a partir de weightedAvg como fallback
  const displayMetric = classOne
    ? classOne
    : {
        precision: safeMetrics.weightedAvg.precision,
        recall: safeMetrics.weightedAvg.recall,
        f1score: safeMetrics.weightedAvg.f1score,
        specificity: safeMetrics.weightedAvg.specificity,
        training_time: safeMetrics.weightedAvg.training_time,
      };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Table className="w-full max-w-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Métrica</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-left font-medium">Acurácia</TableCell>
            <TableCell className="text-right">{(safeMetrics.accuracy ?? 0).toFixed(4)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left font-medium">Recall</TableCell>
            <TableCell className="text-right">{(displayMetric.recall).toFixed(4)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left font-medium">Especificidade</TableCell>
            <TableCell className="text-right">{(displayMetric.specificity ?? 0).toFixed(4)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left font-medium">Precisão</TableCell>
            <TableCell className="text-right">{(displayMetric.precision).toFixed(4)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left font-medium">F1-Score</TableCell>
            <TableCell className="text-right">{(displayMetric.f1score).toFixed(4)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left font-medium">Tempo de Treino</TableCell>
            <TableCell className="text-right">{(displayMetric.training_time ?? 0).toFixed(2)}s</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}