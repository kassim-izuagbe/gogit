#!/usr/bin/env node

/**
 * @file Generates a GitHub link based on a branch or pull request value,
 * then opens the link in the default web browser.
 *
 * @author Kassim Izuagbe <kassim.izuagbe@blendapps.com>
 *
 * @example node git_navigation_tool.js T1234 --t br
 */

const { exec } = require('child_process');

/**
 * Repository URL that the tool uses to generate links.
 * @constant {string}
 */
const repoUrl = process.env.REPO_URL;


/**
 * Prints usage instructions and exits the process.
 */
function usage() {
  console.log("Usage: node git_navigation_tool.js <value> [--type branch|pr]");
  process.exit(1);
}

// Retrieve command line arguments (excluding 'node' and script filename)
const args = process.argv.slice(2);

// Ensure that at least one argument is provided.
if (args.length < 1) {
  usage();
}

/**
 * The branch name or pull request number provided as the first argument.
 * @type {string}
 */
const value = args[0];

/**
 * The type of link to generate ("branch" or "pr").
 * This can be provided via a flag; otherwise, it will be guessed.
 * @type {string|null}
 */
let type = null;

// Check for the '--type' or '-t' flag. Expects the next argument to be the type.
if (args.length >= 3 && (args[1] === "--type" || args[1] === "-t")) {
  type = args[2].toLowerCase();
}

// If type is not provided, guess based on the value.
// If the value consists solely of digits, assume it's a pull request; otherwise, treat it as a branch.
if (!type) {
  type = /^\d+$/.test(value) ? "pr" : "branch";
}

/**
 * The generated GitHub link.
 * @type {string}
 */
let url = "";
if (type === "branch" || type === "br") {
  url = `${repoUrl}/tree/${value}`;
} else if (type === "pr" || type === "pull") {
  url = `${repoUrl}/pull/${value}`;
} else {
  console.error("Unknown type. Please use 'branch' or 'pr'.");
  process.exit(1);
}

console.log("Generated GitHub link:");
console.log(url);

/**
 * Opens the specified URL in the default web browser.
 *
 * This function determines the correct command based on the operating system
 * and uses it to open the provided link.
 *
 * @param {string} link - The URL to open.
 */
function openURL(link) {
  let command;
  switch (process.platform) {
    case 'darwin':
      command = 'open';
      break;
    case 'win32':
      command = 'start';
      break;
    default:
      command = 'xdg-open';
  }
  exec(`${command} "${link}"`, (err) => {
    if (err) {
      console.error("Error opening the browser. Please open the URL manually.");
    }
  });
}

console.log("Navigating to the link...");
openURL(url);
