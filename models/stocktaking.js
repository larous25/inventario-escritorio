const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('stocktaking.db')

module.exports = {

  /**
	* create tables
	*/
  createtables () {
    db.get('PRAGMA foreign_keys = ON')

    db.run(`
			CREATE TABLE IF NOT EXISTS SALES( 
				SALE INTEGER PRIMARY KEY AUTOINCREMENT,
				TOTAL INTEGER NOT NULL, 
				COMMENTS TEXT NULL, 
				CREATEAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);`
    )
    db.run(`
			CREATE TABLE IF NOT EXISTS PRODUCTS( 
				PRODUCT INTEGER PRIMARY KEY AUTOINCREMENT,
				PRICE INTEGER NOT NULL, 
				PRICESALE INTEGER NOT NULL, 
				NAME TEXT NOT NULL, 
				TYPE TEXT NULL, 
				COMMENTS TEXT NULL, 
				AMOUNT INTEGER NOT NULL DEFAULT 1, 
				SOLD INTEGER DEFAULT 0
			);
		`)
    db.run(`
			CREATE TABLE IF NOT EXISTS PRODUCTS_HAS_SALES( 
				PRODUCTS_PRODUCT INTEGER NOT NULL,
				SALES_SALE INTEGER NOT NULL,
				AMOUNT INTEGER NOT NULL, 
				FOREIGN KEY (PRODUCTS_PRODUCT) REFERENCES PRODUCTS (PRODUCT) ON DELETE NO ACTION ON UPDATE NO ACTION,
				FOREIGN KEY (SALES_SALE) REFERENCES SALES (SALE) ON DELETE NO ACTION ON UPDATE NO ACTION
			);
		`)
  },

  // // inserts

  // insertRecord(record, cb) {
  // 	let query = createQuery('RECORD', record);
  // 	let values = getObjValues();

  // 	console.log(query, values);
  // },

  // Nota: falta actualizar productos
  // falta actualizar ventas
  /**
	 *
	 * @param {Object} param0 object with all properties necesaries for save
	 * a sale, { products, amount, total, comments }
	 * @param {*} cb if callback if all is success
	 */
  insertsale ({ products, amount, total, comments }, cb) {
    const salesquery = createquery('SALES', { total, comments })

    // save sales
    db.run(salesquery, [total, comments], function (err) {
      if (err) cb(err)

      const phsquery = createquery('PRODUCTS_HAS_SALES', { PRODUCTS_PRODUCT: '', amount, SALES_SALE: '' }, products.length)
      const values = getarrvalues(products.map(a => a), ['product', 'amount'], [this.lastID])

      // save products of cart
      return db.run(phsquery, values, (err, phs) => {
        if (err) cb(err)

        cb(null, phs)
      })
    })
  },

  insertproduct (product, cb) {
    const query = createquery('PRODUCTS', product)
    const values = getobjvalues(product)

    return db.run(query, values, cb)
  },

  // removes

  removeproduct (id, cb) {
    const query = deletequery('PRODUCTS', 'PRODUCT')
    return db.run(query, id, cb)
  },

  removesale (id, cb) {
    const query = deletequery('SALES', 'SALE')
    return db.run(query, id, cb)
  },

  custom (sql = '', cb = () => { }) {
    return db.all(sql, (err, rows) => {
      if (err) cb(err)

      cb(null, tolowercaseproperties(rows))
    })
  },

  // gets

  gettable ({ table = '', id = '', f = 0, q = 0 }, cb = () => { }) {
    return db.all(`SELECT * FROM ${table} ORDER BY ${id} LIMIT ${q} OFFSET ${f}`, (err, rows) => {
      if (err) cb(err)

      cb(null, tolowercaseproperties(rows))
    })
  },

  getcounttable (table = '', cb = () => { }) {
    return db.all(`SELECT count(*) FROM ${table}`, (err, data) => {
      if (err) cb(err)

      cb(null, data[0]['count(*)'])
    })
  },

  getRecord (cb) {
    db.all('SELECT * FROM RECORD', cb)
  },

  /**
	 * @param {Object} product product for update
	 * i pass the first element to last element because the id in
	 * the query string is the last and .run function it works like this
	 * @param {Function} cb callback
	 */
  updateproduct (product = {}, cb = () => {}) {
    const query = updatequery('PRODUCTS', Object.assign({}, product), 'PRODUCT')
    const values = getobjvalues(product)
    const first = values.shift()
    values.push(first)
    return db.run(query, values, cb)
  },

  /**
	 * @param {Array} products
	 * @param {Function} cb callback
	 */
  updateproducts (products = [], cb = () => { }) {
    const queries = products.map(({ product, amount }) => {
      return updatequery('PRODUCTS', { product, amount }, 'PRODUCT')
    })
    const values = getarrvalues(products, ['product', 'amount'])
    const first = values.shift()
    values.push(first)
    return db.run(query, values, cb)
  },

  // falta eliminar los actuales produtos cart
  // y crearlos de nuevo
  updatesale (sale, cb) {
    const query = updatequery('SALES', Object.assign({}, sale), 'SALE')
    const values = getobjvalues(sale)
    const first = values.shift()
    values.push(first)
    db.run(query, values, (err) => {
      if (err) cb(err)
    })
  },

  close () {
    db.close()
  }
}
/**
 * @param {*} table
 * @param {*} id
 * return { String } sql  delete
 */
const deletequery = (table = '', id = '') => {
  return `DELETE FROM ${table} WHERE ${id} =?`
}

const tolowercaseproperties = (rows) => {
  return rows.map(r => {
    return Object.entries(r).reduce((r, [a, b]) => {
      r[a.toLowerCase()] = b
      return r
    }, {})
  })
}
/**
 *
 * @param {*} table
 * @param {*} obj
 * @param {*} id
 * return { String } sql for update values
 */
const updatequery = (table = '', obj = {}, id = '') => {
  delete obj[id.toLowerCase()]
  const columns = Object.keys(obj).join(' = ?,').toUpperCase()
  return `UPDATE  ${table} SET ${columns}  = ? WHERE ${id} = ?`
}

/**
 *
 * @param {*} table
 * @param {*} obj
 * @param {*} number
 * return { String } sql for insert values
 */
const createquery = (table = '', obj = {}, number = 1) => {
  const columns = Object.keys(obj).join(',').toUpperCase()
  const questionMarks = new Array(Object.keys(obj).length).fill('?').join(',')
  const data = new Array(number).fill(`(${questionMarks})`).join(',')
  return `INSERT INTO ${table} (${columns}) VALUES ${data}`
}

// if don't have properties return all
// and if have return only required
const getobjvalues = (obj = {}, properties = []) => {
  // return Object.values(obj);
  return Object.entries(obj)
    .filter(a => !properties.length || properties.includes(a[0]))
    .map(a => a[1])
}

// take a array of objects
// and become each object in an array of
// its values
const getarrvalues = (arr = [], selected = [], added = []) => {
  return arr.reduce((a, obj) => {
    a.push(...getobjvalues(obj, selected))

    if (added.length > 0) {
      a.push(...added)
    }

    return a
  }, [])
}
