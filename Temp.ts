function getValueByKey(array, inputKey) {
  const foundItem = array.find(item => item.key === inputKey);
  return foundItem ? foundItem.text : null; // Return text if found, otherwise return null
}

// Example usage
const data = [
  { key: 'IMN', text: 'Isle of Man' },
  { key: 'GBR', text: 'United Kingdom of Great Brit' },
  { key: 'JEY', text: 'Jersey' },
  { key: 'GGY', text: 'Guernsey' }
];

const inputKey = 'JEY';
const result = getValueByKey(data, inputKey);
console.log(result); // Output: Jersey