/**
 * Generates the next sequential ID for an entity.
 * It parses existing IDs, extracts the highest number, and increments it.
 * 
 * @param {string} prefix The string prefix (e.g. 'CUST-', 'tech-', 'F-')
 * @param {string[]} existingIds Array of existing string IDs
 * @param {number} startVal The starting value if no IDs exist
 * @returns {string} The generated ID
 */
function generateNextId(prefix, existingIds, startVal = 1) {
  if (!existingIds || existingIds.length === 0) {
    return `${prefix}${startVal}`;
  }

  let maxNum = 0;
  const regex = new RegExp(`^${prefix}(\\d+)$`, 'i');

  for (const id of existingIds) {
    const match = id.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  }

  // If no IDs matched the prefix specifically, try to parse any trailing number in any ID
  if (maxNum === 0) {
    for (const id of existingIds) {
      const match = id.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  const nextNum = maxNum > 0 ? maxNum + 1 : startVal;
  return `${prefix}${nextNum}`;
}

module.exports = {
  generateNextId,
  customer: (existing) => generateNextId('CUST-', existing, 105),
  technician: (existing) => generateNextId('TECH-', existing, 204),
  job: (existing) => {
    // If existing jobs use 'F-' prefix, use 'F-' otherwise 'JOB-'
    const hasFPrefix = existing.some(id => id.startsWith('F-'));
    return generateNextId(hasFPrefix ? 'F-' : 'JOB-', existing, 5005);
  },
  inventory: (existing) => generateNextId('PART-', existing, 306),
  payment: (existing) => generateNextId('PAY-', existing, 8002),
  notification: (existing) => generateNextId('NOTIF-', existing, 904)
};
