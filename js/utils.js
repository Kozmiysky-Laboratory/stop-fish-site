/**
 * Shared utility functions for Stop Fish training modules.
 */

/**
 * Fisher-Yates in-place array shuffle.
 * Mutates and returns the array for convenience.
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  return array;
}
