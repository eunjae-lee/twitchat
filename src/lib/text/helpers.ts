import { getContext } from 'svelte';

type Lang = 'ko' | 'en';
type Dictionary = {
	ko: Record<string, string>;
	en: Record<string, string>;
};

function getText(dictionary: Dictionary, key: string) {
	const lang = getContext('lang') as Lang;
	return dictionary[lang][key];
}

function getter(dictionary: Dictionary) {
	return (key: string) => getText(dictionary, key);
}

export { getter };
