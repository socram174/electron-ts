import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";
import fs from "fs";
import chalk from "chalk";
import pkg from "./package.json" assert { type: "json" };
import "dotenv/config";

const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;

const release = async () => {

  const githubToken = GITHUB_TOKEN;
  const owner = GITHUB_OWNER;
  const repo = GITHUB_REPO;


  //Get the version from package.json
  const version = pkg.version;

  // Create a GitHub client
  const octokit = new Octokit({
    auth: githubToken,
  });

  // Check if the version already exists in the repository releases
  await octokit.repos.getLatestRelease({ owner, repo }).then((response) => { 
    if(response.data.tag_name === version){
      console.log(chalk.red("Version already exists"));
      throw new Error("Version already exists");
    };
  });

  // Create a release on GitHub
  console.log("");
  console.log(chalk.blue(`Creating release: ${version}`));
  const createReleaseResponse = await octokit.repos.createRelease({
    owner,
    repo,
    tag_name: `${version}`, // Use your versioning strategy
    name: `${version}`,
    body: "Release notes go here.",
  });

  const releaseId = createReleaseResponse.data.id;

  // Upload the built artifact to the release

  console.log("");


  console.log(chalk.blue(`Uploading Lavanderia-Windows-${chalk.yellow(version)}-Setup.exe`));

  await octokit.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id: releaseId,
    name: `Lavanderia-Windows-${version}-Setup.exe`, // Replace with your built artifact name
    data: fs.readFileSync(
      `./release/${version}/Lavanderia-Windows-${version}-Setup.exe`
    ), // Replace with your actual path
  });

  console.log("Uploading builder-debug.yml");

  await octokit.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id: releaseId,
    name: "builder-debug.yml", // Replace with your built artifact name
    data: fs.readFileSync(`./release/${version}/builder-debug.yml`), // Replace with your actual path
  });

  console.log("Uploading builder-effective-config.yaml");

  await octokit.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id: releaseId,
    name: "builder-effective-config.yaml", // Replace with your built artifact name
    data: fs.readFileSync(`./release/${version}/builder-effective-config.yaml`), // Replace with your actual path
  });

  console.log("Uploading latest.yml");

  await octokit.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id: releaseId,
    name: "latest.yml", // Replace with your built artifact name
    data: fs.readFileSync(`./release/${version}/latest.yml`), // Replace with your actual path
  });

  console.log(`Lavanderia-Windows-${chalk.yellow(version)}-Setup.exe.blockmap`);

  await octokit.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id: releaseId,
    name: `Lavanderia-Windows-${version}-Setup.exe.blockmap`, // Replace with your built artifact name
    data: fs.readFileSync(
      `./release/${version}/Lavanderia-Windows-${version}-Setup.exe.blockmap`
    ), // Replace with your actual path
  });

  console.log(chalk.green(`Release ${chalk.yellow(version)} created successfully.`));
};

release();
