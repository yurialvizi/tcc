import {
  Table,
  TableBody,
  TableCaption,
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
  return (
    <div className="flex justify-center w-full">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center"></TableHead>
            <TableHead className="text-center">precision</TableHead>
            <TableHead className="text-center">recall</TableHead>
            <TableHead className="text-center">f1-score</TableHead>
            <TableHead className="text-center">support</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Classes individuais */}
          {metrics.classMetrics.map((metric) => (
            <TableRow key={metric.class}>
              <TableCell className="text-center font-medium">{metric.class}</TableCell>
              <TableCell className="text-center">{metric.precision.toFixed(2)}</TableCell>
              <TableCell className="text-center">{metric.recall.toFixed(2)}</TableCell>
              <TableCell className="text-center">{metric.f1score.toFixed(2)}</TableCell>
              <TableCell className="text-center">{metric.support}</TableCell>
            </TableRow>
          ))}
          
          {/* Linha vazia para separação */}
          <TableRow>
            <TableCell colSpan={5} className="h-2"></TableCell>
          </TableRow>
          
          {/* Accuracy */}
          <TableRow>
            <TableCell className="text-center font-medium">accuracy</TableCell>
            <TableCell className="text-center"></TableCell>
            <TableCell className="text-center"></TableCell>
            <TableCell className="text-center">{metrics.accuracy.toFixed(2)}</TableCell>
            <TableCell className="text-center">{metrics.classMetrics.reduce((sum, m) => sum + m.support, 0)}</TableCell>
          </TableRow>
          
          {/* Macro avg */}
          <TableRow>
            <TableCell className="text-center font-medium">macro avg</TableCell>
            <TableCell className="text-center">{metrics.macroAvg.precision.toFixed(2)}</TableCell>
            <TableCell className="text-center">{metrics.macroAvg.recall.toFixed(2)}</TableCell>
            <TableCell className="text-center">{metrics.macroAvg.f1score.toFixed(2)}</TableCell>
            <TableCell className="text-center">{metrics.classMetrics.reduce((sum, m) => sum + m.support, 0)}</TableCell>
          </TableRow>
          
          {/* Weighted avg */}
          <TableRow>
            <TableCell className="text-center font-medium">weighted avg</TableCell>
            <TableCell className="text-center">{metrics.weightedAvg.precision.toFixed(2)}</TableCell>
            <TableCell className="text-center">{metrics.weightedAvg.recall.toFixed(2)}</TableCell>
            <TableCell className="text-center">{metrics.weightedAvg.f1score.toFixed(2)}</TableCell>
            <TableCell className="text-center">{metrics.classMetrics.reduce((sum, m) => sum + m.support, 0)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}