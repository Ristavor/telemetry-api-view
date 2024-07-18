export const processShapeAData = (
  params: { [key: string]: any },
  inputData: string
): string => {
  return `${params.parameter1}-${params.parameter2}:${inputData}`;
};

export const processShapeBData = (
  params: { [key: string]: any },
  inputData: string
): string => {
  return `${inputData}:${params.parameter1}-${params.parameter2}`;
};

export const processShapeCData = (
  params: { [key: string]: any },
  inputData: string
): string => {
  return `${params.parameter1}${inputData}${params.parameter2}`;
};

export const toleranceBasedFilter = (
  params: { [key: string]: any },
  inputData: string
): string => {
  const tolerance = parseFloat(params.tolerance);
  const [timeStampsStr, timeSeriesStr] = inputData.split(";");
  const timeStamps = timeStampsStr.split(",").map(Number);
  const timeSeries = timeSeriesStr.split(",").map(Number);

  if (timeStamps.length !== timeSeries.length || timeStamps.length === 0) {
    throw new Error("Invalid input data.");
  }

  const n = timeStamps.length;
  const valid = new Array(n).fill(false);
  valid[0] = true;

  for (let i = 1; i < n; i++) {
    if (valid[i - 1]) {
      valid[i] = Math.abs(timeSeries[i] - timeSeries[i - 1]) <= tolerance;
    } else {
      valid[i] = Math.abs(timeSeries[i] - timeSeries[i - 2]) <= tolerance;
    }
  }

  const filteredTimeStamps = [];
  const filteredTimeSeries = [];
  for (let i = 0; i < n; i++) {
    if (valid[i]) {
      filteredTimeStamps.push(timeStamps[i]);
      filteredTimeSeries.push(timeSeries[i]);
    }
  }

  const resultTimestamps = filteredTimeStamps.join(",");
  const resultTimeSeries = filteredTimeSeries.join(",");
  return `Timestamps:${resultTimestamps} | TimeSeries:${resultTimeSeries}`;
};

export const dataProcessors: {
  [key: string]: (params: { [key: string]: any }, inputData: string) => string;
} = {
  processShapeAData,
  processShapeBData,
  processShapeCData,
  toleranceBasedFilter,
};
