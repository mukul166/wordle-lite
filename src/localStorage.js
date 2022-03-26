const STORAGE_KEY_PREFIX = 'WORDLE_1.0.0_';
export function saveState(STORAGE_KEY, storeState, ignorePrefix = false) {
	try {
		const key = ignorePrefix ? STORAGE_KEY : STORAGE_KEY_PREFIX + STORAGE_KEY;
		const serializedState = JSON.stringify(storeState);
		localStorage.setItem(key, serializedState);
		return true;
	} catch (error) {
		console.warn('store serialization failed'); // eslint-disable-line no-console
	}
	return false;
}

export function loadState(STORAGE_KEY, ignorePrefix = false) {
	try {
		const key = ignorePrefix ? STORAGE_KEY : STORAGE_KEY_PREFIX + STORAGE_KEY;
		const serializedState = localStorage.getItem(key);
		if (serializedState == null) return null;
		return JSON.parse(serializedState);
	} catch (error) {
		console.warn('store deserialization failed', error); // eslint-disable-line no-console
	}
	return null;
}

export function removeState(STORAGE_KEY, ignorePrefix = false) {
	if (Array.isArray(STORAGE_KEY)) {
		STORAGE_KEY.forEach((key) => localStorage.removeItem(ignorePrefix ? key : STORAGE_KEY_PREFIX + key));
		return;
	}
	const key = ignorePrefix ? STORAGE_KEY : STORAGE_KEY_PREFIX + STORAGE_KEY;
	localStorage.removeItem(key);
}