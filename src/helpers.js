/**
 *
 * @param {number} time - How much time have to sleep
 * @param {string} unit - Unit of time ['s'-seconds,'m'-minute,'h'-houre]
 */
export const sleep = (time, unit) => new Promise((resolve) => {
	const ms = unit === 'SEC' 
		? time * 1000 
		: unit === 'MIN' 
			? time * 60 * 1000 
			: unit === 'HOUR' 
				? time * 60 * 60 * 1000 
				: time;
	setTimeout(() => resolve(), ms);
});
