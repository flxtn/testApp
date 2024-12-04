"use client";

import axios from "axios";
import { useState } from "react";

export function Home() {
  const [concurrency, setConcurrency] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const totalRequests = 1000;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const sendRequest = async (index: number) => {
    try {
      const response = await axios.post("http://localhost:3000/api", { index });
      setResults((prevResults) => [...prevResults, response.data.index]);
    } catch (error: any) {
      setResults((prevResults) => [
        ...prevResults,
        `Error for request ${index}: ${error.response?.status}`,
      ]);
    }
  };

  const startRequests = async () => {
    if (concurrency < 1 || concurrency > 100) {
      alert("Invalid concurrency value");
      return;
    }

    setIsRunning(true);
    setResults([]);

    const requests: Promise<void>[] = [];
    let requestIndex = 1;
    const activeRequests = new Set<Promise<void>>();

    const sendBatchRequests = async () => {
      const interval = 1000 / concurrency;

      while (requestIndex <= totalRequests) {
        while (
          activeRequests.size < concurrency &&
          requestIndex <= totalRequests
        ) {
          const request = sendRequest(requestIndex).finally(() =>
            activeRequests.delete(request)
          );
          activeRequests.add(request);
          requests.push(request);
          requestIndex++;
        }

        if (activeRequests.size >= concurrency) {
          await delay(interval);
        }
      }
    };

    await sendBatchRequests();

    await Promise.all(requests);

    setIsRunning(false);
    alert("All requests sent");
  };

  return (
    <div className="flex justify-center">
      <div className="mt-5">
        <h1>Requests</h1>
        <div>
          <input
            type="number"
            value={concurrency}
            className="text-black"
            onChange={(e) => setConcurrency(Number(e.target.value))}
            disabled={isRunning}
            min="1"
            max="100"
          />
        </div>

        <button onClick={startRequests} disabled={isRunning}>
          Start
        </button>

        {results.map((result, index) => (
          <div key={index}>Request with index: {result}</div>
        ))}
      </div>
    </div>
  );
}

export default Home;
