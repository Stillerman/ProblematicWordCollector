export function formatFrequency(freq) {
    if (freq < 1e-4) {
      return freq.toExponential(2);
    } else {
      return freq.toPrecision(2);
    }
  }