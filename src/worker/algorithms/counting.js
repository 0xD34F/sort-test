export default function counting(array) {
  let count = [];
  for (let i = 0; i < array.length; i++) {
    count[array[i]] = (count[array[i]] || 0) + 1;
  }

  let index = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i]--) {
      array[index++] = i;
    }
  }

  return array;
};
