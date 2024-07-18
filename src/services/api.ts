import axios from "axios";

const API_URL = "http://localhost:8080/api/algorithms";

export const fetchAlgorithms = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const sendAlgorithmData = async (
  algorithmName: string,
  parameters: { [key: string]: any },
  inputData: string
) => {
  const response = await axios.post(API_URL, {
    algorithmName,
    parameters,
    inputData,
  });
  return response.data;
};
