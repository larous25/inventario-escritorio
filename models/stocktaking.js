const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('stocktaking.db')
const bcrypt = require('bcryptjs');

module.exports = {

  /**
  * create tables
  */
  async createtables() {
    db.get('PRAGMA foreign_keys = ON')

    db.run(`
      CREATE TABLE IF NOT EXISTS USERS(
        USER INTEGER PRIMARY KEY AUTOINCREMENT,
        USERNAME TEXT NOT NULL UNIQUE,
        PASSWORD TEXT NOT NULL,
        ROLE TEXT NOT NULL DEFAULT 'seller',
        CREATEAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // create default user
    const passwordHash = await bcrypt.hash('user', 10);
    const sqlInsertDefault = `
      INSERT OR IGNORE INTO USERS (USER, USERNAME, PASSWORD, ROLE) 
      VALUES (1, 'user', ?, 'admin')
    `;
    db.run(sqlInsertDefault, [passwordHash], (err) => {
      if (err) console.error("Error al crear usuario por defecto:", err);
      else console.log("Usuario por defecto verificado/creado.");
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS PRODUCTS( 
        PRODUCT INTEGER PRIMARY KEY AUTOINCREMENT,
        PRICE INTEGER NOT NULL,
        PRICESALE INTEGER NOT NULL,
        NAME TEXT NOT NULL,
        TYPE TEXT NULL,
        COMMENTS TEXT NULL,
        AMOUNT INTEGER NOT NULL DEFAULT 1,
        CREATEAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)


    db.run(`
      CREATE TABLE IF NOT EXISTS SALES( 
        SALE INTEGER PRIMARY KEY AUTOINCREMENT,
        TOTAL INTEGER NOT NULL DEFAULT 0,
        COMMENTS TEXT NULL,
        CREATED_BY INTEGER NOT NULL,
        UPDATED_BY INTEGER NULL,
        CREATEAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UPDATEDAT TIMESTAMP NULL,
        FOREIGN KEY (CREATED_BY)
          REFERENCES USERS(USER),
        FOREIGN KEY (UPDATED_BY)
          REFERENCES USERS(USER)
      );
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS PRODUCTS_HAS_SALES( 
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      PRODUCTS_PRODUCT INTEGER NOT NULL,
      SALES_SALE INTEGER NOT NULL,
      AMOUNT INTEGER NOT NULL DEFAULT 1,
      UNITPRICE INTEGER NOT NULL,
      SUBTOTAL INTEGER NOT NULL,
      UNIQUE(PRODUCTS_PRODUCT, SALES_SALE),
      FOREIGN KEY (PRODUCTS_PRODUCT)
        REFERENCES PRODUCTS (PRODUCT)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      FOREIGN KEY (SALES_SALE)
        REFERENCES SALES (SALE)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    );
  `)
  },

  /**
   *
   * @param {Object} param0 object with all properties necesaries for save
   * a sale, { products, amount, total, comments }
   * @param {*} cb if callback if all is success
   */
  insertsale(saleData, cb) {
    const { products, total, comments, created_by } = saleData;

    db.serialize(() => {

      db.run("BEGIN TRANSACTION");


      const sqlSale = `INSERT INTO SALES (TOTAL, COMMENTS, CREATED_BY) VALUES (?, ?, ?)`;
      db.run(sqlSale, [total, comments, created_by], function (err) {
        if (err) { db.run("ROLLBACK"); return cb(err); }

        const saleId = this.lastID;


        const sqlPhs = `
        INSERT INTO PRODUCTS_HAS_SALES (
          PRODUCTS_PRODUCT, SALES_SALE, AMOUNT, UNITPRICE, SUBTOTAL
        ) VALUES (?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sqlPhs);


        const sqlUpdateStock = `UPDATE PRODUCTS SET AMOUNT = AMOUNT - ? WHERE PRODUCT = ?`;
        const stmtStock = db.prepare(sqlUpdateStock);

        products.forEach(p => {
          const subtotal = p.amount * p.pricesale;

          stmt.run([p.product, saleId, p.amount, p.pricesale, subtotal]);

          stmtStock.run([p.amount, p.product]);
        });

        stmt.finalize();
        stmtStock.finalize();


        db.run("COMMIT", (err) => {
          if (err) { db.run("ROLLBACK"); return cb(err); }
          cb(null, { saleId });
        });
      });
    });
  },

  insertproduct(product, cb) {
    const query = createquery('PRODUCTS', product)
    const values = getobjvalues(product)

    return db.run(query, values, cb)
  },

  // removes

  removeproduct(id, cb) {
    const query = deletequery('PRODUCTS', 'PRODUCT')
    return db.run(query, id, cb)
  },

  removesale(id, cb) {
    const deleteDetailsQuery = `DELETE FROM PRODUCTS_HAS_SALES WHERE SALES_SALE = ?`;

    db.run(deleteDetailsQuery, id, (err) => {
      if (err) return cb(err);

      const query = deletequery('SALES', 'SALE');
      db.run(query, id, cb);
    });
  },

  custom(sql = '', cb = () => { }) {
    return db.all(sql, (err, rows) => {
      if (err) cb(err)

      cb(null, tolowercaseproperties(rows))
    })
  },

  // gets

  getproductsbysale(saleId, cb) {

    const sql = `
    SELECT p.name, p.pricesale, ps.amount, ps.products_product
    FROM PRODUCTS_HAS_SALES ps
    JOIN PRODUCTS p ON ps.products_product = p.product
    WHERE ps.sales_sale = ?
  `;

    db.all(sql, [saleId], (err, rows) => {
      if (err) return cb(err);
      cb(null, tolowercaseproperties(rows || []));
    });
  },

  gettable({ table = '', id = null, f = 0, q = 0 }, cb = () => { }) {

    const orderColumn = id ? id : (table.toUpperCase() === 'PRODUCTS' ? 'PRODUCT' : 'SALE');

    const sql = `SELECT * FROM ${table} ORDER BY ${orderColumn} LIMIT ${q} OFFSET ${f}`;

    return db.all(sql, (err, rows) => {
      if (err) return cb(err);

      cb(null, tolowercaseproperties(rows || []));
    })
  },

  getcounttable(table = '', cb = () => { }) {
    return db.all(`SELECT count(*) FROM ${table}`, (err, data) => {
      if (err) cb(err)

      cb(null, data[0]['count(*)'])
    })
  },

  getRecord(cb) {
    db.all('SELECT * FROM RECORD', cb)
  },

  // updates
  /**
   * @param {Object} product product for update
   * i pass the first element to last element because the id in
   * the query string is the last and .run function it works like this
   * @param {Function} cb callback
   */
  updateproduct(product = {}, cb = () => { }) {
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
  updateproducts(products = [], cb = () => { }) {
    const queries = products.map(({ product, amount }) => {
      return updatequery('PRODUCTS', { product, amount }, 'PRODUCT')
    })
    const values = getarrvalues(products, ['product', 'amount'])
    const first = values.shift()
    values.push(first)
    return db.run(query, values, cb)
  },


  updatesale(data, cb) {
    const { sale, products, comments, total } = data; // 'sale' es el ID de la venta
    
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      db.run("UPDATE SALES SET TOTAL = ?, COMMENTS = ?, UPDATEDAT = CURRENT_TIMESTAMP WHERE SALE = ?", [total, comments, sale], (err) => {
        if (err) { db.run("ROLLBACK"); return cb(err); }


        db.run("DELETE FROM PRODUCTS_HAS_SALES WHERE SALES_SALE = ?", [sale], (err) => {
          if (err) {
            db.run("ROLLBACK");
            return cb(err);
          }

          const stmt = db.prepare("INSERT INTO PRODUCTS_HAS_SALES (SALES_SALE, PRODUCTS_PRODUCT, AMOUNT, UNITPRICE, SUBTOTAL) VALUES (?, ?, ?, ?, ?)");
          products.forEach((p, index) => {
            // Validación de seguridad para detectar valores nulos
            if (!sale || !p.products_product || !p.amount || !p.pricesale) {
              throw new Error(`Datos incompletos en el producto ${p.name || index}`);
            }

            stmt.run([
              sale,
              p.products_product,
              p.amount,
              p.pricesale,
              p.amount * p.pricesale
            ]);
          });
          stmt.finalize();

          db.run("COMMIT", (err) => {
            if (err) { return cb(err); }
            cb(null);
          });
        });
      });
    });
  },

  close() {
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
