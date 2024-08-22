import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";
import fs from "fs";
import pkg from "./package.json" assert { type: "json" };
import "dotenv/config";

const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;

const release = async () => {
  // Replace with your GitHub token
  const githubToken = GITHUB_TOKEN;
  const owner = GITHUB_OWNER;
  const repo = GITHUB_REPO;

  // Replace with your build command
  //const buildCommand = 'npm run build:win';

  // Get the latest version from your package.json or any other source

  const version = pkg.version;

  // Create a GitHub client
  const octokit = new Octokit({
    auth: githubToken,
  });

  // Execute the build command
  //execSync(buildCommand);

  // Create a release on GitHub
  const createReleaseResponse = await octokit.repos.createRelease({
    owner,
    repo,
    tag_name: `${version}`, // Use your versioning strategy
    name: `${version}`,
    body: "Release notes go here.",
  });

  const releaseId = createReleaseResponse.data.id;

  // Upload the built artifact to the release

  console.log(`Uploading Lavanderia-Windows-${version}-Setup.exe`);

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

  console.log(`Lavanderia-Windows-${version}-Setup.exe.blockmap`);

  await octokit.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id: releaseId,
    name: `Lavanderia-Windows-${version}-Setup.exe.blockmap`, // Replace with your built artifact name
    data: fs.readFileSync(
      `./release/${version}/Lavanderia-Windows-${version}-Setup.exe.blockmap`
    ), // Replace with your actual path
  });

  console.log(`Release ${version} created successfully.`);
};

release();
