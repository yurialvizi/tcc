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
  recall: number;
  f1score: number;
  support: number;
}

interface AvgMetric {
  precision: number;
  recall: number;
  f1score: number;
}

interface MetricsData {
  classMetrics: ClassMetric[];
  accuracy: number;
  macroAvg: AvgMetric;
  weightedAvg: AvgMetric;
}

interface ClassificationMetricsTableProps {
  metrics: MetricsData;
}

export default function ClassificationMetricsTable({ metrics }: ClassificationMetricsTableProps) {
  // Buscar métricas da classe '1'
  const classOne = metrics.classMetrics.find((m) => m.class === '1') || metrics.classMetrics[0];

  // Se ainda não existir, montar a partir de weightedAvg como fallback
  const displayMetric = classOne
    ? classOne
    : {
        precision: metrics.weightedAvg.precision,
        recall: metrics.weightedAvg.recall,
        f1score: metrics.weightedAvg.f1score,
        support: metrics.classMetrics.reduce((sum, m) => sum + m.support, 0),
      };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Table className="w-full max-w-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Metric</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-left font-medium">Accuracy</TableCell>
            <TableCell className="text-right">{(metrics.accuracy ?? 0).toFixed(4)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left font-medium">Precision</TableCell>
            <TableCell className="text-right">{(displayMetric.precision).toFixed(4)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left font-medium">Recall</TableCell>
            <TableCell className="text-right">{(displayMetric.recall ).toFixed(4)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left font-medium">F1-score</TableCell>
            <TableCell className="text-right">{(displayMetric.f1score).toFixed(4)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left font-medium">Support</TableCell>
            <TableCell className="text-right">{Number(displayMetric.support).toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}