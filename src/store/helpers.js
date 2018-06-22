
const compareids = (p = {}, payload = {}) => {
	return payload.product == p.product;
};

const findproduct = (arr =[], payload = []) => {
	return arr.find(p => compareids(p, payload));
};

module.exports = {
	compareids,
	findproduct
};