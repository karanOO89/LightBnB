const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require("pg");
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 *
 *
 */
function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

const getUserWithEmail = function (email) {
  const queryString = `SELECT * FROM users WHERE email = $1`;
  values = [email];
  return pool
    .query(queryString, values)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      return err.message;
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `SELECT * FROM users WHERE id = $1`;
  values = [id];
  return pool
    .query(queryString, values)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      return err.message;
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *`;
  values = [user.name, user.email, user.password];
  return pool
    .query(queryString, values)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      return err.message;
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `
  SELECT properties.* ,reservations.start_date ,reservations.end_date FROM reservations
  JOIN properties ON properties.id =  reservations.property_id
  JOIN users ON reservations.guest_id = users.id 
  WHERE guest_id = $1 AND reservations.end_date < now()::date
  ORDER BY start_date DESC
  LIMIT $2`;

  values = [guest_id, limit];
  return pool
    .query(queryString, values)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      return err.message;
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
      SELECT properties.*, avg(property_reviews.rating) as average_rating
      FROM properties
      JOIN property_reviews ON properties.id = property_id
      WHERE true
      `;
   
  if (options.city) {
    const city = titleCase(options.city);
    queryParams.push(`%${city}%`);
    queryString += `AND city LIKE $${queryParams.length} `;
  }
  console.log(options);
  if (options.minimum_price_per_night) {
    const price = options.minimum_price_per_night;
    queryParams.push(`${price}` * 100);
    queryString += `AND properties.cost_per_night >= $${queryParams.length} `;
  }
  if (options.maximum_price_per_night) {
    const price = options.maximum_price_per_night;
    queryParams.push(`${price}` * 100);
    queryString += `AND properties.cost_per_night <= $${queryParams.length} `;
  }
  if (options.minimum_rating) {
    const rating = options.minimum_rating;
    queryParams.push(`${rating}`);
    queryString += `AND property_reviews.rating >= $${queryParams.length} `;
  }
  // if (options.owner_id) {
  //   const owner_id = options.owner_id;
  //   queryParams.push(`${owner_id}`);
  //   queryString += `AND properties.owner_id = $${queryParams.length} `;
  // }
 
  queryParams.push(limit);
  queryString += `
      GROUP BY properties.id
      ORDER BY cost_per_night
      LIMIT $${queryParams.length};
      `;
  return pool.query(queryString, queryParams).then((res) => {
    return res.rows;
  });
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
