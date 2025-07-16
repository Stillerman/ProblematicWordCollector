import freqDataRaw from "./word_freq.json";

import { formatFrequency } from "./formatFreq";

// Remove words with length < 2 that are not 'a' or 'i'
// format probability and add rank
const freqData = freqDataRaw
  .filter((word) => word.word.length >= 2 || ["a", "i"].includes(word.word))
  .map((word, i) => ({ ...word, probability: formatFrequency(word.probability), rank: i }));


const nameData = [
    "Aaron",
    "Abigail",
    "Adam",
    "Adrian",
    "Alan",
    "Alex",
    "Alexander",
    "Alice",
    "Allison",
    "Amanda",
    "Amy",
    "Andrea",
    "Andrew",
    "Andy",
].map((n,i) => ({word: n, probability: 1, rank: i}))

const cityNames = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Philadelphia",
    "San Francisco",
    "Dallas",
    "Austin",
    "San Diego",
    "Seattle",
    "Denver",
    "Washington",
    "Boston",
    "Miami",
    "Atlanta",
    "Detroit",
    "Nashville",
    "Portland",
    "Las Vegas",
    "San Jose",
    "Phoenix",
    "Tampa",
    "Minneapolis",
    "St. Louis",
].map((n,i) => ({word: n, probability: 1, rank: i}))

export const wordLibrary = [
    {
        title: "Common Words",
        words: freqData
    },
    {
        title: "Names",
        words: nameData
    },
    {
        title: "Cities",
        words: cityNames
    }
]
