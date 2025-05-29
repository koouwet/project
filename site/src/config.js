import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '..', 'config', 'config.json');
export const config = JSON.parse(await readFile(configPath, "utf-8"));
