"use client";

interface Point {
  bucket: string;
  users: number;
}

export default function BarChart({
  data,
  height = 160,
  formatLabel,
}: {
  data: Point[];
  height?: number;
  formatLabel?: (bucket: string) => string;
}) {
  const max = Math.max(1, ...data.map((d) => d.users));
  const width = 600;
  const padding = { top: 20, right: 8, bottom: 28, left: 24 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const barW = chartW / data.length;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        preserveAspectRatio="none"
        className="min-w-[500px]"
      >
        {/* Gridlines */}
        {[0, 0.5, 1].map((t) => {
          const y = padding.top + chartH * (1 - t);
          return (
            <g key={t}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                className="stroke-neutral-200 dark:stroke-neutral-800"
                strokeWidth="1"
              />
              <text
                x={padding.left - 4}
                y={y + 3}
                textAnchor="end"
                className="fill-neutral-400 dark:fill-neutral-500 text-[9px] font-mono"
              >
                {Math.round(max * t)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const h = (d.users / max) * chartH;
          const x = padding.left + i * barW + barW * 0.15;
          const y = padding.top + (chartH - h);
          const w = barW * 0.7;
          return (
            <g key={d.bucket}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={2}
                className="fill-neutral-900 dark:fill-white"
              >
                <title>{`${d.bucket}: ${d.users} user${d.users === 1 ? "" : "s"}`}</title>
              </rect>
            </g>
          );
        })}

        {/* X axis labels — show first, middle, last */}
        {[0, Math.floor(data.length / 2), data.length - 1].map((i) => {
          if (!data[i]) return null;
          const x = padding.left + i * barW + barW / 2;
          return (
            <text
              key={i}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="fill-neutral-500 dark:fill-neutral-400 text-[9px] font-mono"
            >
              {formatLabel ? formatLabel(data[i].bucket) : data[i].bucket}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
