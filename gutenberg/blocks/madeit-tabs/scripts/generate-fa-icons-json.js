/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function exists(filePath) {
	try {
		fs.accessSync(filePath, fs.constants.F_OK);
		return true;
	} catch (e) {
		return false;
	}
}

function mtimeMs(filePath) {
	try {
		return fs.statSync(filePath).mtimeMs;
	} catch (e) {
		return 0;
	}
}

function main() {
	const pkgRoot = path.resolve(__dirname, '..');
	const faRoot = path.join(pkgRoot, 'node_modules', '@fortawesome', 'fontawesome-free');
	const iconsYml = path.join(faRoot, 'metadata', 'icons.yml');
	const iconsJson = path.join(faRoot, 'metadata', 'icons.json');

	if (!exists(faRoot)) {
		console.warn('[madeit-tabs] FontAwesome Free not installed; skipping icons.json generation.');
		return;
	}

	if (!exists(iconsYml)) {
		console.warn('[madeit-tabs] icons.yml not found; skipping icons.json generation.');
		return;
	}

	// If json exists and is newer than yml, keep it.
	if (exists(iconsJson) && mtimeMs(iconsJson) >= mtimeMs(iconsYml)) {
		return;
	}

	const ymlRaw = fs.readFileSync(iconsYml, 'utf8');
	const parsed = yaml.load(ymlRaw);

	// Reduce output size: we only need { [name]: { styles: [...] } } for the picker.
	const reduced = {};
	if (parsed && typeof parsed === 'object') {
		for (const [name, data] of Object.entries(parsed)) {
			const styles = Array.isArray(data && data.styles) ? data.styles : [];
			reduced[name] = { styles };
		}
	}

	fs.writeFileSync(iconsJson, JSON.stringify(reduced), 'utf8');
}

main();
