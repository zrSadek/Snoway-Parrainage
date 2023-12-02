const config = require('../config');

async function transtions() {
  try {
    const response = await fetch('https://sell.app/api/v1/invoices', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.sellapp.api}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.statusText}`);
    }

    const transactions = await response.json();
    return transactions.data;
  } catch (error) {
    console.error('Erreur:', error.message);
    throw error;
  }
}

module.exports = {
    transtions
};
