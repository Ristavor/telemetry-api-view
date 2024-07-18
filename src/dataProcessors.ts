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

export const dataProcessors: {
  [key: string]: (params: { [key: string]: any }, inputData: string) => string;
} = {
  processShapeAData,
  processShapeBData,
  processShapeCData,
};
