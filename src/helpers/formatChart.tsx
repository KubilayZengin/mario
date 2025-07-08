import tinycolor from 'tinycolor2';
import { colors } from '../style/theme';

const generateShades = (baseColor: string, steps: number): string[] => {
  return Array.from({ length: steps }, (_, i) => {
    const pct = (i / (steps - 1)) * 30; // adjust factor as needed
    return tinycolor(baseColor).lighten(pct).toHexString();
  });
};

export const getShade = (baseColor: string, pct: number): string => {
  return tinycolor(baseColor).lighten(pct).toHexString();
};

export const formatChart = (config: any): any => {
  const configClone: any = JSON.parse(JSON.stringify(config));
  const isPie = configClone.type === 'pie' || configClone.type === 'doughnut';
  const isHorizontal = configClone.options?.indexAxis === 'y';
  const dominantAxis = isHorizontal ? 'x' : 'y';
  const secondaryAxis = isHorizontal ? 'y' : 'x';
  const isMobile = window.innerWidth < 768;

  // Fallback datalabel formatter
  let formatter = (value: any) =>
    typeof value === 'number' ? value.toLocaleString() : String(value);

  try {
    const userFormatter = configClone.options?.plugins?.datalabels?.formatter;
    if (typeof userFormatter === 'string') {
      formatter = eval(`(${userFormatter})`);
    }
  } catch (e) {
    console.error(`Failed to parse datalabels formatter for chart`, e);
  }

  // Ensure plugins object exists
  configClone.options = {
    ...configClone.options,
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: null },
    hover: { mode: null },
    plugins: {
      ...(configClone.options.plugins || {}),
      tooltip: { enabled: false },
      legend: isPie
        ? {
            display: true,
            position: 'bottom',
            align: 'center',
            labels: {
              boxWidth: 12,
              padding: 10,
              font: { size: 12 },
            },
          }
        : { display: false },
      title: { display: false },
      datalabels: {
        formatter,
        color: isPie ? '#fff' : colors.content.secondary,
        anchor: isPie ? 'center' : 'end',
        align: isPie ? 'center' : 'end',
        font: {
          family: '"Nunito Sans", sans-serif',
          weight: 'bold',
          size: isPie ? 18 : 22,
        },
      },
    },
    layout: {
      padding: {
        top: isPie || isHorizontal ? 0 : 64,
        right: isPie || !isHorizontal ? 0 : 64,
        bottom: 0,
        left: 0,
      },
    },
  };

  if (isPie) {
    configClone.options.layout = {
      padding: {
        top: 18,
        left: 18,
        right: 18,
        bottom: 10,
      },
    };
  }

  // Clean axis visibility
  configClone.options.scales = {
    ...configClone.options.scales,
    x: {
      display: false,
    },
    y: { display: false },
  };

  if (!isPie) {
    try {
      configClone.data.labels = configClone.data.labels.map((label: string) => {
        if (label.length < 16) {
          return label;
        }

        const words = label.split(' ');
        const halfway = Math.ceil(words.length / 2);
        const line1 = words.slice(0, halfway).join(' ');
        const line2 = words.slice(halfway).join(' ');
        return [line1, line2];
      });
    } catch {
      //
    }
  }

  if (!isPie) {
    configClone.options.scales[secondaryAxis] = {
      ...configClone.options.scales?.[secondaryAxis],
      display: true,
      position: 'bottom',
      border: {
        width: 2,
        color: colors.stroke.default,
      },
      ticks: {
        display: true,
        padding: 12,
        color: colors.content.secondary,
        font: {
          family: '"Nunito Sans", sans-serif',
          weight: 'bold',
          size: isMobile ? 7 : 14,
        },
      },
      grid: {
        display: false,
        drawTicks: false,
        drawBorder: false,
      },
    };
  }

  // Apply colors
  configClone.data.datasets = configClone.data.datasets.map((dataset: any) => {
    const count = dataset.data.length;
    let backgroundColors: string[] = [];

    if (count === 2) {
      backgroundColors = ['#86d6af', '#9c89ce'];
    } else {
      backgroundColors = ['#86d6af', '#9c89ce', '#e3b77c', '#8ab3c3', '#e288a4'].slice(0, count);
    }

    if (backgroundColors.length < count) {
        const missingCount = count - backgroundColors.length;
        const fallbackShades = generateShades('#86d6af', missingCount);

        backgroundColors = [...backgroundColors, ...fallbackShades];
      }

    // Apply datalabel colors for non-pie
    if (!isPie) {
      configClone.options.plugins.datalabels.color = (ctx: any) => {
        const index = ctx.dataIndex;
        return backgroundColors[index % backgroundColors.length];
      };
    }

    // If there are more than four slices in a pie, use a smaller label
    if (isPie && count > 4) {
      configClone.options.plugins.datalabels.font.size = 14;
    }

    return {
      ...dataset,
      backgroundColor: backgroundColors,
      hoverBackgroundColor: backgroundColors,
      borderColor: undefined,
      pointBackgroundColor: undefined,
      pointRadius: 0,
    };
  });

  // Enhance bar chart appearance
  const isBar = configClone.type === 'bar';
  if (isBar) {
    configClone.data.datasets = configClone.data.datasets.map(
      (dataset: any) => ({
        ...dataset,
        borderRadius: 4, // rounded corners
        barPercentage: 0.7,
        categoryPercentage: 0.8,
        backgroundColor: dataset.backgroundColor,
        hoverBackgroundColor: dataset.hoverBackgroundColor,
      }),
    );
  }

  return configClone;
};

export const formatSingleValueMetric = (label: string, config: any) => {
  const value = config.data.datasets[0].data[0];
  const formatterString = config.options.plugins.datalabels.formatter;
  const formattedValue = eval(`(${formatterString})(${value})`);

  return new DOMParser().parseFromString(
    `
    <div class="stat">
      <div class="stat-value${formattedValue.length > 12 ? ' small' : ''}">${formattedValue}</div>
      <div class="stat-label">${label}</div>
    </div>`,
    'text/html',
  ).body.childNodes;
};
