'use client'
import { useState } from "react";

export default function Home() {
  const [inputs, setInputs] = useState({
    indicatedForce: 0,
    standardFPIReadings: 0,
    test1: 0,
    test2: 0,
    test3: 0,
    uStd: 0.51, // Predefined standard uncertainty
  });

  const [results, setResults] = useState<{
    mean: number;
    q1: number;
    q2: number;
    q3: number;
    qAvg: number;
    b: number;
    a: number;
    urep: number;
    ures: number;
    expandedUncertainty: number;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: parseFloat(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {
      indicatedForce,
      standardFPIReadings,
      test1,
      test2,
      test3,
      uStd,
    } = inputs;

    const calculatedResults = calculateCalibration(
      indicatedForce,
      standardFPIReadings,
      test1,
      test2,
      test3,
      uStd
    );

    setResults(calculatedResults);
  };

  const calculateCalibration = (
    indicatedForce: number,
    standardFPIReadings: number,
    test1: number,
    test2: number,
    test3: number,
    uStd: number
  ) => {
    const mean = (test1 + test2 + test3) / 3;

    const q1 = ((standardFPIReadings - test1) / standardFPIReadings) * 100;
    const q2 = ((standardFPIReadings - test2) / standardFPIReadings) * 100;
    const q3 = ((standardFPIReadings - test3) / standardFPIReadings) * 100;

    const qAvg = (q1 + q2 + q3) / 3;

    const b = Math.max(
      Math.abs(q1 - qAvg),
      Math.abs(q2 - qAvg),
      Math.abs(q3 - qAvg)
    );

    const a = 0.5 / standardFPIReadings;

    const urep = b / Math.sqrt(3);
    const ures = a / Math.sqrt(3);
    const expandedUncertainty = Math.sqrt(urep ** 2 + ures ** 2 + uStd ** 2);

    return {
      mean,
      q1,
      q2,
      q3,
      qAvg,
      b,
      a,
      urep,
      ures,
      expandedUncertainty,
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Calibration Length Calculator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Indicated Force (KN):
            </label>
            <input
              type="number"
              name="indicatedForce"
              value={inputs.indicatedForce}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Standard FPI Readings:
            </label>
            <input
              type="number"
              name="standardFPIReadings"
              value={inputs.standardFPIReadings}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Test 1 Position 0°:
            </label>
            <input
              type="number"
              name="test1"
              value={inputs.test1}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Test 2 Position 180°:
            </label>
            <input
              type="number"
              name="test2"
              value={inputs.test2}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Test 3 Position 360°:
            </label>
            <input
              type="number"
              name="test3"
              value={inputs.test3}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Calculate
          </button>
        </form>

        {results && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Results:</h2>
            <div className="space-y-2">
              <p>Mean: {results.mean.toFixed(2)}</p>
              <p>Relative Indication Error (q1): {results.q1.toFixed(2)}%</p>
              <p>Relative Indication Error (q2): {results.q2.toFixed(2)}%</p>
              <p>Relative Indication Error (q3): {results.q3.toFixed(2)}%</p>
              <p>Average Relative Indication Error: {results.qAvg.toFixed(2)}%</p>
              <p>Relative Repeatability Error (b): {results.b.toFixed(2)}%</p>
              <p>Relative Resolution (a): {results.a.toFixed(4)}%</p>
              <p>Uncertainty Contribution (Urep): {results.urep.toFixed(4)}%</p>
              <p>Uncertainty Contribution (Ures): {results.ures.toFixed(4)}%</p>
              <p>Expanded Uncertainty: {results.expandedUncertainty.toFixed(4)}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}