const config = require('../config')
const API = require('./vente')

async function get() {

  try {
    const response = await fetch('https://sell.app/api/v1/coupons', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.sellapp.api}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.statusText}`);
    }

    const coupons = await response.json();
    return coupons;
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}


async function usage(couponid) {
  try {
    let usages = 0;
    const transactions = await API.transtions();
    transactions.map((transaction) => {
      if (transaction.coupon_id !== null) {
        if (transaction.coupon_id === couponid) {
          usages++;
        }
      }
    });

    return usages;
  } catch (error) {
    console.error('Erreur:', error.message);
    throw error;
  }
}

async function create(name) {
  const couponsdata = {
    code: name,
    type: 'PERCENTAGE',
    discount: 10,
    store_wide: true,
    expires_at: '2033-12-24 12:00:00' 
  };
  try {
    const response = await fetch("https://sell.app/api/v1/coupons", {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + config.sellapp.api,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(couponsdata),
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.statusText}`);
    }

    const createcoupons = await response.json();

    return createcoupons;
  } catch (error) {
    console.error('Erreur:', error.message);
    throw error;
  }
}


async function del(code) {
  try {
    const response = await fetch(`https://sell.app/api/v1/coupons/${code}`,  { 
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer '+ config.sellapp.api
    }
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.statusText}`);
    }

    const delcoupons = await response.json();

    return delcoupons;
  } catch (error) {
    console.error('Erreur:', error.message);
    throw error;
  }
}

module.exports = {
  get,
  usage,
  create,
  del
}